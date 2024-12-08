// hooks/useGooglePlacesWithGeo.js
import { useEffect } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function useGooglePlacesWithGeo() {
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    }

    return () => {
      const script = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeAutocomplete = (inputId, onPlaceSelected) => {
    if (!window.google) return;

    const input = document.getElementById(inputId);
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "ca" },
      fields: ["formatted_address", "geometry"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected({
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });
  };

  return { initializeAutocomplete };
}
