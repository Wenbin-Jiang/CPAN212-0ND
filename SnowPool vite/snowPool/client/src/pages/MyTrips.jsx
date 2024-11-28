import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import MyDrives from "../components/MyDrives";
import MyRides from "../components/MyRides";
import MyRequests from "../components/MyRequests";
import styles from "./MyTrips.module.css";

const MyTrips = () => {
  const [activeTab, setActiveTab] = useState("driver");
  const [allTrips, setAllTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await api.get("/api/trips/user/my-trips");
      if (Array.isArray(response)) {
        setAllTrips(response);
      }
    } catch (err) {
      console.error("Trip fetch error:", err.response || err);
      setError(err.response?.message || "Failed to fetch trips");
      setAllTrips([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/api/bookings/user/bookings");
      if (Array.isArray(response)) {
        setBookings(response);
      }
    } catch (err) {
      console.error("Booking fetch error:", err.response || err);
      setError(err.response?.message || "Failed to fetch bookings");
      setBookings([]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        await fetchTrips();
        await fetchBookings();
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await api.delete(`/api/trips/${tripId}`);

      if (
        response?.status === 200 &&
        response?.data?.message === "Trip deleted successfully"
      ) {
        // Fetch updated trips from the server after deletion
        await fetchTrips();

        // Show success message
        alert("Trip successfully deleted");
      } else {
        alert("Failed to delete trip");
      }
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Failed to delete trip");
      alert("An error occurred while deleting the trip.");
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/handle`, {
        action,
      });
      if (response?.status === 200) {
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== bookingId)
        );
        await fetchBookings();
      }
    } catch (err) {
      console.error("Booking action error:", err);
      setError(err.message || "Failed to handle booking action");
    }
  };

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

        {isLoading && <div>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {activeTab === "driver" && (
          <MyDrives trips={filteredTrips} handleDelete={handleDelete} />
        )}
        {activeTab === "passenger" && (
          <MyRides trips={filteredTrips} handleDelete={handleDelete} />
        )}
        {activeTab === "bookingManagement" && (
          <MyRequests
            bookings={bookings}
            handleBookingAction={handleBookingAction}
          />
        )}
      </div>
      <Footer />
    </main>
  );
};

export default MyTrips;
