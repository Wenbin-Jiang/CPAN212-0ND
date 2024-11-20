const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seatsBooked: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("booking", bookingSchema);
