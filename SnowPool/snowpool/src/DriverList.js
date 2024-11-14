import React from "react";
import "./styles.css"; // Import CSS

const DriverList = ({ drivers, onDriverClick }) => {
  return (
    <div className="DriverList">
      <h2>Available Drivers</h2>
      {drivers.map((driver) => (
        <div key={driver.driverId} onClick={() => onDriverClick(driver)}>
          <h3>{driver.name}</h3>
          <p>Car: {driver.car}</p>
          <p>Destination: {driver.destination}</p>
          <p>Available Seats: {driver.availableSeats}</p>
          <p>Price: ${driver.price}</p>
          <p>Departure Time: {driver.departureTime}</p>
          <p>Estimated Duration: {driver.estimatedDuration}</p>
          <p>Pickup Location: {driver.pickupLocation.address}</p>
        </div>
      ))}
    </div>
  );
};

export default DriverList;
