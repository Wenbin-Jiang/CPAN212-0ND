// components/SearchBox.jsx
import { useState, useEffect } from "react";
import { useGooglePlacesWithGeo } from "../hooks/useGooglePlacesWithGeo";
import styles from "./SearchBox.module.css";

function SearchBox({ onSearch, isLoading }) {
  const [from, setFrom] = useState({ address: "", lat: null, lng: null });
  const [to, setTo] = useState({ address: "", lat: null, lng: null });
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const { initializeAutocomplete } = useGooglePlacesWithGeo();

  useEffect(() => {
    initializeAutocomplete("origin-input", setFrom);
    initializeAutocomplete("destination-input", setTo);
  }, [initializeAutocomplete]);

  const validateSearch = () => {
    setError("");

    if (!to.address || !to.lat || !to.lng) {
      setError("Please select a destination");
      return false;
    }

    if (!date) {
      setError("Please select a date");
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Please select a future date");
      return false;
    }

    return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateSearch()) {
      return;
    }

    const searchParams = {
      ...(from.address && {
        origin: {
          address: from.address,
          coordinates: { lat: from.lat, lng: from.lng },
        },
      }),
      destination: {
        address: to.address,
        coordinates: { lat: to.lat, lng: to.lng },
      },
      date,
    };

    onSearch(searchParams);
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
            placeholder="Origin (Optional)"
            value={from.address}
            onChange={(e) => setFrom({ ...from, address: e.target.value })}
          />
        </div>

        <div className={styles.inputWrapper}>
          <i className="fas fa-map-marker-alt"></i>
          <input
            id="destination-input"
            type="text"
            placeholder="Destination *"
            value={to.address}
            onChange={(e) => setTo({ ...to, address: e.target.value })}
            required
          />
        </div>

        <div className={styles.inputWrapper}>
          <i className="fas fa-calendar"></i>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            placeholder="Date *"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={styles.searchButton}
        >
          <i className="fas fa-search"></i>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </section>
  );
}

export default SearchBox;
