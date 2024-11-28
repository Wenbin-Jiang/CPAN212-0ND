import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import styles from "./MyTrips.module.css";

function MyTrips() {
  const [activeTab, setActiveTab] = useState("driver");
  const [allTrips, setAllTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await api.get("/api/trips/user/my-trips");
      console.log("Raw trips response:", response);
      if (Array.isArray(response)) {
        // Changed from response.status === 200
        console.log("Setting trips:", response.data);
        setAllTrips(response.data);
      }
    } catch (err) {
      console.error("Trip fetch error:", err.response || err);
      setError(err.response?.data?.message || "Failed to fetch trips");
      setAllTrips([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/bookings/user/bookings");
      console.log("Raw bookings response:", response);
      if (response?.data) {
        // Changed from response.status === 200
        console.log("Setting bookings:", response.data);
        setBookings(response.data);
      }
    } catch (err) {
      console.error("Booking fetch error:", err.response || err);
      setError(err.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    }
  };

  // Update useEffect to handle the fetching sequentially
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      if (isMounted) {
        try {
          // Fetch trips
          const tripsResponse = await api.get("/api/trips/user/my-trips");
          if (tripsResponse?.data && isMounted) {
            setAllTrips(tripsResponse.data);
          }

          // Fetch bookings
          const bookingsResponse = await api.get("/api/bookings/user/bookings");
          if (bookingsResponse?.data && isMounted) {
            setBookings(bookingsResponse.data);
          }
        } catch (err) {
          if (isMounted) {
            console.error("Fetch error:", err);
            setError(err.message);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Add debug logging right before rendering
  const debugRender = () => {
    console.log("Rendering with trips:", allTrips);
    console.log("Rendering with bookings:", bookings);
    return null;
  };

  // Add debug logging for state changes
  useEffect(() => {
    console.log("Current trips:", allTrips);
  }, [allTrips]);

  useEffect(() => {
    console.log("Current bookings:", bookings);
  }, [bookings]);

  // Rest of your component code remains the same...

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await api.delete(`/api/trips/${tripId}`);
      if (response?.data) {
        setAllTrips((prev) => prev.filter((trip) => trip._id !== tripId));
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete trip");
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await api.patch(`/api/bookings/${bookingId}/handle`, {
        action,
      });
      if (response?.status === 200) {
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
        await fetchBookings(); // Refresh bookings after action
      }
    } catch (err) {
      console.error("Booking action error:", err);
      setError(err.message || "Failed to handle booking action");
    }
  };

  const renderBookingCard = (booking) => (
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
  );

  const renderTripCard = (trip) => (
    <div key={trip._id} className={styles.tripCard}>
      <div className={styles.tripHeader}>
        <h3>
          {getFirstPart(trip.origin)} to {getFirstPart(trip.destination)}
        </h3>
      </div>
      <div className={styles.tripDetails}>
        <p>
          Leaving: {formatDate(trip.date)} at {trip.time}
        </p>
        <div className={styles.priceSection}>
          {trip.tripType === "driver" ? (
            <>
              <span className={styles.price}>${trip.pricePerSeat}</span>
              <span className={styles.seatsLeft}>
                {trip.seatsAvailable}{" "}
                {trip.seatsAvailable === 1 ? "seat" : "seats"} left
              </span>
            </>
          ) : (
            <>
              <span className={styles.price}>${trip.willingToPay}</span>
              <span className={styles.seatsRequired}>
                {trip.seatsRequired}{" "}
                {trip.seatsRequired === 1 ? "seat" : "seats"} needed
              </span>
            </>
          )}
        </div>
        {trip.additionalMessage && (
          <p className={styles.additionalMessage}>
            Note: {trip.additionalMessage}
          </p>
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

  const filteredTrips = allTrips.filter((trip) => trip.tripType === activeTab);

  return (
    <main className={styles.trips}>
      <PageNav />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "driver" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("driver")}
          >
            My Drives
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "passenger" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("passenger")}
          >
            My Rides
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "bookingManagement" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("bookingManagement")}
          >
            My Requests
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === "bookingManagement" ? (
          <div className={styles.bookingsList}>
            {bookings.length > 0 ? (
              bookings.map(renderBookingCard)
            ) : (
              <div className={styles.empty}>No booking requests found.</div>
            )}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className={styles.empty}>
            <p>
              You have no upcoming{" "}
              {activeTab === "driver" ? "drives" : "requests"}.
            </p>
            <button
              onClick={() => navigate("/postride")}
              className={styles.postButton}
            >
              Post a trip
            </button>
          </div>
        ) : (
          <div className={styles.tripsList}>
            {filteredTrips.map(renderTripCard)}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

// export default MyTrips;
