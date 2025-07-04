const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
      },
    },
    trip: {
      tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true,
      },
      tripInitiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      tripDate: {
        type: Date,
      },
      tripTime: {
        type: String,
      },
      userName: {
        type: String,
      },
    },
    passengers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: String,
      },
    ],
    driver: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
    },

    requestType: {
      type: String,
      enum: ["passenger", "driver"],
      required: true,
    },
    requestedSeats: {
      type: Number,
      min: 1,
      required: function () {
        return this.requestType === "passenger";
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled", "completed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    pickupLocation: {
      address: String,
      coordinates: [Number],
    },
    dropoffLocation: {
      address: String,
      coordinates: [Number],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ trip: 1, passenger: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
