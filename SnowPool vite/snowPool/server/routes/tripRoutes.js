const express = require("express");
const router = express.Router();
const {
  createTrip,
  getAllTrips,
  searchTrips,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const protectAndAuthorize = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllTrips);
router.get("/search", searchTrips);
router.get("/:id", getTripById);

// Protected routes
router.post("/", protectAndAuthorize, createTrip);
router.get("/user/my-trips", protectAndAuthorize, getMyTrips);
router.put("/:id", protectAndAuthorize, updateTrip);
router.delete("/:id", protectAndAuthorize, deleteTrip);

module.exports = router;
