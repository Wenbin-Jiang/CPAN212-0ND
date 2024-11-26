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
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete trip");
    }
  };

  const handleRequest = async (tripId, requestId, action, requestType) => {
    try {
      if (isDriver) {
        // Handle passenger join requests
        const response = await api.put(
          `/api/trips/${tripId}/requests/${requestId}/respond`,
          {
            action,
          }
        );

        if (response.status === 200) {
          fetchTrips();
        }
      } else {
        // Handle driver requests - only one can be accepted
        const trip = allTrips.find((t) => t._id === tripId);

        if (
          action === "Accept" &&
          trip.driverRequests.some((r) => r.status === "Accepted")
        ) {
          setError("A driver has already been accepted for this trip");
          return;
        }

        await api.put(
          `/api/trips/${tripId}/driver-requests/${requestId}/respond`,
          {
            action,
          }
        );
        fetchTrips();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to handle request";
      setError(errorMessage);
    }
  };

  const renderRequest = (request, tripId) => (
    <div key={request._id} className={styles.request}>
      <div className={styles.requestInfo}>
        <p>
          {isDriver
            ? `Passenger: ${request.passengerName}`
            : `Driver: ${request.driverName}`}
        </p>
        {isDriver && <p>Seats requested: {request.requestedSeats}</p>}
        <p>Status: {request.status}</p>
      </div>
      {request.status === "Pending" && (
        <div className={styles.requestActions}>
          <button
            onClick={() =>
              handleRequest(
                tripId,
                request._id,
                "Accept",
                isDriver ? "passenger" : "driver"
              )
            }
            className={styles.acceptButton}
          >
            Accept
          </button>
          <button
            onClick={() =>
              handleRequest(
                tripId,
                request._id,
                "Decline",
                isDriver ? "passenger" : "driver"
              )
            }
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
              {trip.seatsRequired} {trip.seatsRequired === 1 ? "seat" : "seats"}{" "}
              needed
            </span>
          )}
        </div>
        {trip.additionalMessage && (
          <p className={styles.additionalMessage}>
            Note: {trip.additionalMessage}
          </p>
        )}
      </div>

      <div className={styles.requestsSection}>
        {isDriver
          ? trip.joinRequests?.map((request) =>
              renderRequest(request, trip._id)
            )
          : trip.driverRequests?.map((request) =>
              renderRequest(request, trip._id)
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
  const isDriver = activeTab === "driver";

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
      <Footer />
    </main>
  );
}

export default MyTrips;
