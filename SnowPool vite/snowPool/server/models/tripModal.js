const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripType: {
    type: String,
    enum: ["driver_trip", "passenger_request"], // Two types: driver trip or passenger request
    required: true,
  },
  // Common fields for both trip types
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  originLocation: {
    type: { lat: Number, lng: Number },
    required: true,
  },
  destinationLocation: {
    type: { lat: Number, lng: Number },
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  additionalMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Specific fields for driver trip
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection (driver)
    required: function () {
      return this.tripType === "driver_trip"; // Required only if it's a driver trip
    },
  },
  seatsAvailable: {
    type: Number,
    required: function () {
      return this.tripType === "driver_trip"; // Required only if it's a driver trip
    },
  },
  pricePerSeat: {
    type: Number,
    required: function () {
      return this.tripType === "driver_trip"; // Required only if it's a driver trip
    },
  },

  // Specific fields for passenger request
  seatsRequired: {
    type: Number,
    required: function () {
      return this.tripType === "passenger_request"; // Required only if it's a passenger request
    },
  },
  willingToPay: {
    type: Number,
    required: function () {
      return this.tripType === "passenger_request"; // Required only if it's a passenger request
    },
  },
});

module.exports = mongoose.model("Trip", tripSchema);
