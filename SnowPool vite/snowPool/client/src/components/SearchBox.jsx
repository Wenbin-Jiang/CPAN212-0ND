import { useState, useEffect } from "react";
import styles from "./SearchBox.module.css";
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function SearchBox() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }

    return () => {
      // Cleanup script when component unmounts
      const script = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google) return;

    // Initialize autocomplete for origin input
    const originInput = document.getElementById("origin-input");
    const originAutocomplete = new window.google.maps.places.Autocomplete(
      originInput,
      {
        componentRestrictions: { country: "ca" }, // Restrict to Canada
        fields: ["formatted_address", "geometry"],
        types: ["geocode"],
      }
    );

    // Initialize autocomplete for destination input
    const destInput = document.getElementById("destination-input");
    const destAutocomplete = new window.google.maps.places.Autocomplete(
      destInput,
      {
        componentRestrictions: { country: "ca" }, // Restrict to Canada
        fields: ["formatted_address", "geometry"],
        types: ["geocode"],
      }
    );

    // Add place_changed event listeners
    originAutocomplete.addListener("place_changed", () => {
      const place = originAutocomplete.getPlace();
      if (place.formatted_address) {
        setFrom(place.formatted_address);
      }
    });

    destAutocomplete.addListener("place_changed", () => {
      const place = destAutocomplete.getPlace();
      if (place.formatted_address) {
        setTo(place.formatted_address);
      }
    });
  };

  const handleSearch = () => {
    console.log(`Searching for drivers from ${from} to ${to} on ${date}`);
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
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <i className="fas fa-map-marker-alt"></i>
          <input
            id="destination-input"
            type="text"
            placeholder="Destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <i className="fas fa-calendar"></i>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
