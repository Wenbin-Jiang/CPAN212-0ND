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
    min: 1,
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
});

// Indexes for better query performance
tripSchema.index({ tripType: 1 });
tripSchema.index({ origin: 1, destination: 1 });
tripSchema.index({ date: 1 });
tripSchema.index({ user: 1 });

// Virtual field to determine if the trip is a driver trip or passenger request
tripSchema.virtual("isDriverTrip").get(function () {
  return this.tripType === "driver";
});

// Pre-save middleware to validate required fields based on trip type
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
