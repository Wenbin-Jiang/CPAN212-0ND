// components/SearchBox.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";
import styles from "./SearchBox.module.css";

function SearchBox() {
  const [from, setFrom] = useState({ address: "", lat: null, lng: null });
  const [to, setTo] = useState({ address: "", lat: null, lng: null });
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  useEffect(() => {
    initializeAutocomplete("origin-input", setFrom);
    initializeAutocomplete("destination-input", setTo);
  }, [initializeAutocomplete]);

  const handleSearch = () => {
    if (!from.address || !to.address || !date) {
      alert("Please fill in all fields");
      return;
    }

    const searchParams = {
      from: {
        address: from.address,
        coordinates: { lat: from.lat, lng: from.lng },
      },
      to: {
        address: to.address,
        coordinates: { lat: to.lat, lng: to.lng },
      },
      date,
    };

    console.log("Search params:", searchParams);

    // You can use these parameters to navigate to search results
    navigate("/search-results", { state: searchParams });
  };

  return (
    <section className={styles.container}>
      <h2>Find a Ride for Your Next Adventure</h2>
      <div className={styles.searchbox}>
        <div className={styles.inputWrapper}>
          <i className="fas fa-map-marker-alt"></i>
          <input
            id="origin-input"
            type="text"
            placeholder="Origin"
            value={from.address}
            onChange={(e) => setFrom({ ...from, address: e.target.value })}
          />
        </div>

        <div className={styles.inputWrapper}>
          <i className="fas fa-map-marker-alt"></i>
          <input
            id="destination-input"
            type="text"
            placeholder="Destination"
            value={to.address}
            onChange={(e) => setTo({ ...to, address: e.target.value })}
          />
        </div>

        <div className={styles.inputWrapper}>
          <i className="fas fa-calendar"></i>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Set minimum date to today
          />
        </div>

        <button onClick={handleSearch}>
          <i className="fas fa-search"></i>
          Search
        </button>
      </div>
    </section>
  );
}

export default SearchBox;
