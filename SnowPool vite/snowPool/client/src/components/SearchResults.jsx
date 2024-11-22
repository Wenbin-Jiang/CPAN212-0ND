// components/SearchResults.jsx
import styles from "./SearchResults.module.css";
import SearchResultItem from "../components/SearchResultItem";

function SearchResults({
  results,
  totalResults,
  searchOrigin,
  searchDestination,
}) {
  if (!results || results.length === 0) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsContent}>
          <h3>No trips found</h3>
          <p>Try adjusting your search by:</p>
          <ul>
            <li>Selecting a different date</li>
            <li>Changing your destination</li>
            <li>Removing the origin location to see more results</li>
          </ul>
        </div>
      </div>
    );
  }

  const groupTripsByDate = (trips) => {
    return trips.reduce((acc, trip) => {
      const [year, month, day] = trip.date.split("-");

      const dateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      const date = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trip);

      acc[date].sort((a, b) => a.time.localeCompare(b.time));

      return acc;
    }, {});
  };

  // const groupedTrips = groupTripsByDate(results);

  //extract first part of address
  const getFirstPart = (address) => {
    return address?.split(",")[0] || "";
  };

  return (
    <div className={styles.searchResults}>
      <div className={styles.resultsHeader}>
        <h2>
          Results from {getFirstPart(searchOrigin) || "anywhere"} to{" "}
          {getFirstPart(searchDestination)}
        </h2>
        ;
      </div>

      {Object.entries(groupTripsByDate(results)).map(([date, trips]) => (
        <div key={date} className={styles.dateGroup}>
          <h3 className={styles.dateHeader}>{date}</h3>
          {trips.map((trip) => (
            <SearchResultItem key={trip._id} trip={trip} />
          ))}
        </div>
      ))}
    </div>
  );
}
export default SearchResults;
