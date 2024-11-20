// routes/tripRoutes.js
const express = require("express");
const {
  createDriverTrip,
  createPassengerRequest,
  searchTrips,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create trip (for drivers)
router.post("/create-driver-trip", protect, createDriverTrip);

// Create passenger request (for passengers)
router.post("/create-passenger-request", protect, createPassengerRequest);

// Search trips (both driver and passenger trips)
router.get("/search", searchTrips);

module.exports = router;
