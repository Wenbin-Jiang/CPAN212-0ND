const mongoose = require("mongoose");

const driverTripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  originLatLng: { type: [Number] }, // [latitude, longitude]
  destination: { type: String, required: true },
  destinationLatLng: { type: [Number] },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seatsAvailable: { type: Number, required: true, min: 1 },
  pricePerSeat: { type: Number, required: true },
  additionalMessage: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DriverTrip", driverTripSchema);
