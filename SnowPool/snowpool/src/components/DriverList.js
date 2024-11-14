import React from "react";
import DriverListItem from "./DriverListItem";

function DriverList() {
  const drivers = [
    {
      id: 1,
      name: "Alice",
      rating: 4.5,
      price: "$25",
      seatsLeft: 2,
      time: "9:00 AM",
    },
    {
      id: 2,
      name: "Bob",
      rating: 4.2,
      price: "$30",
      seatsLeft: 1,
      time: "11:00 AM",
    },
    // Add more driver data as needed
  ];

  return (
    <section className="driver-list">
      <h3>Available Drivers</h3>
      {drivers.map((driver) => (
        <DriverListItem key={driver.id} driver={driver} />
      ))}
    </section>
  );
}

export default DriverList;
