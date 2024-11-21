const express = require("express");
const {
  createDriverTrip,
  getAllDriverTrips,
  editDriverTrip,
  deleteDriverTrip,
  createPassengerRequest,
  getAllPassengerRequests,
  editPassengerRequest,
  deletePassengerRequest,
  searchTrips,
} = require("../controllers/tripController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Driver Trips
router.post("/driver", protect, createDriverTrip);
router.get("/driver", getAllDriverTrips);
router.put("/driver/:id", protect, editDriverTrip);
router.delete("/driver/:id", protect, deleteDriverTrip);

// Passenger Requests
router.post("/passenger", protect, createPassengerRequest);
router.get("/passenger", getAllPassengerRequests);
router.put("/passenger/:id", protect, editPassengerRequest);
router.delete("/passenger/:id", protect, deletePassengerRequest);

// Unified Search
router.get("/search", searchTrips);

module.exports = router;
