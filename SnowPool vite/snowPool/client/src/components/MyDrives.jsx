import React from "react";
import styles from "../pages/MyTrips.module.css";
import { getFirstPart, formatDate } from "./utils";
import { useNavigate } from "react-router-dom";

const MyDrives = ({ trips, handleDelete }) => {
  const navigate = useNavigate();

  const handlePostRide = () => {
    navigate("/postride");
  };

  return (
    <div className={styles.tripsList}>
      {trips.length === 0 ? (
        <div className={styles.empty}>
          <p>You have no upcoming drives.</p>
          <button onClick={handlePostRide} className={styles.postButton}>
            Post a trip
          </button>
        </div>
      ) : (
        trips.map((trip) => (
          <div key={trip._id} className={styles.tripCard}>
            <div className={styles.tripHeader}>
              <h3>
                {getFirstPart(trip.origin, ",")} to{" "}
                {getFirstPart(trip.destination, ",")}
              </h3>
            </div>
            <div className={styles.tripDetails}>
              <p>
                Leaving: {formatDate(trip.date)} at {trip.time}
              </p>
              <div className={styles.priceSection}>
                <span className={styles.price}>${trip.pricePerSeat}</span>
                <span className={styles.seatsLeft}>
                  {trip.seatsAvailable}{" "}
                  {trip.seatsAvailable === 1 ? "seat" : "seats"} left
                </span>
              </div>
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
        ))
      )}
    </div>
  );
};

export default MyDrives;
