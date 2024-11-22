const express = require("express");
const {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  getTripsByType,
  updateTrip,
  deleteTrip,
  searchTrips,
} = require("../controllers/tripController");
const protectAndAuthorize = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/search", searchTrips);
router.get("/all", getAllTrips);
router.get("/type/:tripType", getTripsByType);
router.get("/:id", getTripById);

// Protected Routes
router.use(protectAndAuthorize); // Apply protection to all routes below

// Create trips
router.post("/driver", async (req, res) => {
  req.body.tripType = "driver";
  createTrip(req, res);
});

router.post("/passenger", async (req, res) => {
  req.body.tripType = "passenger";
  createTrip(req, res);
});

// Get user's trips
router.get("/my/all", getMyTrips);

// Update and Delete
router.route("/:id").put(updateTrip).delete(deleteTrip);

module.exports = router;
