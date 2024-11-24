const Trip = require("../models/tripsModal");
const User = require("../models/userModel");

// const createJoinRequest = async (req, res) => {
//   try {
//     const { tripId } = req.params;
//     const { passengerId, requestedSeats, passengerName } = req.body;

//     // Find the trip by its ID and populate the driver (user) data
//     const trip = await Trip.findById(tripId).populate("user");

//     if (!trip || trip.tripType !== "driver") {
//       return res.status(404).send("Trip not found or not a driver trip");
//     }

//     // Ensure the user is not the driver
//     if (trip.user._id.toString() === passengerId) {
//       return res.status(400).send("You cannot join your own trip.");
//     }

//     // Check if the user has already sent a request for this trip
//     const existingRequest = trip.joinRequests.find(
//       (request) => request.passenger.toString() === passengerId
//     );

//     if (existingRequest) {
//       return res
//         .status(400)
//         .send("You have already sent a request for this trip.");
//     }

//     // Check if there are enough seats available
//     if (trip.seatsAvailable < requestedSeats) {
//       return res.status(400).send("Not enough seats available");
//     }

//     // Add the join request
//     trip.joinRequests.push({
//       passenger: passengerId,
//       requestedSeats,
//       status: "Pending",
//     });

//     // Update the available seats on the trip
//     trip.seatsAvailable -= requestedSeats;

//     // Save the updated trip
//     await trip.save();

//     // Find the driver (user) to send the notification
//     const driver = await User.findById(trip.user._id);
//     driver.notifications.push({
//       type: "joinRequest",
//       trip: trip._id,
//       message: `${passengerName} has requested ${requestedSeats} seat(s).`,
//     });

//     // Save the updated driver notifications
//     await driver.save();

//     res.status(200).send("Join request sent");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

const createJoinRequest = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { passengerId, requestedSeats, passengerName } = req.body;

    // Find the trip by its ID and populate the driver (user) data
    const trip = await Trip.findById(tripId).populate("user");

    if (!trip || trip.tripType !== "driver") {
      return res.status(404).send("Trip not found or not a driver trip");
    }

    // Ensure the user is not the driver
    if (trip.user._id.toString() === passengerId) {
      return res.status(400).send("You cannot join your own trip.");
    }

    // Check if the user has already sent a request for this trip
    const existingRequest = trip.joinRequests.find(
      (request) => request.passenger.toString() === passengerId
    );

    if (existingRequest) {
      return res
        .status(400)
        .send("You have already sent a request for this trip.");
    }

    // Check if there are enough seats available
    if (trip.seatsAvailable < requestedSeats) {
      return res.status(400).send("Not enough seats available");
    }

    // Add the join request
    trip.joinRequests.push({
      passenger: passengerId,
      requestedSeats,
      status: "Pending",
    });

    // Update the available seats on the trip
    trip.seatsAvailable -= requestedSeats;

    // Save the updated trip
    await trip.save();

    // Find the driver (user) to send the notification
    const driver = await User.findById(trip.user._id);
    driver.notifications.push({
      type: "joinRequest",
      trip: trip._id,
      message: `${passengerName} has requested ${requestedSeats} seat(s) for the trip.`,
    });

    // Save the updated driver notifications
    await driver.save();

    res.status(200).send("Join request sent");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while processing the join request.");
  }
};

// const handleJoinRequest = async (req, res) => {
//   try {
//     const { tripId, requestId } = req.params;
//     const { action } = req.body; // "Accept" or "Decline"

//     // Validate action
//     if (!["Accept", "Decline"].includes(action)) {
//       return res
//         .status(400)
//         .send("Invalid action. Must be 'Accept' or 'Decline'.");
//     }

//     // Find the trip by ID and populate joinRequests with passengers
//     const trip = await Trip.findById(tripId).populate("joinRequests.passenger");

//     if (!trip) {
//       return res.status(404).send("Trip not found.");
//     }

