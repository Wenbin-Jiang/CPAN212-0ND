const Booking = require("../models/bookingModal");
const Trip = require("../models/tripsModal");
const User = require("../models/userModel");

const createBookingRequest = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { requestedSeats, requestType, willingToPay } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    // Check for existing booking
    const existingRequest = await Booking.findOne({
      trip: tripId,
      $or: [{ passenger: userId }, { driver: userId }],
    });

    if (existingRequest) {
      console.log("You already have a booking request for this trip.");
      return res.status(400).json({
        message: "You already have a booking request for this trip.",
      });
    }

    const trip = await Trip.findById(tripId).populate("user");

    if (!trip) {
      console.error("Trip not found with ID:", tripId);
      return res.status(404).send("Trip not found");
    }

    console.log("Trip found:", trip);

    if (trip.user._id.toString() === userId) {
      console.error("User is trying to book their own trip:", userId);
      return res.status(400).send("Cannot book your own trip.");
    }

    // Prepare booking data
    const bookingData = {
      user: userId,
      trip: tripId,
      requestType,
      status: "pending",
      pickupLocation: trip.origin,
      dropoffLocation: trip.destination,
      driver: requestType == "driver" ? userId : trip.user._id,
      driverName: requestType == "driver" ? userName : trip.user.name,
      passenger: requestType == "passenger" ? userId : trip.user._id,
      passengerName: requestType == "passenger" ? userName : trip.user.name,
      pickupLocation: {
        address: trip.origin,
        coordinates: trip.originLatLng,
      },
      dropoffLocation: {
        address: trip.destination,
        coordinates: trip.originLatLng,
      },
    };

    if (requestType === "driver") {
      if (!willingToPay || isNaN(willingToPay) || willingToPay <= 0) {
        console.error("Invalid 'willingToPay' value:", willingToPay);
        return res.status(400).json({
          message: "Invalid value for 'willingToPay'.",
        });
      }

      bookingData.driver = userId;
      bookingData.totalAmount = Number(willingToPay);
    } else if (requestType === "passenger") {
      if (!requestedSeats || isNaN(requestedSeats) || requestedSeats <= 0) {
        console.error("Invalid 'requestedSeats' value:", requestedSeats);
        return res.status(400).json({
          message: "Invalid number of requested seats.",
        });
      }

      if (trip.seatsAvailable < requestedSeats) {
        console.error(
          "Not enough seats available. Requested:",
          requestedSeats,
          "Available:",
          trip.seatsAvailable
        );
        return res.status(400).send("Not enough seats available.");
      }

      bookingData.passenger = userId;
      bookingData.requestedSeats = Number(requestedSeats);
      bookingData.totalAmount =
        Number(trip.pricePerSeat) * Number(requestedSeats);
    } else {
      return res.status(400).json({
        message: "Invalid request type. Must be 'driver' or 'passenger'.",
      });
    }

    const booking = new Booking(bookingData);
    await booking.save();
    trip.bookings.push(booking._id);

    if (requestType === "passenger") {
      trip.seatsAvailable -= Number(requestedSeats);
    }

    await trip.save();

    // Notify trip owner or recipient
    const recipientId =
      requestType === "driver" ? trip.user._id : bookingData.driver;
    const recipient = await User.findById(recipientId);

    if (recipient) {
      recipient.notifications.push({
        type: "newBookingRequest",
        booking: booking._id,
        message: `New ${requestType} booking request received for your trip from ${trip.origin} to ${trip.destination} on ${trip.date}`,
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
    const { action } = req.body;
    console.log("bookingid", bookingId);
    console.log("action", action);
    console.log(req.body);
    // Validate action
    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Find the booking and populate the related trip
    const booking = await Booking.findById(bookingId).populate("trip");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking and trip status
    if (action === "accept") {
      booking.status = "accepted";

      // Ensure the trip is valid and has enough available seats
      if (
        booking.requestType === "passenger" &&
        booking.trip &&
        booking.trip.seatsAvailable >= booking.requestedSeats
      ) {
        booking.trip.seatsAvailable -= booking.requestedSeats;
      } else if (
        booking.trip &&
        booking.trip.seatsAvailable < booking.requestedSeats
      ) {
        return res.status(400).json({ message: "Not enough available seats" });
      }
    } else if (action === "decline") {
      booking.status = "declined";
    }

    // Save the booking and related trip
    await booking.save();
    if (booking.trip) {
      await booking.trip.save();
    }

    // Notify the passenger
    const passenger = await User.findById(booking.passenger);

    if (passenger) {
      passenger.notifications.push({
        type: `booking${action}ed`,
        booking: booking._id,
        message: `Your booking request from ${trip.origin} to ${trip.destination} on ${trip.date} has been ${action}ed.`,
      });
      await passenger.save();
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ passenger: req.user.id }, { driver: req.user.id }],
    })
      .populate("trip")
      .populate("passenger")
      .populate("driver")
      .sort("-createdAt");

    console.log("Bookings response:", bookings);
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
