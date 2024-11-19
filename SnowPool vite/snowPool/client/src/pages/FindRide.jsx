// pages/FindRide.jsx
import { useState } from "react";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import SearchBox from "../components/SearchBox";
import SearchResults from "../components/SearchResults";
import styles from "./FindRide.module.css";

function FindRide() {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (searchData) => {
    // Mock data - replace with actual API call
    const mockResults = [
      {
        date: "Monday, December 2",
        rides: [
          {
            from: "Toronto",
            to: "Blue Mountains",
            seatsNeeded: "1",
            driverName: "Mudiaga",
            driverPhoto: "/path-to-photo.jpg",
            rating: null,
            totalRides: 0,
          },
          {
            from: "Toronto",
            to: "MSL",
            seatsNeeded: "1",
            driverName: "wayne",
            driverPhoto: "/path-to-photo.jpg",
            rating: null,
            totalRides: 1,
          },
          // Add more rides as needed
        ],
      },
      {
        date: "Monday, December 3",
        rides: [
          {
            from: "Toronto",
            to: "Blue Mountains",
            seatsNeeded: "1",
            driverName: "Mudiaga",
            driverPhoto: "/path-to-photo.jpg",
            rating: null,
            totalRides: 0,
          },
          {
            from: "Toronto",
            to: "MSL",
            seatsNeeded: "1",
            driverName: "wayne",
            driverPhoto: "/path-to-photo.jpg",
            rating: null,
            totalRides: 1,
          },
          // Add more rides as needed
        ],
      },
    ];
    setSearchResults(mockResults);
  };

  return (
    <>
      <main
        className={`${styles.findride} ${
          searchResults ? styles.withResults : ""
        }`}
      >
        <PageNav />
        <div className={styles.row}>
          <SearchBox onSearch={handleSearch} />
          {searchResults && <SearchResults rides={searchResults} />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FindRide;
