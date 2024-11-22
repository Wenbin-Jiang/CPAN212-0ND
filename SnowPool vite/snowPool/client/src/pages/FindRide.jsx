// pages/FindRide.jsx
import { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import PageNav from "../components/PageNav";
import SearchBox from "../components/SearchBox";
import SearchResults from "../components/SearchResults";
import styles from "./FindRide.module.css";

const baseURL = "http://localhost:8001";

function FindRide() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${baseURL}/api/trips/search`, {
        params: {
          origin: searchParams.origin?.address || "",
          destination: searchParams.destination.address,
          date: searchParams.date,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Search results:", response.data);
      setSearchResults(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      console.error("Search error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
          {error && <div className={styles.errorMessage}>{error}</div>}
          {searchResults && <SearchResults rides={searchResults} />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FindRide;
