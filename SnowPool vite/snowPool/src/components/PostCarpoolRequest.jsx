import React, { useState } from "react";
import styles from "./PostCarpoolRequest.module.css";

export default function PostCarpoolRequest() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data
    console.log({
      pickupLocation,
      dropoffLocation,
      date,
      time,
      message,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Request a Carpool</h1>
      <h2>Get notified when new trips match your travel needs</h2>
      <div className={styles.requestInput}>
        <label>Origin:</label>
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="Enter your pickup location"
        />
      </div>
      <div className={styles.requestInput}>
        <label>Destination:</label>
        <input
          type="text"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          placeholder="Enter your dropoff location"
        />
      </div>
      <div className={styles.requestInput}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className={styles.requestInput}>
        <label>Pickup Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
      <button type="submit" className={styles.requestInput}>
        Request Carpool
      </button>
    </form>
  );
}
