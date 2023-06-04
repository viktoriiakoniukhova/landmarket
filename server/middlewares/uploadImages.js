const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const annoImgResize = async (req, res, next) => {
  if (!req.files) throw new Error("No files attached");
  await Promise.all(
    req.files.map(async (file) => {
      const pathToSave = path.join(
        __dirname,
        `../public/images/annos/${file.filename}`
      );
      await sharp(file.path)
        .resize(1920, 1080)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(pathToSave);
    })
  );
  req.files.map((file) => {
    const pathToSave = path.join(
      __dirname,
      `../public/images/${file.filename}`
    );
    fs.unlinkSync(pathToSave);
  });
  next();
};

const userImgResize = async (req, res, next) => {
  const file = req.file;
  const pathToSave = path.join(
    __dirname,
    `../public/images/user/${file.filename}`
  );
  if (!req.file) return next();
  try {
    await sharp(file.path)
      .resize(250, 250)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(pathToSave);
    fs.unlinkSync(`public/images/${req.file.filename}`);
  } catch (error) {
    console.error("Error while resizing and sharpening photo:", error);
  }
  next();
};

module.exports = { uploadPhoto, annoImgResize, userImgResize };
