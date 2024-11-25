import styles from "./SearchResultItem.module.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";
import api from "../services/api";

const getFirstPart = (address) => address?.split(",")[0] || "";

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

const formatDate = (dateString, time) => {
  const [year, month, day] = dateString.split("-");
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return `${dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })} at ${time}`;
};

function SearchResultItem({ trip }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userData } = useUserContext();
  const isTripFull = trip.seatsAvailable === 0;
  const isDriver = trip.tripType === "driver";

  const handleRequest = async () => {
    if (!userData) {
      alert("Please log in before you put in your request");
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please log in before you put in your request",
        },
      });
      return;
    }

    if (userData.id === trip.user._id) {
      alert("You cannot request your own trip");
      return;
    }

    if (isDriver && isTripFull) {
      alert("This trip is already full");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `/api/trips/${trip._id}/${
        isDriver ? "join" : "request-driver"
      }`;
      const requestData = isDriver
        ? {
            passengerId: userData.id,
            requestedSeats: 1,
            passengerName: userData.name,
          }
        : {
            driverId: userData.id,
            driverName: userData.name,
          };

      const response = await api.post(endpoint, requestData);
      if (response.status === 200) {
        alert("Request sent successfully!");
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Failed to submit request";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDriverInfo = () => (
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
  );

  return (
    <div className={styles.tripCard}>
      {renderDriverInfo()}
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
            {formatDate(trip.date, trip.time)}
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
          {trip.additionalMessage && (
            <p className={styles.additionalMessage}>
              Note: {trip.additionalMessage}
            </p>
          )}
          <div className={styles.requestButtonContainer}>
            <button
              onClick={handleRequest}
              className={styles.requestButton}
              disabled={isLoading || isTripFull}
            >
              {isLoading
                ? "Sending Request..."
                : isTripFull
                ? "Trip Full"
                : isDriver
                ? "Request to Join"
                : "Request to Drive"}
            </button>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultItem;
