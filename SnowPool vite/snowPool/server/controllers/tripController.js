const DriverTrip = require("../models/driverTripModal");
const PassengerRequest = require("../models/passengerRequest");

// Driver Trip Handlers
const createDriverTrip = async (req, res) => {
  try {
    const trip = new DriverTrip({ ...req.body, driver: req.user.id });
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(500).json({ message: "Error creating driver trip", error });
  }
};

const getAllDriverTrips = async (req, res) => {
  try {
    const trips = await DriverTrip.find().populate("driver", "name");
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching driver trips", error });
  }
};

const editDriverTrip = async (req, res) => {
  try {
    const updatedTrip = await DriverTrip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: "Error updating driver trip", error });
  }
};

const deleteDriverTrip = async (req, res) => {
  try {
    await DriverTrip.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Driver trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting driver trip", error });
  }
};

// Passenger Request Handlers
const createPassengerRequest = async (req, res) => {
  try {
    const request = new PassengerRequest({
      ...req.body,
      passenger: req.user.id,
    });
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating passenger request", error });
  }
};

const getAllPassengerRequests = async (req, res) => {
  try {
    const requests = await PassengerRequest.find().populate(
      "passenger",
      "name"
    );
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching passenger requests", error });
  }
};

const editPassengerRequest = async (req, res) => {
  try {
    const updatedRequest = await PassengerRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRequest);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating passenger request", error });
  }
};

const deletePassengerRequest = async (req, res) => {
  try {
    await PassengerRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Passenger request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting passenger request", error });
  }
};

// Unified Search
const searchTrips = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    const driverTrips = await DriverTrip.find({
      origin: new RegExp(origin, "i"),
      destination: new RegExp(destination, "i"),
      date: date ? new Date(date) : { $exists: true },
    });

    const passengerRequests = await PassengerRequest.find({
      origin: new RegExp(origin, "i"),
      destination: new RegExp(destination, "i"),
      date: date ? new Date(date) : { $exists: true },
    });

    res.status(200).json({ driverTrips, passengerRequests });
  } catch (error) {
    res.status(500).json({ message: "Error searching trips", error });
  }
};
module.exports = {
  createDriverTrip,
  getAllDriverTrips,
  editDriverTrip,
  deleteDriverTrip,
  createPassengerRequest,
  getAllPassengerRequests,
  editPassengerRequest,
  deletePassengerRequest,
  searchTrips,
};
