// components/SearchResults.jsx
import styles from "./SearchResults.module.css";

function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return <div className={styles.noResults}>No trips found</div>;
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <h2>Results {results.length > 0 && `1 to ${results.length}`}</h2>
        <span>{results.length} results total</span>
      </div>

      {results.map((trip, index) => (
        <div key={index} className={styles.tripCard}>
          <div className={styles.driverInfo}>
            <img
              src={trip.user.photo || "/default-avatar.jpg"}
              alt="Driver"
              className={styles.driverPhoto}
            />
            <div className={styles.driverDetails}>
              <h3>{trip.user.name}</h3>
              {trip.user.rating ? (
                <div className={styles.rating}>
                  <span>★ {trip.user.rating}</span>
                  <span>• {trip.user.totalRides} driven</span>
                </div>
              ) : (
                <span className={styles.noRating}>No ratings, yet</span>
              )}
            </div>
          </div>

          <div className={styles.tripDetails}>
            <h3>
              {trip.origin} to {trip.destination}
            </h3>

            <div className={styles.tripInfo}>
              <div>
                <strong>Leaving</strong>
                <p>
                  {new Date(trip.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {trip.time}
                </p>
              </div>

              {trip.returnDate && (
                <div>
                  <strong>Returning</strong>
                  <p>
                    {new Date(trip.returnDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {trip.returnTime}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.locationDetails}>
              <div>
                <strong>Pickup:</strong>
                <p>{trip.pickupLocation}</p>
              </div>
              <div>
                <strong>Dropoff:</strong>
                <p>{trip.dropoffLocation}</p>
              </div>
            </div>

            <div className={styles.tripFooter}>
              <div className={styles.preferences}>
                <strong>Vehicle preferences</strong>
                <div className={styles.preferenceIcons}>
                  {trip.preferences?.map((pref, i) => (
                    <span key={i} className={styles.preferenceIcon}>
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.pricing}>
                <span className={styles.price}>${trip.pricePerSeat}</span>
                <span className={styles.seats}>
                  {trip.seatsAvailable}{" "}
                  {trip.seatsAvailable === 1 ? "seat" : "seats"} left
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
