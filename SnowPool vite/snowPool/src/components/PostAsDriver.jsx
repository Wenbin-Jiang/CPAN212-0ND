import React, { useState } from "react";

export default function PostAsDriver() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); // New Pickup Time
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [cost, setCost] = useState(""); // New Cost
  const [message, setMessage] = useState(""); // New Message Box

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data
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
    <form onSubmit={handleSubmit}>
      <h2>Post a Ride as Driver</h2>
      <div>
        <label>Departure:</label>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="Enter your departure location"
        />
      </div>
      <div>
        <label>Destination:</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter your destination"
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label>Pickup Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label>Seats Available:</label>
        <input
          type="number"
          value={seatsAvailable}
          onChange={(e) => setSeatsAvailable(e.target.value)}
          min="1"
        />
      </div>
      <div>
        <label>Cost per Person:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Enter the cost in dollars"
          min="0"
          step="0.01"
        />
      </div>
      <div>
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
