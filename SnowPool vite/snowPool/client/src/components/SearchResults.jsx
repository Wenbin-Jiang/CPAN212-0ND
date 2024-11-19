// components/SearchResults.jsx
import React from "react";
import styles from "./SearchResults.module.css";

const SearchResults = ({ rides }) => {
  const groupRidesByDate = (rides) => {
    return rides.reduce((acc, ride) => {
      const date = ride.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(ride);
      return acc;
    }, {});
  };

  const groupedRides = groupRidesByDate(rides);

  return (
    <div className={styles.searchResults}>
      {Object.entries(groupedRides).map(([date, dateRides]) => (
        <div key={date}>
          <h3 className={styles.dateHeader}>{date}</h3>
          {dateRides.map((ride, index) => (
            <div key={index} className={styles.rideCard}>
              <div className={styles.rideHeader}>
                <h4>
                  {ride.from} to {ride.to}
                </h4>
                <span className={styles.seatsNeeded}>
                  {ride.seatsNeeded} seat needed
                </span>
              </div>
              <div className={styles.rideDetails}>
                <div className={styles.driverInfo}>
                  <img src={ride.driverPhoto} alt={ride.driverName} />
                  <div>
                    <p className={styles.driverName}>{ride.driverName}</p>
                    <p className={styles.rideStats}>
                      {ride.rating ? (
                        <>
                          <span>★ {ride.rating}</span>
                          <span>• {ride.totalRides} rides</span>
                        </>
                      ) : (
                        "No ratings, yet"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
