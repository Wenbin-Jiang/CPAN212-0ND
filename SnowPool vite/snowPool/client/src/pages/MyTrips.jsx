import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import styles from "./MyTrips.module.css";

const getFirstPart = (address) => address?.split(",")[0] || "";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString();
};

function MyTrips() {
  const [activeTab, setActiveTab] = useState("driver");
  const [allTrips, setAllTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/trips/my/all");
      setAllTrips(response.data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch trips");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await api.delete(`/api/trips/${tripId}`);
      setAllTrips(allTrips.filter((trip) => trip._id !== tripId));
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const filteredTrips = allTrips.filter((trip) => trip.tripType === activeTab);
  const isDriver = activeTab === "driver";

  const renderTripCard = (trip) => (
    <div key={trip._id} className={styles.tripCard}>
      <div className={styles.tripHeader}>
        <h3>
          {getFirstPart(trip.origin)} to {getFirstPart(trip.destination)}
        </h3>
      </div>
      <div className={styles.priceSection}>
        <span className={styles.price}>
          ${isDriver ? trip.pricePerSeat : trip.willingToPay}
        </span>
        {isDriver ? (
          <span className={styles.seatsLeft}>
            {trip.seatsAvailable} {trip.seatsAvailable === 1 ? "seat" : "seats"}{" "}
            left
          </span>
        ) : (
          <span className={styles.seatsRequired}>
            {trip.seatsRequired} {trip.seatsRequired === 1 ? "seat" : "seats"}{" "}
            needed
          </span>
        )}
      </div>
      <div className={styles.tripDetails}>
        <p>
          Leaving: {formatDate(trip.date)} at {trip.time}
        </p>
        {trip.additionalMessage && (
          <p className={styles.additionalMessage}>
            Note: {trip.additionalMessage}
          </p>
        )}
        {isDriver
          ? trip.passengers?.length > 0 && (
              <p className={styles.additionalMessage}>
                Passengers: {trip.passengers.map((p) => p._id).join(", ")}
              </p>
            )
          : trip.driver?.length > 0 && (
              <p className={styles.additionalMessage}>
                Driver: {trip.driver.map((d) => d._id).join(", ")}
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

  return (
    <>
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
              My Requests
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
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
      </main>
      <Footer />
    </>
  );
}

export default MyTrips;
