const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var announcmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [{ type: String }],
    techFeautures: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    cadastrInfo: {
      type: Object,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Announcment", announcmentSchema);
