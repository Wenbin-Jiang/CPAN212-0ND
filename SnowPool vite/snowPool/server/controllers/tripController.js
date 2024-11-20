// controllers/tripController.js
const Trip = require("../models/tripModal");

// Create Driver Trip
exports.createDriverTrip = async (req, res) => {
  try {
    const {
      origin,
      destination,
      originLocation,
      destinationLocation,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      additionalMessage,
    } = req.body;
    const newTrip = new Trip({
      tripType: "driver_trip",
      origin,
      destination,
      originLocation,
      destinationLocation,
      date,
      time,
      seatsAvailable,
      pricePerSeat,
      additionalMessage,
      driver: req.user._id, // Assuming `req.user._id` is available from authentication middleware
    });

    await newTrip.save();
    res.status(201).json({
      success: true,
      message: "Driver trip posted successfully",
      trip: newTrip,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Create Passenger Request
exports.createPassengerRequest = async (req, res) => {
  try {
    const {
      origin,
      destination,
      originLocation,
      destinationLocation,
      date,
      seatsRequired,
      willingToPay,
      additionalMessage,
    } = req.body;
    const newRequest = new Trip({
      tripType: "passenger_request",
      origin,
      destination,
      originLocation,
      destinationLocation,
      date,
      seatsRequired,
      willingToPay,
      additionalMessage,
    });

    await newRequest.save();
    res.status(201).json({
      success: true,
      message: "Passenger request posted successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Search Trips (Driver trips and Passenger requests)
exports.searchTrips = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Build the query dynamically based on provided filters
    const query = {};

    if (origin) query.origin = { $regex: origin, $options: "i" }; // Case-insensitive search
    if (destination) query.destination = { $regex: destination, $options: "i" };
    if (date) query.date = { $gte: new Date(date) }; // Only future trips

    // Find the trips using the dynamic query
    const trips = await Trip.find(query)
      .populate("driver", "name email") // For driver trips, populate driver details
      .sort({ date: 1 }); // Sort by date (ascending)

    res.status(200).json({ trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
