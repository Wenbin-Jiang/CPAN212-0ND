import React from "react";
import styles from "../pages/MyTrips.module.css";
import { getFirstPart, formatDate } from "./utils";
import { useNavigate } from "react-router-dom";

const MyDrives = ({ trips, handleDelete }) => {
  const navigate = useNavigate();

  const handlePostRide = () => {
    navigate("/postride");
  };

  console.log("all trips before filter", trips);

  const uniqueTrips = trips.reduce((acc, trip) => {
    const existingTripIndex = acc.findIndex((t) => t._id === trip._id);

    if (existingTripIndex === -1) {
      // If this is a new trip, add it
      acc.push({
        ...trip,
        // Ensure passengers is always an array
        passengers: trip.passengers || [],
      });
    } else {
      // Combine passengers from both trips
      const existingPassengers = acc[existingTripIndex].passengers || [];
      const newPassengers = trip.passengers || [];

      // Merge passengers and remove duplicates by userId
      const combinedPassengers = [
        ...existingPassengers,
        ...newPassengers,
      ].filter(
        (passenger, index, self) =>
          index === self.findIndex((p) => p.userId === passenger.userId)
      );

      // Update the existing trip with combined passengers
      acc[existingTripIndex] = {
        ...trip,
        passengers: combinedPassengers,
        seatsAvailable: Math.max(0, trip.seatsAvailable || 0),
      };
    }

    return acc;
  }, []);

  return (
    <div className={styles.tripsList}>
      {!uniqueTrips || uniqueTrips.length === 0 ? (
        <div className={styles.empty}>
          <p>You have no upcoming drives.</p>
          <button onClick={handlePostRide} className={styles.postButton}>
            Post a trip
          </button>
        </div>
      ) : (
        uniqueTrips.map((trip) => {
          let validPassengers = trip.passengers || [];

          if (trip.tripType === "driver" || trip.role === "owner") {
            if (trip.passengers && trip.passengers.length > 0) {
              validPassengers = trip.passengers;
            } else if (trip.bookings) {
              validPassengers = trip.bookings
                .filter((b) => b.status === "accepted")
                .map((b) => ({
                  userId: b.user?.userId,
                  name: b.user?.userName,
                }));
            }
          } else {
            validPassengers =
              trip.passengers?.filter(
                (p) => p && p.userId !== trip.driver?.userId
              ) || [];
          }

          // Add this debug log
          console.log("Processing trip:", {
            tripId: trip._id,
            passengers: validPassengers,
            originalTrip: trip,
          });

          return (
            <div key={trip._id} className={styles.tripCard}>
              <div className={styles.tripHeader}>
                <h3>
                  {getFirstPart(trip.origin, ",")} to{" "}
                  {getFirstPart(trip.destination, ",")}
                </h3>
                {trip.seatsAvailable === 0 && (
                  <span className={styles.filledBadge}>Filled</span>
                )}
              </div>
              <div className={styles.tripDetails}>
                <p>
                  Leaving: {formatDate(trip.date)} at {trip.time}
                </p>
                <div className={styles.priceSection}>
                  <span className={styles.price}>
                    ${trip.pricePerSeat || trip.totalAmount}
                  </span>
                  <span className={styles.seatsLeft}>
                    {trip.seatsAvailable || 0}{" "}
                    {(trip.seatsAvailable || 0) === 1 ? "seat" : "seats"} left
                  </span>
                </div>
                {validPassengers.length > 0 && (
                  <div className={styles.passengerSection}>
                    <p className={styles.passengerTitle}>
                      Passengers ({validPassengers.length}):
                    </p>
                    <div className={styles.passengerList}>
                      {validPassengers.map((passenger, index) => (
                        <div
                          key={
                            passenger.userId || `${trip._id}-passenger-${index}`
                          }
                          className={styles.passenger}
                        >
                          {passenger.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.tripActions}>
                <button
                  onClick={() => handleDelete(trip._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyDrives;
