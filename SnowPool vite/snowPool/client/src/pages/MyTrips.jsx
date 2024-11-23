import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import { useUserContext } from "../contexts/UserContext";
import styles from "./MyTrips.module.css";

const baseURL = "http://localhost:8001";

const getFirstPart = (address) => {
  return address?.split(",")[0] || "";
};

function MyTrips() {
  const [activeTab, setActiveTab] = useState("driver");
  const [allTrips, setAllTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseURL}/api/trips/my/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTrips(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch trips");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${baseURL}/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTrips(allTrips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const filteredTrips = allTrips.filter((trip) => trip.tripType === activeTab);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString();
  };

  const isDriver = activeTab === "driver";

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
              {filteredTrips.map((trip) => (
                <div key={trip._id} className={styles.tripCard}>
                  <div className={styles.tripHeader}>
                    <h3>
                      {getFirstPart(trip.origin)} to{" "}
                      {getFirstPart(trip.destination)}
                    </h3>
                  </div>
                  <div className={styles.priceSection}>
                    <span className={styles.price}>
                      ${isDriver ? trip.pricePerSeat : trip.willingToPay}
                    </span>
                    {isDriver ? (
                      <span className={styles.seatsLeft}>
                        {trip.seatsAvailable}{" "}
                        {trip.seatsAvailable === 1 ? "seat" : "seats"} left
                      </span>
                    ) : (
                      <span className={styles.seatsRequired}>
                        {trip.seatsRequired}{" "}
                        {trip.seatsRequired === 1 ? "seat" : "seats"} needed
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
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MyTrips;
