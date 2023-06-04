const asyncHandler = require("express-async-handler");
const db1 = require("../config/db1");
const Anno = db1.model("Announcment");
const db2 = require("../config/db2");
const Land = db2.model("Land");

const isOwner = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // anno id
  const { _id } = req.user;
  const findAnno = await Anno.findById(id);

  if (!findAnno.owner.equals(_id))
    throw new Error("Only owner can modify announcment.");
  else next();
});

const isInCadastr = asyncHandler(async (req, res, next) => {
  const { cadNum } = req.params; // land cadnum
  const findLand = await Land.findOne({ cadnum: cadNum });
  req.land = findLand;
  if (!findLand) throw new Error("There is no land with such number.");
  else next();
});

module.exports = { isOwner, isInCadastr };
