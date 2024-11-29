const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
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
    time: {
      type: String,
      required: true,
    },
    additionalMessage: {
      type: String,
      maxlength: 500,
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
    // Common fields
    tripStatus: {
      type: String,
      enum: ["active", "filled", "inProgress", "completed", "cancelled"],
      default: "active",
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  {
    timestamps: true,
  }
);

tripSchema.index({ origin: 1, destination: 1 });
tripSchema.index({ date: 1 });
tripSchema.index({ tripType: 1 });
tripSchema.index({ tripStatus: 1 });

module.exports = mongoose.model("Trip", tripSchema);
