import React from "react";
import styles from "./MyRequests.module.css";
import { formatDate } from "./utils";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const MyRequests = ({ bookings, handleBookingAction }) => {
  const navigate = useNavigate();
  const { userData } = useUserContext();
  console.log("bookings", bookings);

  const renderBookingCard = (booking) => {
    const isRequestor = booking.user.userId === userData?._id;
    const isRequestReceiver = booking.trip?.tripInitiator === userData?._id;

    return (
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
            Date: {formatDate(booking?.trip?.tripDate)}
            <br />
            Time: {booking?.trip?.tripTime}
            <br />
            Price: ${booking?.totalAmount}
            <br />
            Status:{" "}
            <span className={styles[booking?.status]}>{booking?.status}</span>
            <br />
            Seats: {booking?.requestedSeats}
          </p>
          <p>
            Driver: {booking.driver.name}
            <br />
            Passenger:{" "}
            {booking.requestType === "driver"
              ? booking.trip.userName
              : booking.user.userName}
          </p>
        </div>
        {booking?.status === "pending" && (
          <div className={styles.bookingActions}>
            {isRequestReceiver ? (
              <>
                <button
                  onClick={() =>
                    handleBookingAction(
                      booking._id,
                      booking.trip.tripId,
                      "accept"
                    )
                  }
                  className={styles.acceptButton}
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleBookingAction(
                      booking._id,
                      booking.trip.tripId,
                      "decline"
                    )
                  }
                  className={styles.declineButton}
                >
                  Decline
                </button>
              </>
            ) : isRequestor ? (
              <div className={styles.pendingStatus}>
                Waiting for response...
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.bookingsList}>
      {!bookings || bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>No booking requests found.</p>
          <button
            onClick={() => navigate("/findride")}
            className={styles.findRideButton}
          >
            Find a ride
          </button>
        </div>
      ) : (
        bookings.map(renderBookingCard)
      )}
    </div>
  );
};

export default MyRequests;
