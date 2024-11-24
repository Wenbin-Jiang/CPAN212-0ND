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
  createJoinRequest,
  handleJoinRequest,
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

// // Get user's trips
// router.get("/my/driver", async (req, res) => {
//   try {
//     const trips = await Trip.find({
//       user: req.user.id,
//       tripType: "driver",
//     })
//       .populate("user", "name")
//       .sort({ createdAt: -1 });
//     res.status(200).json(trips);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching your trips" });
//   }
// });

// router.get("/my/passenger", async (req, res) => {
//   try {
//     const trips = await Trip.find({
//       user: req.user.id,
//       tripType: "passenger",
//     })
//       .populate("user", "name")
//       .sort({ createdAt: -1 });
//     res.status(200).json(trips);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching your trips" });
//   }
// });

router.get("/my/all", getMyTrips);

// Update and Delete
router.route("/:id").put(updateTrip).delete(deleteTrip);

router.post("/:tripId/join", createJoinRequest);
router.put("/:tripId/requests/:requestId/respond", handleJoinRequest);

module.exports = router;
