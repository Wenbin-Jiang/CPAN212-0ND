const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // URL or file path
  profileComplete: { type: Boolean, default: false },
  name: { type: String },
  gender: { type: String },
  birthday: { type: Date },
  address: { type: String },
  phone: { type: String },
  driverHistory: { type: String },
  carModel: { type: String },
  licensePlate: { type: String },
  bio: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
