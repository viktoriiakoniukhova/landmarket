const express = require("express");
const {
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
} = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { userImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/all", fetchAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

router.get("/announcments", authMiddleware, fetchUserAnnos);
router.get("/wishlist", authMiddleware, fetchUserWishlist);
router.get("/:id", fetchUser);
router.delete("/delete", authMiddleware, deleteUser);
router.put("/edit", authMiddleware, updateUser);
router.put(
  "/upload",
  authMiddleware,
  uploadPhoto.single("image"),
  userImgResize,
  uploadImage
);
module.exports = router;
