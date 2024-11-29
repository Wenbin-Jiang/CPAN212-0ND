import React from "react";
import styles from "../pages/MyTrips.module.css";
import { formatDate } from "./utils";
import { useNavigate } from "react-router-dom";

const MyRides = ({ trips, handleDelete }) => {
  const navigate = useNavigate();

  const handlePostRide = () => {
    navigate("/postride");
  };

  return (
    <div className={styles.tripsList}>
      {trips.length === 0 ? (
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
                {trip.origin} to {trip.destination}
              </h3>
            </div>
            <div className={styles.tripDetails}>
              <p>
                Leaving: {formatDate(trip.date)} at {trip.time}
              </p>
              <div className={styles.priceSection}>
                <span className={styles.price}>${trip.willingToPay}</span>
                <span className={styles.seatsRequired}>
                  {trip.seatsRequired}{" "}
                  {trip.seatsRequired === 1 ? "seat" : "seats"} needed
                </span>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleDelete(trip._id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyRides;
