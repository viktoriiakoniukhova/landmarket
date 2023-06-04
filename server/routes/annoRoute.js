const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { isOwner, isInCadastr } = require("../middlewares/annoMiddleware");
const { uploadPhoto, annoImgResize } = require("../middlewares/uploadImages");

const {
  fetchAllAnnos,
  fetchAnno,
  deleteAnno,
  updateAnno,
  createAnno,
  likeAnno,
  uploadImages,
  sendEmail,
  fetchAllAnnosByRegion,
} = require("../controller/annoCtrl");
const router = express.Router();

router.get("/all", fetchAllAnnos);
router.get("/region/:regionCode", fetchAllAnnosByRegion);

router.put(
  "/upload/:id",
  authMiddleware,
  isOwner,
  uploadPhoto.array("images", 10),
  annoImgResize,
  uploadImages
);
router.post("/add/:cadNum", authMiddleware, isInCadastr, createAnno);
router.post("/:id/email", authMiddleware, sendEmail);

router.get("/:id", fetchAnno);
router.delete("/:id", authMiddleware, isOwner, deleteAnno);
router.put("/:id", authMiddleware, isOwner, updateAnno);
router.put("/like/:id", authMiddleware, likeAnno);

module.exports = router;
