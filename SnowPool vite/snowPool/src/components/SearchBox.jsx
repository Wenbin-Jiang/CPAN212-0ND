import { useState } from "react";
import styles from "./SearchBox.module.css";

function SearchBox() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    console.log(`Searching for drivers from ${from} to ${to} on ${date}`);
  };

  return (
    <section>
      <h2>Find a Ride for Your Next Adventure</h2>
      <div className={styles.searchbox}>
        <input
          type="text"
          placeholder="Origin"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
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

export default SearchBox;
