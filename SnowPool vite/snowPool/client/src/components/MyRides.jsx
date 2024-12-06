import React from "react";
import styles from "../pages/MyTrips.module.css";
import { getFirstPart, formatDate } from "./utils";
import { useNavigate } from "react-router-dom";

const MyRides = ({ trips, handleDelete }) => {
  const navigate = useNavigate();

  const handlePostRide = () => {
    navigate("/postride");
  };

  return (
    <div className={styles.tripsList}>
      {!trips || trips.length === 0 ? (
        <div className={styles.empty}>
          <p>You have no upcoming rides.</p>
          <button onClick={handlePostRide} className={styles.postButton}>
            Post a Ride
          </button>
        </div>
      ) : (
        trips.map((trip) => (
          <div key={trip._id} className={styles.tripCard}>
            <div className={styles.tripHeader}>
              <h3>
                {`From ${getFirstPart(trip.origin, ",")} to ${getFirstPart(
                  trip.destination,
                  ","
                )}`}
              </h3>
            </div>
            <div className={styles.tripDetails}>
              <p>
                Leaving: {formatDate(trip.date)} at {trip.time}
              </p>
              {trip.status && (
                <div className={styles.tripStatus}>
                  Status:{" "}
                  <span
                    className={`${styles.statusBadge} ${styles[trip.status]}`}
                  >
                    {trip.status}
                  </span>
                </div>
              )}
              {trip.driver && (
                <div className={styles.driverInfo}>
                  Driver: {trip.driver.name}
                </div>
              )}
              <div className={styles.priceSection}>
                <span className={styles.price}>
                  ${trip.totalAmount || trip.willingToPay}
                </span>
                <span className={styles.seatsRequired}>
                  {trip.requestedSeats || trip.seatsRequired}{" "}
                  {(trip.requestedSeats || trip.seatsRequired) === 1
                    ? "seat"
                    : "seats"}
                  {trip.status === "accepted" ? " booked" : " needed"}
                </span>
              </div>
            </div>
            {trip.role === "owner" && (
              <div className={styles.tripActions}>
                <button
                  onClick={() => handleDelete(trip._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyRides;
