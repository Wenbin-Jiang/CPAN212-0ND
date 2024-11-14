import React, { useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// Sample driver data with locations (latitude and longitude)
const drivers = [
  { id: 1, name: "Alice", position: { lat: 43.6532, lng: -79.3832 } }, // Toronto
  { id: 2, name: "Bob", position: { lat: 43.4516, lng: -80.4925 } }, // Kitchener
  { id: 3, name: "Charlie", position: { lat: 45.4215, lng: -75.6972 } }, // Ottawa
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 44.0,
  lng: -79.0,
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCquosxRYOMH_tVqszAz_VPszu3wk86ojk", // Replace with your actual API key
  });

  const [selectedDriver, setSelectedDriver] = useState(null);

  const onMarkerClick = useCallback((driver) => {
    setSelectedDriver(driver);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <h3>Map View</h3>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={7} center={center}>
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            position={driver.position}
            onClick={() => onMarkerClick(driver)}
          />
        ))}
      </GoogleMap>

      {selectedDriver && (
        <div className="driver-info">
          <h4>Driver Info</h4>
          <p>
            <strong>Name:</strong> {selectedDriver.name}
          </p>
          <p>
            <strong>Location:</strong> ({selectedDriver.position.lat},{" "}
            {selectedDriver.position.lng})
          </p>
        </div>
      )}
    </div>
  );
}

export default Map;