//     // Check if the authenticated user is the driver (trip creator)
//     if (req.user.id !== trip.user._id.toString()) {
//       return res
//         .status(403)
//         .send("You are not authorized to manage this request.");
//     }

//     // Find the specific join request
//     const request = trip.joinRequests.id(requestId);
//     if (!request) {
//       return res.status(404).send("Join request not found.");
//     }

//     // Check if the request is already handled
//     if (request.status !== "Pending") {
//       return res
//         .status(400)
//         .send("This join request has already been handled.");
//     }

//     // Handle the request based on action
//     if (action === "Accept") {
//       // Ensure seats are available
//       if (trip.seatsAvailable < request.requestedSeats) {
//         return res.status(400).send("Not enough seats available.");
//       }

//       // Accept the request: Update trip and request status
//       trip.passengers.push({
//         user: request.passenger._id,
//         seatsBooked: request.requestedSeats,
//       });
//       trip.seatsAvailable -= request.requestedSeats;
//       request.status = "Accepted";
//     } else if (action === "Decline") {
//       // Decline the request: Update request status
//       request.status = "Declined";
//     }

//     request.respondedAt = new Date(); // Record response time
//     await trip.save();

//     // Notify the passenger
//     const passenger = await User.findById(request.passenger._id);
//     if (passenger) {
//       passenger.notifications.push({
//         type: action === "Accept" ? "acceptedRequest" : "declinedRequest",
//         trip: trip._id,
//         message:
//           action === "Accept"
//             ? `Your request to join the trip from ${trip.origin} to ${trip.destination} has been accepted.`
//             : `Your request to join the trip from ${trip.origin} to ${trip.destination} has been declined.`,
//         createdAt: new Date(),
//       });
//       await passenger.save();
//     }

//     res.status(200).send(`Request ${action.toLowerCase()}ed successfully.`);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send("An error occurred while processing the join request.");
//   }
// };

// Create

const handleJoinRequest = async (req, res) => {
  try {
    const { tripId, requestId } = req.params;
    const { action } = req.body; // "Accept" or "Decline"

    // Validate action
    if (!["Accept", "Decline"].includes(action)) {
      return res
        .status(400)
        .send("Invalid action. Must be 'Accept' or 'Decline'.");
    }

    // Find the trip by ID and populate joinRequests with passengers
    const trip = await Trip.findById(tripId).populate("joinRequests.passenger");

    if (!trip) {
      return res.status(404).send("Trip not found.");
    }

    // Check if the authenticated user is the driver (trip creator)
    if (req.user.id !== trip.user._id.toString()) {
      return res
        .status(403)
        .send("You are not authorized to manage this request.");
    }

    // Find the specific join request
    const request = trip.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).send("Join request not found.");
    }

    // Check if the request is already handled
    if (request.status !== "Pending") {
      return res
        .status(400)
        .send("This join request has already been handled.");
    }

    // Handle the request based on action
    if (action === "Accept") {
      // Ensure seats are available
      if (trip.seatsAvailable < request.requestedSeats) {
        return res.status(400).send("Not enough seats available.");
      }

      // Accept the request: Update trip and request status
      trip.passengers.push({
        user: request.passenger._id,
        seatsBooked: request.requestedSeats,
      });
      trip.seatsAvailable -= request.requestedSeats;
      request.status = "Accepted";
    } else if (action === "Decline") {
      // Decline the request: Update request status
      request.status = "Declined";
    }

    request.respondedAt = new Date(); // Record response time
    await trip.save();

    // Notify the passenger
    const passenger = await User.findById(request.passenger._id);
    if (passenger) {
      passenger.notifications.push({
        type: action === "Accept" ? "acceptedRequest" : "declinedRequest",
        trip: trip._id,
        message:
          action === "Accept"
            ? `Your request to join the trip from ${trip.origin} to ${trip.destination} has been accepted.`
            : `Your request to join the trip from ${trip.origin} to ${trip.destination} has been declined.`,
        createdAt: new Date(),
      });
      await passenger.save();
    }

    res.status(200).send(`Request ${action.toLowerCase()}ed successfully.`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while processing the join request.");
  }
};

