const { generateToken } = require("../config/jwt");
const { generateRefreshToken } = require("../config/refreshToken");
const db1 = require("../config/db1");
const User = db1.model("User");
const Anno = db1.model("Announcment");
const db2 = require("../config/db2");
const Land = db2.model("Land");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const findUser = await User.findOne({ email: email });
  const findUser2 = await User.findOne({ mobile: mobile });

  if (findUser2)
    throw new Error("Користувач з таким номером телефону вже зареєстрований.");

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else throw new Error("Користувач з таким email вже зареєстрований.");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  const isPasswordMatched = await findUser.isPasswordMatched(password);

  if (findUser && isPasswordMatched) {
    const refreshToken = generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      ...findUser._doc,
      token: generateToken(findUser?._id),
    });
  } else throw new Error("Невірний логін або пароль.");
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token in db or not matched.");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("Something is wrong with refresh token.");
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  try {
    const findUsers = await User.find({});
    res.json(findUsers);
  } catch (error) {
    throw new Error();
  }
});

const fetchUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await User.findById(id)
      .populate({
        path: "announcments",
        Model: Anno,
      })
      .populate({
        path: "wishlist",
        Model: Anno,
      });
    res.json(findUser);
  } catch (error) {
    throw new Error();
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const findandDeleteUser = await User.findByIdAndDelete(_id);
    const deletedAnnosCount = await Anno.deleteMany({
      owner: new mongoose.Types.ObjectId(_id),
    });
    res.json(findandDeleteUser);
  } catch (error) {
    throw new Error();
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const updatedData = req.body;

  try {
    const findandUpdateUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    res.json(findandUpdateUser);
  } catch (error) {
    throw new Error();
  }
});

const fetchUserWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const wishlist = await User.findById(_id).populate({
      path: "wishlist",
      Model: Anno,
      populate: {
        path: "cadastrInfo",
        model: Land,
      },
    });
    res.json(wishlist);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchUserAnnos = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const annos = await User.findById(_id).populate({
      path: "announcments",
      Model: Anno,
      populate: {
        path: "cadastrInfo",
        model: Land,
      },
    });

    res.json(annos);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImage = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "image");
    const file = req.file;
    const { destination, filename } = file;
    const path = `${destination}\\user\\${filename}`;
    const newPath = await uploader(path);
    fs.unlinkSync(path);
    const url = newPath;
    const findandUpdateUser = await User.findByIdAndUpdate(
      _id,
      { profileImg: url },
      { new: true }
    );
    res.json(findandUpdateUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  fetchAllUsers,
  fetchUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  logout,
  fetchUserAnnos,
  fetchUserWishlist,
  uploadImage,
};
