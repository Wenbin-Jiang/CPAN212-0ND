import React, { useState } from "react";

function HeroSection() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    console.log(`Searching for drivers from ${from} to ${to} on ${date}`);
  };

  return (
    <section className="hero-section">
      <h2>Find a Ride for Your Next Adventure</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </section>
  );
}

export default HeroSection;
