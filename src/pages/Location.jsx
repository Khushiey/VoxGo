import React, { useState, useEffect } from "react";
import VoiceButton from "../components/VoiceButton";
import { speak } from "../utils/Speech";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

// Custom red pin icon
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
});

// Routing component
function Routing({ destination }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !destination) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const origin = L.latLng(pos.coords.latitude, pos.coords.longitude);

        // Remove old routes if any
        map.eachLayer((layer) => {
          if (
            layer._container &&
            layer._container.classList.contains("leaflet-routing-container")
          ) {
            map.removeControl(layer);
          }
        });

        const routingControl = L.Routing.control({
          waypoints: [origin, L.latLng(destination.lat, destination.lng)],
          routeWhileDragging: false,
          lineOptions: {
            styles: [{ color: "#43e97b", weight: 5, opacity: 0.9 }],
          },
          showAlternatives: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          createMarker: () => null,
        })
          .on("routesfound", (e) => {
            const route = e.routes[0];
            if (route && route.summary) {
              const distance = (route.summary.totalDistance / 1000).toFixed(2);
              const duration = (route.summary.totalTime / 60).toFixed(0);
              speak(
                `Found route. Distance ${distance} kilometers, approximately ${duration} minutes.`
              );
            }
          })
          .addTo(map);

        return () => map.removeControl(routingControl);
      });
    }
  }, [map, destination]);

  return null;
}

// Auto zoom to destination
function ZoomToDestination({ destination }) {
  const map = useMap();

  useEffect(() => {
    if (destination) {
      map.flyTo([destination.lat, destination.lng], 15, {
        duration: 2,
      });
    }
  }, [destination, map]);

  return null;
}

export default function LocationMap() {
  const [query, setQuery] = useState("");
  const [directions, setDirections] = useState("");
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle location search
  const handleLocation = async (text) => {
    if (!text.trim()) return;
    setQuery(text);
    setLoading(true);
    speak(`Searching directions for ${text}...`);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text + ", India"
        )}&limit=3&addressdetails=1`
      );
      const data = await res.json();

      if (data.length > 0) {
        const bestMatch =
          data.find((d) =>
            (d.display_name || "").toLowerCase().includes("college")
          ) || data[0];

        const dest = {
          lat: parseFloat(bestMatch.lat),
          lng: parseFloat(bestMatch.lon),
        };
        setDestination(dest);

        const response = `Here are the directions to ${bestMatch.display_name}.`;
        setDirections(response);
        speak(response);
      } else {
        setDirections("Location not found, please try again.");
        speak("Location not found, please try again.");
      }
    } catch (err) {
      console.error("❌ Geocoding error:", err);
      setDirections("Network error. Please check your connection.");
      speak("There was a network problem. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLocation(query);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: destination ? "flex-start" : "center",
        backgroundImage: "url('https://wallpapercave.com/wp/wp12782258.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        padding: "20px",
        transition: "all 0.5s ease",
      }}
    >
      {/* Card UI */}
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          width: "60vw",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          padding: "20px",
          textAlign: "center",
          marginBottom: destination ? "20px" : "0",
        }}
      >
        <h2
          style={{
            fontSize: "2vw",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "20px",
            letterSpacing: "2px",
            textShadow: "0 2px 12px #43e97b",
          }}
        >
          Location Directions
        </h2>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter location..."
            style={{
              fontSize: "1.2vw",
              padding: "0.8vw 1.2vw",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.85)",
              color: "#222",
              width: "20vw",
            }}
          />
          <button
            onClick={() => handleLocation(query)}
            disabled={loading}
            style={{
              padding: "0.8vw 1.2vw",
              background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#222",
              fontWeight: "600",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <VoiceButton
            onResult={handleLocation}
            style={{
              fontSize: "2vw",
              padding: "0.6vw 1vw",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              color: "#222",
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>

        {directions && (
          <div
            style={{
              marginTop: "15px",
              color: "#fff",
              fontSize: "1.2vw",
              textShadow: "0 1px 8px #38f9d7",
            }}
          >
            {directions}
          </div>
        )}
      </div>

      {/* Map appears only after searching */}
      {destination && (
        <div
          style={{
            width: "80vw",
            height: "70vh",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <MapContainer
            center={[destination.lat, destination.lng]}
            zoom={14}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Routing destination={destination} />
            <ZoomToDestination destination={destination} />
            <Marker position={[destination.lat, destination.lng]} icon={locationIcon} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
