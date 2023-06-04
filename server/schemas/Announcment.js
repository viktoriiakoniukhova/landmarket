const mongoose = require("mongoose"); // Erase if already required
const uniqueValidator = require("mongoose-unique-validator");

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
    images: {
      type: [String],
      default: [
        "https://res.cloudinary.com/dkcxlcszh/image/upload/v1685630925/11zon_resized_mbytel.jpg",
      ],
    },
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Land",
      required: true,
    },
  },
  { timestamps: true }
);

announcmentSchema.plugin(uniqueValidator);

//Export the schema
module.exports = announcmentSchema;
