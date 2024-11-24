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
  notifications: [
    {
      type: {
        type: String,
        enum: ["joinRequest", "acceptedRequest"],
      },
      trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
