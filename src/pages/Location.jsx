import React, { useState, useEffect } from "react";
import VoiceButton from "../components/VoiceButton";
import { speak } from "../utils/Speech";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import TurnBackButton from "../components/ui/backbutton";

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

        // Remove existing routing control
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

              // ✔ Google Maps style route objects
              const routeInfo = {
                distance: `${distance} km`,
                duration: `${duration} minutes`,
                completeRoadMap: route.instructions.map((step, i) => ({
                  step: i + 1,
                  text: step.text,
                  type: step.type,
                  distance: `${(step.distance / 1000).toFixed(2)} km`,
                })),
              };

              console.log("📌 Google-Map-Like Route Info", routeInfo);

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
      map.flyTo([destination.lat, destination.lng], 15, { duration: 2 });
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLocation(query);
  };

  return (
    <div
      className="location-page"
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
      <div
        className="location-card"
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
          className="location-title"
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

        <div
          className="location-inputs"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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
              minWidth: "180px",
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

          {/* Updated Voice Button */}
          <VoiceButton
            onResult={handleLocation}
            onStartListening={() => setDirections("Listening…")}
            onStopListening={() => setDirections("")}
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
            className="directions-text"
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

      {destination && (
        <div
          className="map-wrapper"
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

      {/* Styles unchanged */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          @media (max-width: 1024px) {
            .location-card {
              width: 80vw !important;
              padding: 16px !important;
            }
            .location-title {
              font-size: 2.6vw !important;
            }
            .directions-text {
              font-size: 1.8vw !important;
            }
          }

          @media (max-width: 768px) {
            .location-card {
              width: 90vw !important;
              border-radius: 20px !important;
              padding: 14px !important;
            }
            .location-title {
              font-size: 4vw !important;
              margin-bottom: 12px !important;
            }
            .location-inputs {
              flex-direction: column !important;
              align-items: center !important;
              gap: 12px !important;
            }
            .location-card input {
              font-size: 3vw !important;
              width: 70vw !important;
              padding: 2vw !important;
            }
            .location-card button,
            .location-card button[type="button"],
            .location-card .voice-button {
              font-size: 3vw !important;
              padding: 2vw 4vw !important;
            }
            .directions-text {
              font-size: 3vw !important;
              margin-top: 10px !important;
            }
            .map-wrapper {
              width: 95vw !important;
              height: 60vh !important;
            }
          }

          @media (max-width: 480px) {
            .location-card {
              width: 95vw !important;
              border-radius: 16px !important;
              padding: 12px !important;
            }
            .location-title {
              font-size: 6vw !important;
              letter-spacing: 1px !important;
            }
            .location-card input {
              font-size: 4vw !important;
              width: 80vw !important;
              padding: 3vw 4vw !important;
            }
            .location-card button {
              font-size: 4vw !important;
              padding: 3vw 5vw !important;
              width: 60%;
            }
            .directions-text {
              font-size: 4vw !important;
            }
            .map-wrapper {
              width: 95vw !important;
              height: 50vh !important;
              margin-top: 16px !important;
            }
          }
        `}
      </style>
      <TurnBackButton />
    </div>
  );
}
