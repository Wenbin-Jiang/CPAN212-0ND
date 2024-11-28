import React, { useState, useEffect } from "react";
import api from "../services/api";
import styles from "./PostAsDriver.module.css";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";

const initialLocation = { address: "", lat: null, lng: null };

export default function PostAsDriver() {
  const [departure, setDeparture] = useState(initialLocation);
  const [destination, setDestination] = useState(initialLocation);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [cost, setCost] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  useEffect(() => {
    initializeAutocomplete("driver-departure", setDeparture);
    initializeAutocomplete("driver-destination", setDestination);
  }, [initializeAutocomplete]);

  const validateForm = () => {
    if (!departure.address || !departure.lat || !departure.lng) {
      throw new Error("Please select a valid departure location");
    }
    if (!destination.address || !destination.lat || !destination.lng) {
      throw new Error("Please select a valid destination");
    }
    if (!date) throw new Error("Please select a date");
    if (!time) throw new Error("Please select a time");
    if (!seatsAvailable || seatsAvailable < 1) {
      throw new Error("Please enter valid number of seats");
    }
    if (!cost || cost < 0) throw new Error("Please enter a valid price");
  };

  const resetForm = () => {
    setDeparture(initialLocation);
    setDestination(initialLocation);
    setDate("");
    setTime("");
    setSeatsAvailable(1);
    setCost("");
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      validateForm();

      const tripData = {
        origin: departure.address,
        originLatLng: [departure.lng, departure.lat],
        destination: destination.address,
        destinationLatLng: [destination.lng, destination.lat],
        date,
        time,
        seatsAvailable: parseInt(seatsAvailable),
        pricePerSeat: parseInt(cost),
        additionalMessage: message,
        tripType: "driver",
      };

      const response = await api.post("/api/trips", tripData);

      if (response._id) {
        alert("Trip created successfully!");
        resetForm();
      } else {
        throw new Error(response.message || "Failed to create trip");
      }
    } catch (error) {
      setError(error?.message || "Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Post a Ride as Driver</h1>
      <h2>
        Cover your driving costs by filling your seats when you're driving to
        the slope.
      </h2>

      <div className={styles.requestInput}>
        <label>Origin:</label>
        <input
          id="driver-departure"
          type="text"
          value={departure.address}
          onChange={(e) =>
            setDeparture({ ...departure, address: e.target.value })
          }
          placeholder="Enter your departure location"
        />
      </div>

      <div className={styles.requestInput}>
        <label>Destination:</label>
        <input
          id="driver-destination"
          type="text"
          value={destination.address}
          onChange={(e) =>
            setDestination({ ...destination, address: e.target.value })
          }
          placeholder="Enter your destination"
        />
      </div>

      <div className={styles.requestInput}>
        <label>Leaving:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p>at</p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className={styles.requestInput}>
        <label>Seats Available:</label>
        <input
          type="number"
          value={seatsAvailable}
          onChange={(e) => setSeatsAvailable(e.target.value)}
          min="1"
        />
      </div>

      <div className={styles.requestInput}>
        <label>Price per seat:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Enter the cost in dollars"
          min="0"
          step="5"
        />
      </div>

      <div className={styles.requestInput}>
        <label>Additional Message:</label>
        <textarea
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
        {isLoading ? "Creating..." : "Post Ride"}
      </button>
    </form>
  );
}
