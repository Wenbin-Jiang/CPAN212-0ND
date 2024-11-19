// components/RouteMap.jsx
import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import styles from "./RouteMap.module.css";

const RouteMap = ({ origin, destination }) => {
  const [map, setMap] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [center, setCenter] = useState({ lat: 43.6532, lng: -79.3832 }); // Toronto default

  // Initialize route when map and locations are available
  useEffect(() => {
    if (!map || !origin || !destination || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, // We'll use custom markers
    });

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          setRouteDetails({
            distance: result.routes[0].legs[0].distance.text,
            duration: result.routes[0].legs[0].duration.text,
          });

          // Fit bounds to show entire route
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(result.routes[0].legs[0].start_location);
          bounds.extend(result.routes[0].legs[0].end_location);
          map.fitBounds(bounds);
        }
      }
    );

    return () => directionsRenderer.setMap(null);
  }, [map, origin, destination]);

  return (
    <div className={styles.mapContainer}>
      <APIProvider apiKey="AIzaSyCquosxRYOMH_tVqszAz_VPszu3wk86ojk">
        <Map
          onLoad={setMap}
          zoom={10}
          center={center}
          mapId="YOUR_MAP_ID"
          style={{ width: "100%", height: "400px" }}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          }}
        >
          {origin && (
            <AdvancedMarker position={origin}>
              <div className={styles.markerPin}>
                <div className={styles.markerLabel}>A</div>
              </div>
            </AdvancedMarker>
          )}
          {destination && (
            <AdvancedMarker position={destination}>
              <div className={styles.markerPin}>
                <div className={styles.markerLabel}>B</div>
              </div>
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>
      {routeDetails && (
        <div className={styles.routeInfo}>
          <p>
            Total route is {routeDetails.distance} ({routeDetails.duration} by
            car)
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
