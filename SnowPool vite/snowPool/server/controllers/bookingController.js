const Booking = require("../models/bookingModal");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { trip, passenger, seatsBooked } = req.body;

    const newBooking = new Booking({ trip, passenger, seatsBooked });
    const savedBooking = await newBooking.save();

    res.status(201).json({ success: true, booking: savedBooking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "trip passenger",
      "username email origin destination"
    );
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
