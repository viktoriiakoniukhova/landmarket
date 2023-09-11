const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    announcments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcment",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcment",
      },
    ],
    refreshToken: {
      type: String,
    },
    address: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
