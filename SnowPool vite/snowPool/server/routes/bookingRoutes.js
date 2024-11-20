const express = require("express");
const {
  createBooking,
  getBookings,
} = require("../controllers/bookingController");

const router = express.Router();

// Routes for bookings
router.post("/create", createBooking);
router.get("/", getBookings);

module.exports = router;
