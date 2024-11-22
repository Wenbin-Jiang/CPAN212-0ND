import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PostCarpoolRequest.module.css";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";

const baseURL = "http://localhost:8001";

export default function PostCarpoolRequest() {
  const [pickupLocation, setPickupLocation] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [dropoffLocation, setDropoffLocation] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatRequired, setSeatRequired] = useState(1);
  const [willingToPay, setWillingToPay] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  const validateForm = () => {
    if (!pickupLocation.address || !pickupLocation.lat || !pickupLocation.lng) {
      throw new Error("Please select a valid pickup location");
    }
    if (
      !dropoffLocation.address ||
      !dropoffLocation.lat ||
      !dropoffLocation.lng
    ) {
      throw new Error("Please select a valid dropoff location");
    }
    if (!date) {
      throw new Error("Please select a date");
    }
    if (!time) {
      throw new Error("Please select a time");
    }
    if (!seatRequired || seatRequired < 1) {
      throw new Error("Please enter valid number of seats");
    }
    if (!willingToPay || willingToPay < 0) {
      throw new Error("Please enter a valid amount you're willing to pay");
    }
  };

  const resetForm = () => {
    setPickupLocation({ address: "", lat: null, lng: null });
    setDropoffLocation({ address: "", lat: null, lng: null });
    setDate("");
    setTime("");
    setSeatRequired(1);
    setWillingToPay("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      validateForm();

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const requestData = {
        origin: pickupLocation.address,
        originLatLng: [pickupLocation.lat, pickupLocation.lng],
        destination: dropoffLocation.address,
        destinationLatLng: [dropoffLocation.lat, dropoffLocation.lng],
        date,
        time,
        seatsRequired: parseInt(seatRequired),
        willingToPay: parseInt(willingToPay),
        additionalMessage: message,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${baseURL}/api/trips/passenger`,
        requestData,
        config
      );

      if (response.data) {
        alert("Carpool request created successfully!");
        resetForm();
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError(error.message || "Failed to create request");
      }
      console.error("Error details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAutocomplete("request-pickup", setPickupLocation);
    initializeAutocomplete("request-dropoff", setDropoffLocation);
  }, [initializeAutocomplete]);

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Request a Carpool</h1>
      <h2>Get notified when new trips match your travel needs</h2>

      <div className={styles.requestInput}>
        <label htmlFor="request-pickup">Origin:</label>
        <input
          id="request-pickup"
          type="text"
          value={pickupLocation.address}
          onChange={(e) =>
            setPickupLocation({ ...pickupLocation, address: e.target.value })
          }
          placeholder="Enter your pickup location"
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="request-dropoff">Destination:</label>
        <input
          id="request-dropoff"
          type="text"
          value={dropoffLocation.address}
          onChange={(e) =>
            setDropoffLocation({ ...dropoffLocation, address: e.target.value })
          }
          placeholder="Enter your dropoff location"
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p>at</p>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="seats">Seat Required:</label>
        <input
          id="seats"
          type="number"
          value={seatRequired}
          onChange={(e) => setSeatRequired(e.target.value)}
          min="1"
          placeholder="Minimum 1 seat"
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="payment">Willing to pay:</label>
        <input
          id="payment"
          type="number"
          value={willingToPay}
          onChange={(e) => setWillingToPay(e.target.value)}
          placeholder="$ / Seat"
          min="0"
          step="5"
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="message">Additional Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add any additional details or special instructions"
        />
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? "Creating Request..." : "Request Carpool"}
      </button>
    </form>
  );
}
