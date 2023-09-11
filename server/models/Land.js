const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var landSchema = new mongoose.Schema(
  {
    cadnum: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    purpose_code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    use: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    unit_area: {
      type: String,
      required: true,
    },
    ownershipcode: {
      type: String,
      required: true,
    },
    ownership: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    geometry: {
      type: Object,
      required: true,
    },
    region_code: {
      type: String,
      required: true,
    },
    region_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Land", landSchema);
