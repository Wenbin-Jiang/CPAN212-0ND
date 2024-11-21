// components/PostCarpoolRequest.jsx
import React, { useState, useEffect } from "react";
import styles from "./PostCarpoolRequest.module.css";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";

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
  const [seatRequired, setSeatRequired] = useState("");
  const [willingToPay, setWillingToPay] = useState("");
  const [message, setMessage] = useState("");

  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  useEffect(() => {
    initializeAutocomplete("request-pickup", setPickupLocation);
    initializeAutocomplete("request-dropoff", setDropoffLocation);
  }, []);

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

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Request a Carpool</h1>
      <h2>Get notified when new trips match your travel needs</h2>

      <div className={styles.requestInput}>
        <label>Origin:</label>
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
        <label>Destination:</label>
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

      {/* Rest of the form remains the same */}
      <div className={styles.requestInput}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p>At</p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className={styles.requestInput}>
        <label>Seat Required:</label>
        <input
          type="number"
          value={seatRequired}
          onChange={(e) => setSeatRequired(e.target.value)}
          min="1"
          placeholder="Minimum 1 seat"
        />
      </div>

      <div className={styles.requestInput}>
        <label>Willing to pay:</label>
        <input
          type="number"
          value={willingToPay}
          onChange={(e) => setWillingToPay(e.target.value)}
          placeholder="$ / Seat"
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

      <button type="submit" className={styles.requestInput}>
        Request Carpool
      </button>
    </form>
  );
}
