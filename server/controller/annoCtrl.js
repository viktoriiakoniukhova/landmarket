const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const db1 = require("../config/db1");
const db2 = require("../config/db2");
const User = db1.model("User");
const Anno = db1.model("Announcment");
const Land = db2.model("Land");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createAnno = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const landId = req.land._id;

  const findAnno = await Anno.findOne({ cadastrInfo: landId });

  if (!findAnno) {
    const newAnno = await Anno.create({
      ...req.body,
      owner: ownerId,
      cadastrInfo: landId,
    });

    //add Anno To Owner
    const newUser = await User.findByIdAndUpdate(
      { _id: ownerId },
      { $push: { announcments: newAnno._id } },
      { new: true }
    );

    res.json(newAnno);
  } else
    throw new Error(
      "Оголошення з таким кадастровим номером вже наявне в системі."
    );
});

const fetchAllAnnos = asyncHandler(async (req, res) => {
  try {
    const findAnnos = await Anno.find({}).populate({
      path: "cadastrInfo",
      model: Land,
    });
    res.json(findAnnos);
  } catch (error) {
    throw new Error(error);
  }
});
const fetchAllAnnosByRegion = asyncHandler(async (req, res) => {
  const { regionCode } = req.params;

  try {
    const findAnnos = await Anno.find({}).populate({
      path: "cadastrInfo",
      model: Land,
    });

    const annosByRegion = findAnnos.filter(
      ({ cadastrInfo }) => cadastrInfo.region_code === regionCode
    );

    res.json(annosByRegion);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchAnno = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedAnno = await Anno.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate({
        path: "cadastrInfo",
        model: Land,
      })
      .populate({
        path: "owner",
        model: User,
      });
    res.json(updatedAnno);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAnno = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  const { likes } = await Anno.findById(id);
  try {
    //delete Anno From Owner
    const newUser = await User.findByIdAndUpdate(
      ownerId,
      { $pull: { announcments: new mongoose.Types.ObjectId(id) } },
      { new: true }
    );

    //delete Anno from Users' wishlists
    likes.forEach(async (userId) => {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: new mongoose.Types.ObjectId(id) } },
        { new: true }
      );
    });

    const findandDeleteAnno = await Anno.findByIdAndDelete(id);
    res.json(findandDeleteAnno);
  } catch (error) {
    throw new Error(error);
  }
});

const updateAnno = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const ownerId = req.user._id;

  try {
    const findandUpdateAnno = await Anno.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    //update Anno In Owner
    const newUser = await User.findByIdAndUpdate(
      ownerId,
      { $push: { announcments: id } },
      { new: true }
    );

    res.json(findandUpdateAnno);
  } catch (error) {
    throw new Error(error);
  }
});

const likeAnno = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  try {
    const { owner, likes } = await Anno.findById(id);
    if (
      likes.length &&
      likes.filter((userId) => userId.equals(currentUserId)).length
    ) {
      const findandUpdateAnno = await Anno.findByIdAndUpdate(
        id,
        { $pull: { likes: new mongoose.Types.ObjectId(currentUserId) } },
        { new: true }
      );

      //delete Anno from User's wishlist
      const newUser = await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { wishlist: new mongoose.Types.ObjectId(id) } },
        { new: true }
      );
    } else {
      const findandUpdateAnno = await Anno.findByIdAndUpdate(
        id,
        { $addToSet: { likes: currentUserId } },
        { new: true }
      );

      //add Anno to User's wishlist
      const newUser = await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { wishlist: id } },
        { new: true }
      );
    }
    const updatedAnno = await Anno.findById(id);

    res.json(updatedAnno);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    if (!files) throw new Error("empty");

    for (const file of files) {
      const { destination, filename } = file;
      const path = `${destination}\\annos\\${filename}`;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findAnno = await Anno.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findAnno);
  } catch (error) {
    throw new Error(error);
  }
});

const { send } = require("../config/mail");

const sendEmail = asyncHandler(async (req, res) => {
  const { id } = req.params; // current Anno ID
  const { _id } = req.user; //посилання на профіль користувача
  const findAnno = await Anno.findById(id).populate({
    path: "owner",
    model: User,
  });
  const to = findAnno.owner.email;
  const { title } = findAnno;
  const { name, from, phone, text } = req.body;
  const pre = `Повідомлення від користувача ${name}:`;
  const sign = `Дані користувача, якого зацікавила ваша пропозиція:\nІм'я: ${name}\nТелефон: ${phone}\nЕл. пошта: ${from}`;
  const subject = `Користувача ${name} зацікавила ваша ділянка "${title}"`;
  const textMessage = `${pre}\n\n${text}\n\n_________________________________________________\n${sign}`;
  const data = { from, to, subject, text: textMessage };
  try {
    const recepientEmail = await send(data);
    const { firstname, lastname } = findAnno.owner;
    res.send({
      acceptedBy: recepientEmail,
      firstname: firstname,
      lastname: lastname,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createAnno,
  fetchAllAnnos,
  fetchAnno,
  deleteAnno,
  updateAnno,
  likeAnno,
  uploadImages,
  sendEmail,
  fetchAllAnnosByRegion,
};
