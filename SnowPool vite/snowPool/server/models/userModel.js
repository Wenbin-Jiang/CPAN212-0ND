const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "profile-icon.jpeg",
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    driverHistory: {
      type: String,
    },
    carModel: {
      type: String,
    },
    licensePlate: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    notifications: [
      {
        type: {
          type: String,
          enum: [
            "newBookingRequest",
            "bookingAccepted",
            "bookingDeclined",
            "tripUpdated",
            "paymentReceived",
            "tripStarting",
            "tripCompleted",
          ],
        },
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
        trip: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Trip",
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdTrips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    ratings: {
      asDriver: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
      asPassenger: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
