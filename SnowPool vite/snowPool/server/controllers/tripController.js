const Trip = require("../models/tripsModal");
const User = require("../models/userModel");

const createTrip = async (req, res) => {
  if (
    !req.body.origin ||
    !req.body.destination ||
    !req.body.date ||
    !req.body.tripType
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  try {
    const trip = new Trip({
      ...req.body,
      user: req.user.id,
    });

    const savedTrip = await trip.save();

    const userUpdate = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { createdTrips: savedTrip._id } },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(201).json(savedTrip);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while creating the trip." });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const { origin, destination, date, tripType } = req.query;

    const query = {};
    if (origin) query.origin = new RegExp(origin, "i");
    if (destination) query.destination = new RegExp(destination, "i");
    if (date) query.date = new Date(date);
    if (tripType) query.tripType = tripType;

    const trips = await Trip.find(query)
      .populate("user", "name email profilePicture ratings")
      .sort("-createdAt");

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search
// const searchTrips = async (req, res) => {
//   try {
//     const { origin, destination, date, tripType } = req.query;
//     console.log("req.query", req.query);
//     const query = {
//       origin: new RegExp(origin, "i"),
//       destination: new RegExp(destination, "i"),
//       date: date ? new Date(date) : { $exists: true },
//     };
//     console.log("query", query);

//     if (tripType) {
//       query.tripType = tripType;
//     }

//     const trips = await Trip.find(query)
//       .populate({
//         path: "user",
//         select:
//           "name email gender birthday carModel driverHistory licensePlate createdAt",
//       })
//       .sort({ createdAt: -1 });
//     console.log(trips);
//     res.status(200).json(trips);
//   } catch (error) {
//     res.status(500).json({ message: "Error searching trips" });
//   }
// };

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

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .populate("bookings")
      .sort("-createdAt");

    console.log("my-trips response:", trips);
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("user", "name email profilePicture ratings")
      .populate({
        path: "bookings",
        populate: {
          path: "passenger driver",
          select: "name email profilePicture ratings",
        },
      });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    res.status(500).json({ message: error.message });
  }
};
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    console.log("trip found", trip);

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or unauthorized" });
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Remove trip from user's created trips
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { createdTrips: req.params.id },
    });
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  searchTrips,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
