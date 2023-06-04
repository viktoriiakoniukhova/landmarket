const asyncHandler = require("express-async-handler");
const db2 = require("../config/db2");
const Land = db2.model("Land");

const fetchLand = asyncHandler(async (req, res) => {
  const { cadNum } = req.params;
  try {
    const findLand = await Land.findOne({ cadnum: cadNum });
    if (!findLand) throw new Error("В базі відсутня ділянка з таким номером");
    else res.json(findLand);
  } catch (error) {
    throw new Error("В базі відсутня ділянка з таким номером");
  }
});

const fetchFirstTenLand = asyncHandler(async (req, res) => {
  try {
    const firstTenLands = await Land.find({}).limit(10);
    res.json(firstTenLands);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchAllLand = asyncHandler(async (req, res) => {
  try {
    const allLand = await Land.find({}).limit(1000);
    res.json(allLand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  fetchLand,
  fetchFirstTenLand,
  fetchAllLand,
};
