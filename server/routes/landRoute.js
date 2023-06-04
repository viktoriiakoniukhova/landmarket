const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { isOwner } = require("../middlewares/annoMiddleware");

const {
  fetchLand,
  fetchFirstTenLand,
  fetchAllLand,
} = require("../controller/landCtrl");
const router = express.Router();

router.get("/land-test-ten", fetchFirstTenLand);
router.get("/land-test-all", fetchAllLand);
router.get("/:cadNum", authMiddleware, fetchLand);

module.exports = router;
