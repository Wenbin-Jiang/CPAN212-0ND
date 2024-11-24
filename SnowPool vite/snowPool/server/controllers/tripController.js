const Trip = require("../models/tripsModal");

// Create
const createTrip = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    console.log("User:", req.user); // Debug log

    const trip = new Trip({
      ...req.body,
      user: req.user.id,
    });

    console.log("Trip to save:", trip); // Debug log

    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Error details:", error); // Debug log
    res.status(500).json({
      message: "Error creating trip",
      error: error.message,
    });
  }
};

// Read
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate(
        "user",
        "name email gender birthday carModel driverHistory licensePlate createdAt"
      )
      .sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips" });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your trips" });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("user", "name");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trip" });
  }
};

const getTripsByType = async (req, res) => {
  try {
    const { tripType } = req.params;

    if (!["driver", "passenger"].includes(tripType)) {
      return res.status(400).json({
        message: "Invalid trip type. Must be 'driver' or 'passenger'",
      });
    }

    const trips = await Trip.find({ tripType })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips" });
  }
};

// Update
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or unauthorized" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Error updating trip" });
  }
};

// Delete
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or unauthorized" });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip" });
  }
};

// Search
const searchTrips = async (req, res) => {
  try {
    const { origin, destination, date, tripType } = req.query;

    const query = {
      origin: new RegExp(origin, "i"),
      destination: new RegExp(destination, "i"),
      date: date ? new Date(date) : { $exists: true },
    };

    if (tripType) {
      query.tripType = tripType;
    }

    const trips = await Trip.find(query)
      .populate({
        path: "user",
        select:
          "name email gender birthday carModel driverHistory licensePlate createdAt",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error searching trips" });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  getTripsByType,
  updateTrip,
  deleteTrip,
  searchTrips,
};
