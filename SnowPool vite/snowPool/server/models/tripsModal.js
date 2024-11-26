const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  // Common fields
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tripType: {
    type: String,
    enum: ["driver", "passenger"],
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  originLatLng: {
    type: [Number],
  },
  destination: {
    type: String,
    required: true,
  },
  destinationLatLng: {
    type: [Number],
  },
  date: {
    type: Date,
    required: true,
  },
  additionalMessage: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
  },

  // Driver-specific fields
  seatsAvailable: {
    type: Number,
    min: 0,
    required: function () {
      return this.tripType === "driver";
    },
  },
  pricePerSeat: {
    type: Number,
    required: function () {
      return this.tripType === "driver";
    },
  },

  // Join requests for the trip
  joinRequests: [
    {
      passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      passengerName: String,
      requestedSeats: { type: Number, min: 1 },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
      },
      requestedAt: { type: Date, default: Date.now },
      respondedAt: { type: Date },
    },
  ],

  // Passengers accepted for the trip
  passengers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      seatsBooked: { type: Number },
      joinedAt: { type: Date, default: Date.now },
    },
  ],

  // Passenger-specific fields
  seatsRequired: {
    type: Number,
    min: 1,
    required: function () {
      return this.tripType === "passenger";
    },
  },
  willingToPay: {
    type: Number,
    required: function () {
      return this.tripType === "passenger";
    },
  },

  //join request to become driver
  driverRequests: [
    {
      driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      driverName: String,
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
      },
      requestedAt: { type: Date, default: Date.now },
      respondedAt: { type: Date },
    },
  ],

  //accepted driver for request
  driver: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      acceptedAt: { type: Date, default: Date.now },
    },
  ],

  //trip status filled,
  requestStatus: {
    type: String,
    enum: ["Open", "Request Filled"],
    default: "Open",
  },
});

// Indexes for better query performance
tripSchema.index({ tripType: 1 });
tripSchema.index({ origin: 1, destination: 1 });
tripSchema.index({ date: 1 });
tripSchema.index({ user: 1 });

// Middleware to validate driver-specific fields
tripSchema.pre("save", function (next) {
  if (
    this.tripType === "driver" &&
    (!this.seatsAvailable || !this.pricePerSeat)
  ) {
    next(
      new Error("Driver trips require time, seatsAvailable, and pricePerSeat")
    );
  } else if (
    this.tripType === "passenger" &&
    (!this.seatsRequired || !this.willingToPay)
  ) {
    next(
      new Error("Passenger requests require seatsRequired and willingToPay")
    );
  } else {
    next();
  }
});

module.exports = mongoose.model("Trip", tripSchema);
