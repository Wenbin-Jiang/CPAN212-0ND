const Booking = require("../models/bookingModal");
const Trip = require("../models/tripsModal");
const User = require("../models/userModel");

const getFirstPart = (address) => address?.split(",")[0] || "";

const formatDate = (dateString, time) => {
  try {
    const isoString = dateString.toISOString().split("T")[0];
    const date = new Date(`${isoString}T${time}`);

    return `${date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })} at ${time}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return `${dateString} at ${time}`;
  }
};

const createBookingRequest = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { requestedSeats, requestType, willingToPay } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    // Check for existing booking
    const existingRequest = await Booking.findOne({
      "trip.tripId": tripId,
      "user.userId": userId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a booking request for this trip.",
      });
    }

    const trip = await Trip.findById(tripId).populate("user");
    const user = await User.findById(userId);

    if (!trip) {
      return res.status(404).send("Trip not found");
    }

    if (trip.user._id.toString() === userId) {
      return res.status(400).send("Cannot book your own trip.");
    }

    // Prepare booking data
    const bookingData = {
      user: { userId, userName },
      trip: {
        tripId,
        tripInitiator: trip.user,
        tripDate: trip.date,
        tripTime: trip.time,
        userName: trip.user.name,
      },
      requestType,
      status: "pending",
      pickupLocation: {
        address: trip.origin,
        coordinates: trip.originLatLng,
      },
      dropoffLocation: {
        address: trip.destination,
        coordinates: trip.destinationLatLng,
      },
    };
    // Set driver data
    bookingData.driver = {
      user: requestType === "driver" ? userId : trip.user._id,
      name: requestType === "driver" ? userName : trip.user.name,
    };

    // Initialize empty passengers array
    bookingData.passengers = [];

    if (requestType === "driver") {
      if (!willingToPay || isNaN(willingToPay) || willingToPay <= 0) {
        return res.status(400).json({
          message: "Invalid value for 'willingToPay'.",
        });
      }
      bookingData.totalAmount = Number(willingToPay);
    } else if (requestType === "passenger") {
      if (!requestedSeats || isNaN(requestedSeats) || requestedSeats <= 0) {
        return res.status(400).json({
          message: "Invalid number of requested seats.",
        });
      }

      if (trip.seatsAvailable < requestedSeats) {
        return res.status(400).send("Not enough seats available.");
      }

      bookingData.requestedSeats = Number(requestedSeats);
      bookingData.totalAmount =
        Number(trip.pricePerSeat) * Number(requestedSeats);
    }

    const booking = new Booking(bookingData);
    await booking.save();

    // Notify recipient
    const recipientId =
      requestType === "driver" ? trip.user._id : bookingData.driver.user;
    const recipient = await User.findById(recipientId);

    if (recipient) {
      recipient.notifications.push({
        type: "newBookingRequest",
        booking: booking._id,
        message: `New ${requestType} booking request received for your trip from ${getFirstPart(
          trip.origin
        )} to ${getFirstPart(trip.destination)} on ${formatDate(
          trip.date,
          trip.time
        )}`,
      });
      await recipient.save();
    }

    res.status(200).json({ message: "Request sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { tripId, action } = req.body;

    // First find the trip without population
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (action === "accept") {
      booking.status = "accepted";

      if (booking.requestType === "passenger") {
        // Check seats availability
        if (
          !trip.seatsAvailable ||
          trip.seatsAvailable < booking.requestedSeats
        ) {
          return res.status(400).json({
            success: false,
            message: "Not enough available seats",
          });
        }

        // Update seats available
        const updatedSeats = trip.seatsAvailable - booking.requestedSeats;

        // Use findByIdAndUpdate to ensure atomic update
        const updatedTrip = await Trip.findByIdAndUpdate(
          tripId,
          {
            $set: { seatsAvailable: updatedSeats },
            $push: {
              passengers: {
                userId: booking.user.userId,
                name: booking.user.userName,
              },
            },
          },
          { new: true }
        );

        if (!updatedTrip) {
          throw new Error("Failed to update trip");
        }

        // Update booking passengers
        if (
          !booking.passengers.some(
            (p) => p.userId.toString() === booking.user.userId.toString()
          )
        ) {
          booking.passengers.push({
            userId: booking.user.userId,
            name: booking.user.userName,
          });
        }
      }
    } else if (action === "decline") {
      booking.status = "declined";
    }

    await booking.save();

    // Notify the recipient
    const recipient = await User.findById(booking.user?.userId);
    if (recipient) {
      recipient.notifications.push({
        type: `booking${action === "accept" ? "Accept" : "Declin"}ed`,
        booking: booking._id,
        message: `Your booking request has been ${
          action === "accept" ? "accepted" : "declined"
        }.`,
      });
      await recipient.save();
    }

    // Get the final updated trip for response
    const finalTrip = await Trip.findById(tripId);

    res.status(200).json({
      success: true,
      message: `Booking ${action}ed successfully`,
      data: {
        booking,
        trip: finalTrip,
        status: booking.status,
        seatsAvailable: finalTrip.seatsAvailable,
        passengers: booking.passengers,
      },
    });
  } catch (error) {
    console.error("Booking action error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process booking request",
    });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { "user.userId": req.user.id },
        { "trip.tripInitiator": req.user.id },
      ],
    })
      .populate("trip")
      .populate("driver")
      .sort("-createdAt");
    // console.log("return bookings", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBookingRequest,
  handleBookingRequest,
  getBookingsByUser,
};