//to request driver role in passenger trip
const createDriverRequest = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { driverId, driverName } = req.body;

    // Find the trip by its ID and ensure it's a passenger-type trip
    const trip = await Trip.findById(tripId).populate("user");

    if (!trip || trip.tripType !== "passenger") {
      return res.status(404).send("Trip not found or not a passenger trip.");
    }

    // Ensure the user is not the original passenger
    if (trip.user._id.toString() === driverId) {
      return res
        .status(400)
        .send("You cannot become the driver of your own trip.");
    }

    // Check if the user has already sent a request for this trip
    const existingRequest = trip.driverRequests.find(
      (request) => request.driver.toString() === driverId
    );

    if (existingRequest) {
      return res
        .status(400)
        .send("You have already sent a request for this trip.");
    }

    // Add the driver request (no seat required for driver requests)
    trip.driverRequests.push({
      driver: driverId,
      status: "Pending",
    });

    // Save the updated trip
    await trip.save();

    // Send notification to the original passenger (trip creator)
    const passenger = await User.findById(trip.user._id);
    passenger.notifications.push({
      type: "driverRequest",
      trip: trip._id,
      message: `${driverName} has requested to become the driver for your trip.`,
    });

    await passenger.save();

    res.status(200).send("Driver request sent.");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while processing the driver request.");
  }
};

const handleDriverRequest = async (req, res) => {
  try {
    const { tripId, requestId } = req.params;
    const { action } = req.body; // "Accept" or "Decline"

    // Validate action
    if (!["Accept", "Decline"].includes(action)) {
      return res
        .status(400)
        .send("Invalid action. Must be 'Accept' or 'Decline'.");
    }

    // Find the trip by ID and populate driverRequests with drivers
    const trip = await Trip.findById(tripId).populate("driverRequests.driver");

    if (!trip) {
      return res.status(404).send("Trip not found.");
    }

    // Check if the authenticated user is the original passenger (trip creator)
    if (req.user.id !== trip.user._id.toString()) {
      return res
        .status(403)
        .send("You are not authorized to manage this request.");
    }

    // Find the specific driver request
    const request = trip.driverRequests.id(requestId);
    if (!request) {
      return res.status(404).send("Driver request not found.");
    }

    // Check if the request is already handled
    if (request.status !== "Pending") {
      return res
        .status(400)
        .send("This driver request has already been handled.");
    }

    // Handle the request based on action
    if (action === "Accept") {
      // Accept the request: Update trip and request status
      trip.driver = request.driver._id; // Set the driver of the trip
      request.status = "Accepted";
      trip.requestStatus = "Request Filled";
    } else if (action === "Decline") {
      // Decline the request: Update request status
      request.status = "Declined";
    }

    request.respondedAt = new Date(); // Record response time
    await trip.save();

    // Notify the user who requested to become the driver
    const driver = await User.findById(request.driver._id);
    if (driver) {
      driver.notifications.push({
        type:
          action === "Accept"
            ? "acceptedDriverRequest"
            : "declinedDriverRequest",
        trip: trip._id,
        message:
          action === "Accept"
            ? `Your request to become the driver for the trip from ${trip.origin} to ${trip.destination} has been accepted.`
            : `Your request to become the driver for the trip from ${trip.origin} to ${trip.destination} has been declined.`,
        createdAt: new Date(),
      });
      await driver.save();
    }

    res
      .status(200)
      .send(`Driver request ${action.toLowerCase()}ed successfully.`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while processing the driver request.");
  }
};

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
  createJoinRequest,
  handleJoinRequest,
  createDriverRequest,
  handleDriverRequest,
};
