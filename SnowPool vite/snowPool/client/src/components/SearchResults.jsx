import styles from "./SearchResults.module.css";
import SearchResultItem from "./SearchResultItem";

const getFirstPart = (address) => address?.split(",")[0] || "";

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const groupTripsByDate = (trips) => {
  return trips.reduce((acc, trip) => {
    const date = formatDate(trip.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trip);
    acc[date].sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {});
};

function SearchResults({ results, searchOrigin, searchDestination }) {
  if (!results?.length) {
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

  return (
    <div className={styles.searchResults}>
      <div className={styles.resultsHeader}>
        <h2>
          Results from {getFirstPart(searchOrigin) || "anywhere"} to{" "}
          {getFirstPart(searchDestination)}
        </h2>
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
