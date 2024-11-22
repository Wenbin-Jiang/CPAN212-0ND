const mongoose = require("mongoose");

const passengerRequestSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  origin: { type: String, required: true },
  originLatLng: { type: [Number], required: true }, // [latitude, longitude]
  destination: { type: String, required: true },
  destinationLatLng: { type: [Number], required: true },
  date: { type: Date, required: true },
  seatsRequired: { type: Number, required: true, min: 1 },
  willingToPay: { type: Number, required: true },
  additionalMessage: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PassengerRequest", passengerRequestSchema);
