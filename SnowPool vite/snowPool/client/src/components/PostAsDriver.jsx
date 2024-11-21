import React, { useState, useEffect } from "react";
import styles from "./PostAsDriver.module.css";
import { useGoogleAutocomplete } from "../hooks/useGoogleAutocomplete";

export default function PostAsDriver() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [cost, setCost] = useState("");
  const [message, setMessage] = useState("");

  const { initializeAutocomplete } = useGoogleAutocomplete();

  useEffect(() => {
    initializeAutocomplete("driver-departure", setDeparture);
    initializeAutocomplete("driver-destination", setDestination);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      departure,
      destination,
      date,
      time,
      seatsAvailable,
      cost,
      message,
    });
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
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="Enter your departure location"
        />
      </div>
      <div className={styles.requestInput}>
        <label>Destination:</label>
        <input
          id="driver-destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
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
        ></textarea>
      </div>
      <button type="submit">Post Ride</button>
    </form>
  );
}
