import React, { useState, useEffect } from "react";
import styles from "./PostCarpoolRequest.module.css";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";

export default function PostCarpoolRequest() {
  // Group all state declarations
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
  const [seatRequired, setSeatRequired] = useState(1); // Set default value to 1
  const [willingToPay, setWillingToPay] = useState("");
  const [message, setMessage] = useState("");

  // Custom hooks after state declarations
  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  // Event handlers
  const handlePickupChange = (e) => {
    setPickupLocation({ ...pickupLocation, address: e.target.value });
  };

  const handleDropoffChange = (e) => {
    setDropoffLocation({ ...dropoffLocation, address: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      pickup: {
        address: pickupLocation.address,
        coordinates: { lat: pickupLocation.lat, lng: pickupLocation.lng },
      },
      dropoff: {
        address: dropoffLocation.address,
        coordinates: { lat: dropoffLocation.lat, lng: dropoffLocation.lng },
      },
      date,
      time,
      seatRequired,
      willingToPay,
      message,
    });
  };

  // Effects last
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
          onChange={handlePickupChange}
          placeholder="Enter your pickup location"
        />
      </div>

      <div className={styles.requestInput}>
        <label htmlFor="request-dropoff">Destination:</label>
        <input
          id="request-dropoff"
          type="text"
          value={dropoffLocation.address}
          onChange={handleDropoffChange}
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
        <p>At</p>
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

      <button type="submit">Request Carpool</button>
    </form>
  );
}
