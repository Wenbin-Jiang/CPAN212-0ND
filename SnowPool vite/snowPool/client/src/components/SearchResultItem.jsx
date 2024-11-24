import styles from "./SearchResultItem.module.css";

function SearchResultItem({ trip }) {
  const isTripFull = trip.seatsAvailable === 0;
  const isDriver = trip.tripType === "driver";

  const getFirstPart = (address) => {
    return address?.split(",")[0] || "";
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className={styles.tripCard}>
      <div className={styles.driverSection}>
        <img
          src={trip.user?.photo || "/profile-icon.jpeg"}
          alt=""
          className={styles.driverPhoto}
        />
        <div className={styles.driverInfo}>
          <h4>{trip.user?.name}</h4>
          <div className={styles.userDetails}>
            <span>{trip.user?.gender}</span>
            {trip.user?.birthday && (
              <span> • {calculateAge(trip.user.birthday)} years old</span>
            )}
          </div>
          {trip.user?.rating ? (
            <div className={styles.rating}>
              <span>★ {trip.user.rating}</span>
              <span>
                • {trip.user.totalRides} {isDriver ? "driven" : "rides"}
              </span>
            </div>
          ) : (
            <span className={styles.noRating}>No ratings, yet</span>
          )}
          {isDriver && (
            <div className={styles.carInfo}>
              <div>
                <strong>Car:</strong> {trip.user?.carModel}
              </div>
              <div>
                <strong>License:</strong> {trip.user?.licensePlate}
              </div>
              {trip.user?.driverHistory && (
                <div>
                  <strong>Experience:</strong> {trip.user.driverHistory}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className={styles.tripInfo}>
        <div className={styles.tripHeader}>
          <div>
            <div className={styles.tripType}>
              {isDriver ? "I'm driving" : "I need a ride"}
            </div>
            <h3>
              {getFirstPart(trip.origin)} to {getFirstPart(trip.destination)}
            </h3>
          </div>
          <div className={styles.priceSection}>
            <span className={styles.price}>
              ${isDriver ? trip.pricePerSeat : trip.willingToPay}
            </span>
            {isDriver ? (
              isTripFull ? (
                <span className={styles.tripFull}>Trip full</span>
              ) : (
                <span className={styles.seatsLeft}>
                  {trip.seatsAvailable}{" "}
                  {trip.seatsAvailable === 1 ? "seat" : "seats"} left
                </span>
              )
            ) : (
              <span className={styles.seatsRequired}>
                {trip.seatsRequired}{" "}
                {trip.seatsRequired === 1 ? "seat" : "seats"} needed
              </span>
            )}
          </div>
        </div>

        <div className={styles.tripTimes}>
          <div>
            <strong>Leaving: </strong>
            {(() => {
              const [year, month, day] = trip.date.split("-");
              const dateObj = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
              return `${dateObj.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })} at ${trip.time}`;
            })()}
          </div>
        </div>

        <div className={styles.locations}>
          <div>
            <strong>Pickup:</strong> {getFirstPart(trip.origin)}
          </div>
          <div>
            <strong>Dropoff:</strong> {getFirstPart(trip.destination)}
          </div>
        </div>

        <div className={styles.tripFooter}>
          <div className={styles.preferences}>
            {trip.additionalMessage && (
              <p className={styles.additionalMessage}>
                Note: {trip.additionalMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultItem;
