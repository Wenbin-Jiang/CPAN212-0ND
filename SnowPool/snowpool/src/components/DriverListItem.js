import React from "react";

function DriverListItem({ driver }) {
  return (
    <div className="driver-list-item">
      <h4>{driver.name}</h4>
      <p>Rating: {driver.rating}⭐</p>
      <p>Price: {driver.price}</p>
      <p>Seats Left: {driver.seatsLeft}</p>
      <p>Departure Time: {driver.time}</p>
      <button>View Trip</button>
    </div>
  );
}

export default DriverListItem;
