const express = require("express");
const router = express.Router();
const {
  createBookingRequest,
  handleBookingRequest,
  getBookingsByUser,
} = require("../controllers/bookingController");
const protectAndAuthorize = require("../middleware/authMiddleware");

// All routes are protected
router.post(
  "/trips/:tripId/request",
  protectAndAuthorize,
  createBookingRequest
);
router.put("/:bookingId/handle", protectAndAuthorize, handleBookingRequest);
router.get("/user/bookings", protectAndAuthorize, getBookingsByUser);

module.exports = router;
