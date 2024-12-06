const Trip = require("../models/tripsModal");
const User = require("../models/userModel");
const Booking = require("../models/bookingModal");

const getFirstPart = (address) => address?.split(",")[0] || "";

const formatDate = (dateString, time) => {
  try {
    const isoString = dateString.toISOString().split("T")[0];
    const date = new Date(`${isoString}T${time}`);

    return `${date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })} at ${time}`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return `${dateString} at ${time}`;
  }
};

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
          "name email gender profilePicture birthday carModel driverHistory licensePlate createdAt",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error searching trips" });
  }
};

const getMyTrips = async (req, res) => {
  try {
    // Get user's own created trips
    const ownTrips = await Trip.find({ user: req.user.id })
      .populate("user", "name email")
      .sort("-createdAt");

    // Get accepted bookings where user is either driver or passenger
    const acceptedBookings = await Booking.find({
      $or: [
        { "driver.user": req.user.id, status: "accepted" },
        { "passengers.userId": req.user.id, status: "accepted" },
      ],
    })
      .populate({
        path: "trip.tripId",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort("-createdAt");

    // Transform booking data to match trip format
    const bookingTrips = acceptedBookings.map((booking) => ({
      _id: booking.trip.tripId._id,
      origin: booking.trip.tripId.origin,
      destination: booking.trip.tripId.destination,
      date: booking.trip.tripDate,
      time: booking.trip.tripTime,
      driver: {
        userId: booking.driver.user,
        name: booking.driver.name,
      },
      passengers: booking.passengers,
      requestedSeats: booking.trip.tripId.seatsRequired,
      totalAmount: booking.totalAmount,
      status: booking.status,
      role:
        booking.driver.user.toString() === req.user.id ? "driver" : "passenger",
    }));

    // Add driver/passenger info to own trips
    const formattedOwnTrips = ownTrips
      .map((trip) => {
        // Find if this trip has an accepted booking
        const relatedBooking = acceptedBookings.find(
          (booking) =>
            booking.trip.tripId._id.toString() === trip._id.toString()
        );

        // If this trip has an accepted booking and user is passenger, skip it
        if (relatedBooking && trip.tripType === "passenger") {
          return null;
        }

        return {
          ...trip._doc,
          driver:
            trip.tripType === "passenger"
              ? relatedBooking
                ? {
                    userId: relatedBooking.driver.user,
                    name: relatedBooking.driver.name,
                  }
                : null
              : {
                  userId: trip.user._id,
                  name: trip.user.name,
                },
          passengers:
            trip.tripType === "passenger"
              ? [
                  {
                    userId: trip.user._id,
                    name: trip.user.name,
                  },
                ]
              : [],
          role: "owner",
          status: relatedBooking ? relatedBooking.status : "pending",
        };
      })
      .filter(Boolean); // Remove null entries

    // Combine and sort all trips
    const allTrips = [...formattedOwnTrips, ...bookingTrips].sort(
      (a, b) => new Date(b.date || b.tripDate) - new Date(a.date || a.tripDate)
    );
    console.log("all trips", allTrips);
    res.status(200).json(allTrips);
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

// const deleteTrip = async (req, res) => {
//   try {
//     const trip = await Trip.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });
//     console.log("trip to be deleted", trip);

//     if (!trip) {
//       return res
//         .status(404)
//         .json({ message: "Trip not found or unauthorized" });
//     }

//     await Trip.findByIdAndDelete(req.params.id);

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteTrip = async (req, res) => {
//   try {
//     const session = await Trip.startSession();
//     session.startTransaction();

//     try {
//       const trip = await Trip.findOne({
//         _id: req.params.id,
//         user: req.user.id,
//       });

//       if (!trip) {
//         await session.abortTransaction();
//         return res
//           .status(404)
//           .json({ message: "Trip not found or unauthorized" });
//       }

//       const relatedBookings = await Booking.find({
//         "trip.tripId": trip._id,
//         status: { $ne: "cancelled" },
//       });

//       const notificationPromises = relatedBookings.map(async (booking) => {
//         await Booking.findByIdAndUpdate(
//           booking._id,
//           {
//             status: "cancelled",
//             cancellationReason: "Trip deleted by creator",
//           },
//           { session }
//         );

//         const bookingUser = await User.findById(booking.user.userId);
//         if (bookingUser) {
//           bookingUser.notifications.push({
//             type: "tripCancelled",
//             booking: booking._id,
//             message: `Trip from ${getFirstPart(trip.origin)} to ${getFirstPart(
//               trip.destination
//             )} on ${trip.date} has been cancelled by the trip creator.`,
//             createdAt: new Date(),
//           });
//           await bookingUser.save({ session });
//         }
//       });

//       await Promise.all(notificationPromises);

//       await Trip.findByIdAndDelete(req.params.id, { session });

//       await session.commitTransaction();

//       res.status(200).json({
//         message: "Trip and related bookings cancelled successfully",
//         cancelledBookings: relatedBookings.length,
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       throw error;
//     } finally {
//       session.endSession();
//     }
//   } catch (error) {
//     console.error("Delete trip error:", error);
//     res.status(500).json({
//       message: "Failed to delete trip and update bookings",
//       error: error.message,
//     });
//   }
// };

const deleteTrip = async (req, res) => {
  try {
    const session = await Trip.startSession();
    session.startTransaction();

    try {
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!trip) {
        await session.abortTransaction();
        return res
          .status(404)
          .json({ message: "Trip not found or unauthorized" });
      }

      const relatedBookings = await Booking.find({
        "trip.tripId": trip._id,
        status: { $ne: "cancelled" },
      });

      const notificationPromises = relatedBookings.map(async (booking) => {
        await Booking.findByIdAndUpdate(
          booking._id,
          {
            status: "cancelled",
            cancellationReason: "Trip deleted by creator",
          },
          { session }
        );

        const bookingUser = await User.findById(booking.user.userId);
        if (bookingUser) {
          bookingUser.notifications.push({
            type: "tripCancelled",
            booking: booking._id,
            message: `Trip from ${getFirstPart(trip.origin)} to ${getFirstPart(
              trip.destination
            )} on ${formatDate(
              trip.date,
              trip.time
            )} has been cancelled by the trip creator.`,
            createdAt: new Date(),
          });
          await bookingUser.save({ session });
        }
      });

      await Promise.all(notificationPromises);

      await Trip.findByIdAndDelete(req.params.id, { session });

      await session.commitTransaction();

      res.status(200).json({
        message: "Trip and related bookings cancelled successfully",
        cancelledBookings: relatedBookings.length,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({
      message: "Failed to delete trip and update bookings",
      error: error.message,
    });
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
