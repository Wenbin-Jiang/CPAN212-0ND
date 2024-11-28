import React from "react";
import styles from "../pages/MyTrips.module.css";
import { formatDate } from "./utils";
import { useNavigate } from "react-router-dom";

const MyRequests = ({ bookings, handleBookingAction }) => {
  const navigate = useNavigate();

  const handleFindRide = () => {
    navigate("/findride");
  };

  return (
    <div className={styles.bookingsList}>
      {bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>No booking requests found.</p>
          <button onClick={handleFindRide} className={styles.findRideButton}>
            find a ride
          </button>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <h3>
                {booking?.pickupLocation?.address} to{" "}
                {booking?.dropoffLocation?.address}
              </h3>
            </div>
            <div className={styles.bookingDetails}>
              <p>
                Trip Details:
                <br />
                Date: {formatDate(booking?.trip?.date)}
                <br />
                Time: {booking?.trip?.time}
                <br />
                Price: ${booking?.totalAmount}
                <br />
                Status: {booking?.status}
                <br />
                Seats: {booking?.requestedSeats}
              </p>
              <p>
                Driver: {booking?.trip?.user?.name || "Unknown"}
                <br />
                Passenger: {booking?.passenger?.name || "Unknown"}
              </p>
            </div>
            {booking?.status === "pending" && (
              <div className={styles.bookingActions}>
                <button
                  onClick={() => handleBookingAction(booking._id, "accept")}
                  className={styles.acceptButton}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleBookingAction(booking._id, "decline")}
                  className={styles.declineButton}
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
