import { useState, useEffect } from "react";
import axios from "axios";

function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8001/api/bookings/user/bookings"
        );
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error("Error fetching bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3>Trip Details</h3>
            <div className="booking-details">
              <p>
                <strong>Trip ID:</strong> {booking.trip._id}
              </p>
              <p>
                <strong>From:</strong> {booking.trip.origin}
              </p>
              <p>
                <strong>To:</strong> {booking.trip.destination}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.trip.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsList;
