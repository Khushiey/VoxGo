import React, { useState, useEffect, useRef, useCallback } from "react";
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
function Routing({ origin, destination, onRouteFound, onRouteError }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !destination) return;

    let routingControl;

    const createRoute = async (originLatLng) => {
      try {
        // Remove existing routing control
        if (routingControl) {
          map.removeControl(routingControl);
        }

        // Create new routing control with better error handling
        routingControl = L.Routing.control({
          waypoints: [originLatLng, L.latLng(destination.lat, destination.lng)],
          routeWhileDragging: false,
          lineOptions: {
            styles: [
              { color: '#4285f4', weight: 8, opacity: 0.9 },
              { color: '#4285f4', weight: 6, opacity: 0.8 },
              { color: '#4285f4', weight: 4, opacity: 0.7 }
            ],
          },
          showAlternatives: true,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          createMarker: () => null,
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving',
            timeout: 30000,
            retryTimeout: 5000,
            requestParameters: {
              steps: true,
              alternatives: true,
              overview: 'full'
            }
          }),
        })
        .on("routesfound", (e) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const bestRoute = routes[0];
            const distance = (bestRoute.summary.totalDistance / 1000).toFixed(2);
            const duration = (bestRoute.summary.totalTime / 60).toFixed(0);

            // Style the route line after it's created
            if (routingControl && routingControl._routes && routingControl._routes.length > 0) {
              routingControl._routes.forEach((route, index) => {
                if (route._route && route._route.coordinates) {
                  L.polyline(route._route.coordinates, {
                    color: index === 0 ? '#4285f4' : '#a0c4ff',
                    weight: index === 0 ? 8 : 4,
                    opacity: index === 0 ? 0.9 : 0.6,
                  }).addTo(map);
                }
              });
            }

            const routeData = {
              distance: `${distance} km`,
              duration: `${duration} minutes`,
              instructions: bestRoute.instructions.map((step, i) => ({
                step: i + 1,
                text: step.text,
                type: step.type,
                distance: `${(step.distance / 1000).toFixed(2)} km`,
              })),
              alternatives: routes.slice(1).map((route, idx) => ({
                index: idx + 1,
                distance: `${(route.summary.totalDistance / 1000).toFixed(2)} km`,
                duration: `${(route.summary.totalTime / 60).toFixed(0)} minutes`,
              })),
            };

            if (onRouteFound) {
              onRouteFound(routeData);
            }

            console.log("📌 Route Info", routeData);

            speak(
              `Found route. Distance ${distance} kilometers, approximately ${duration} minutes. ${
                routes.length > 1 ? `${routes.length - 1} alternative routes available.` : ""
              }`
            );
          }
        })
        .on("routingerror", (err) => {
          console.error("Routing error:", err);
          if (onRouteError) {
            onRouteError(err);
          }
          speak("Unable to calculate route. Please try a different destination or check your internet connection.");
        })
        .addTo(map);

      } catch (error) {
        console.error("Error creating route:", error);
        if (onRouteError) {
          onRouteError(error);
        }
      }
    };

    // Get origin coordinates
    if (origin && origin.lat && origin.lng) {
      console.log("Creating route with origin:", origin, "destination:", destination);
      createRoute(L.latLng(origin.lat, origin.lng));
    } else {
      // Try to get current location if no origin provided
      console.log("No origin provided, getting current location for routing");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const currentPos = L.latLng(pos.coords.latitude, pos.coords.longitude);
            console.log("Using current location for routing:", currentPos);
            createRoute(currentPos);
          },
          (error) => {
            console.error("Geolocation error for routing:", error);
            if (onRouteError) {
              onRouteError(new Error("Unable to get current location for routing. Please set your origin manually."));
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        console.error("Geolocation not supported");
        if (onRouteError) {
          onRouteError(new Error("Geolocation not supported. Please set your origin manually."));
        }
      }
    }

    return () => {
      if (routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (error) {
          console.warn("Error removing routing control:", error);
        }
      }
    };
  }, [map, destination, origin, onRouteFound, onRouteError]);

  return null;
}

// Zoom Controls Component
function ZoomControls() {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <button
        onClick={zoomIn}
        style={{
          width: "40px",
          height: "40px",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Zoom In"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        style={{
          width: "40px",
          height: "40px",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Zoom Out"
      >
        −
      </button>
    </div>
  );
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

// Current location marker component
function CurrentLocationMarker({ currentLocation, isTracking }) {
  const map = useMap();

  useEffect(() => {
    if (!currentLocation || !isTracking) return;

    // Create or update current location marker
    const currentLocationIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
      className: "current-location-marker",
    });

    const marker = L.marker([currentLocation.lat, currentLocation.lng], {
      icon: currentLocationIcon,
    })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <strong>📍 Your Location</strong><br/>
          ${currentLocation.speed ? `Speed: ${currentLocation.speed} km/h<br/>` : ""}
          Accuracy: ±${currentLocation.accuracy}m<br/>
          <small>${currentLocation.timestamp.toLocaleTimeString()}</small>
        </div>
      `);

    // Add accuracy circle
    const accuracyCircle = L.circle([currentLocation.lat, currentLocation.lng], {
      color: "#43e97b",
      fillColor: "#43e97b",
      fillOpacity: 0.1,
      radius: currentLocation.accuracy,
      weight: 1,
    }).addTo(map);

    return () => {
      map.removeLayer(marker);
      map.removeLayer(accuracyCircle);
    };
  }, [currentLocation, isTracking, map]);

  return null;
}

export default function LocationMap() {
  const [query, setQuery] = useState("");
  const [directions, setDirections] = useState("");
  const [destination, setDestination] = useState(null);
  const [destinationName, setDestinationName] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [originCoords, setOriginCoords] = useState(null);
  const [originName, setOriginName] = useState("Your Location");
  const [isTracking, setIsTracking] = useState(false);
  const [mapLayer, setMapLayer] = useState("streets");
  const [showControls, setShowControls] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const routeInfoRef = useRef(null);

  // Fetch directions on component mount
  const fetchDirections = useCallback(async () => {
    // Automatically get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await getLocationName(latitude, longitude);
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            name: locationName,
            timestamp: new Date(),
          });
          setOriginCoords({ lat: latitude, lng: longitude });
          setOriginName(locationName || "Your Location");
          speak(`Location detected: ${locationName}`);
        },
        (error) => {
          console.warn("Could not get current location:", error);
          speak("Please allow location access for better directions.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  useEffect(() => {
    // Only run once on mount
    fetchDirections();
  }, [fetchDirections]);

  // Handle location search
  const handleLocation = async (text) => {
    if (!text.trim()) return;
    setQuery(text);
    setLoading(true);
    setRouteLoading(true);
    setRouteInfo(null);
    speak(`Searching directions for ${text}...`);

    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== text);
      return [text, ...filtered].slice(0, 4);
    });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&limit=5&addressdetails=1`
      );
      const data = await res.json();

      if (data.length > 0) {
        const bestMatch = data[0];

        const dest = {
          lat: parseFloat(bestMatch.lat),
          lng: parseFloat(bestMatch.lon),
        };

        setDestination(dest);
        setDestinationName(bestMatch.display_name || text);
        setOriginName(currentLocation?.name || "Your Location");
        setOriginCoords(currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : null);

        const response = `Here are the directions from ${currentLocation?.name || "your current location"} to ${bestMatch.display_name}.`;
        setDirections(response);
        speak(response);
      } else {
        setRouteLoading(false);
        setDirections("Location not found, please try again.");
        speak("Location not found, please try again.");
      }
    } catch (err) {
      console.error("❌ Geocoding error:", err);
      setRouteLoading(false);
      setDirections("Network error. Please check your connection.");
      speak("There was a network problem. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRouteFound = useCallback((routeData) => {
    setRouteInfo(routeData);
    setRouteLoading(false);
  }, []);

  const handleRouteError = useCallback((error) => {
    console.warn("Route error:", error);
    setRouteLoading(false);
    setRouteInfo(null);

    let errorMessage = "Unable to calculate route.";
    if (error?.message) {
      if (error.message.includes("timeout")) {
        errorMessage = "Route calculation timed out. The routing service might be busy.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("location")) {
        errorMessage = "Location access required for routing. Please allow location permissions.";
      }
    }

    setDirections(errorMessage);
    speak(errorMessage + " Please try again or use a different destination.");
  }, []);

  const scrollToRouteInfo = () => {
    if (routeInfoRef.current) {
      routeInfoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get location name from coordinates
  const getLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.address?.city || data.address?.town || data.address?.village || data.display_name || "Unknown Location";
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      return "Current Location";
    }
  };

  // Get search suggestions
  const getSuggestions = async (text) => {
    if (!text.trim() || text.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          text
        )}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestions error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    getSuggestions(text);
  };

  const selectSuggestion = (suggestion) => {
    const locationName = suggestion.display_name || suggestion.name || query;
    setQuery(locationName);
    setSuggestions([]);
    setShowSuggestions(false);
    setRouteLoading(true);
    
    const dest = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    };
    
    setDestination(dest);
    setDestinationName(locationName);
    setOriginName(currentLocation?.name || "Your Location");
    setOriginCoords(currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : null);
    setRouteInfo(null);
    
    const response = `Here are the directions from ${currentLocation?.name || "your current location"} to ${locationName}.`;
    setDirections(response);
    speak(response);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLocation(query);
      setShowSuggestions(false);
    }
  };

  // GPS Tracking Functions
  const startGPSTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, speed, accuracy } = position.coords;
          const locationName = await getLocationName(latitude, longitude);
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            name: locationName,
            speed: speed ? (speed * 3.6).toFixed(1) : null, // Convert m/s to km/h
            accuracy: Math.round(accuracy),
            timestamp: new Date(),
          });
          setOriginCoords({ lat: latitude, lng: longitude });
          setOriginName(locationName || "Your Location");
          setIsTracking(true);
        },
        (error) => {
          console.error("GPS tracking error:", error);
          speak("GPS tracking failed. Please check location permissions.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        }
      );
      setWatchId(id);
      speak("GPS tracking started. Your location is now being monitored.");
    } else {
      speak("GPS is not supported on this device.");
    }
  };

  const stopGPSTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      speak("GPS tracking stopped.");
    }
  };

  // Share current location
  const shareLocation = () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const locationUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      navigator.clipboard.writeText(locationUrl).then(() => {
        speak("Location link copied to clipboard.");
      });
    } else {
      speak("No current location available to share.");
    }
  };

  // Get current location once
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationName = await getLocationName(latitude, longitude);
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            name: locationName,
            timestamp: new Date(),
          });
          setOriginCoords({ lat: latitude, lng: longitude });
          setOriginName(locationName || "Your Location");
          speak(`Current location is ${locationName}`);
        },
        (error) => {
          console.error("Location error:", error);
          speak("Unable to get current location.");
        }
      );
    }
  };

  // Toggle map layer
  const toggleMapLayer = (layer) => {
    setMapLayer(layer);
    const layerNames = {
      streets: "Street view",
      satellite: "Satellite view",
      terrain: "Terrain view",
    };
    speak(`${layerNames[layer]} activated.`);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

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
          📍 Location Navigator
        </h2>

        <div
          className="location-inputs"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", width: "20vw", minWidth: "180px" }}>
            <input
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onBlur={(e) => {
                e.target.style.borderColor = "transparent";
                setTimeout(() => setShowSuggestions(false), 300);
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#43e97b";
                if (query.length >= 2) setShowSuggestions(true);
              }}
              placeholder="Enter location, college, hospital..."
              style={{
                fontSize: "1.2vw",
                padding: "0.8vw 1.2vw",
                borderRadius: "10px",
                border: "2px solid transparent",
                outline: "none",
                background: "rgba(255,255,255,0.85)",
                color: "#222",
                width: "100%",
                transition: "all 0.3s ease",
              }}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="suggestions-dropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.95)",
                  border: "2px solid #43e97b",
                  borderRadius: "10px",
                  marginTop: "5px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestion(suggestion);
                    }}
                    style={{
                      padding: "12px",
                      borderBottom: idx < suggestions.length - 1 ? "1px solid #43e97b" : "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.9vw",
                      transition: "all 0.2s ease",
                      background: "rgba(0,0,0,0.5)",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "rgba(67, 233, 123, 0.2)")}
                    onMouseLeave={(e) => (e.target.style.background = "rgba(0,0,0,0.5)")}
                  >
                    <div style={{ fontWeight: "600", color: "#43e97b" }}>📍 {suggestion.display_name || suggestion.name}</div>
                    <div style={{ fontSize: "0.8vw", color: "#999", marginTop: "4px" }}>
                      {suggestion.display_name && suggestion.display_name.length > 60
                        ? `${suggestion.display_name.slice(0, 60)}...`
                        : suggestion.display_name || suggestion.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleLocation(query)}
            disabled={loading}
            style={{
              padding: "0.8vw 1.2vw",
              background: loading ? "rgba(67, 233, 123, 0.5)" : "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#222",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {loading ? "🔍 Searching..." : "🔎 Search"}
          </button>

          {/* Updated Voice Button */}
          <VoiceButton
            onResult={handleLocation}
            onStartListening={() => setDirections("🎤 Listening…")}
            onStopListening={() => setDirections("")}
            style={{
              fontSize: "1.5vw",
              padding: "0.7vw 1.2vw",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              color: "#222",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>

        {(routeLoading || destinationName) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            {routeLoading && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "rgba(67, 233, 123, 0.18)",
                  border: "1px solid #43e97b",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "0.95vw",
                  backdropFilter: "blur(6px)",
                }}
              >
                🔄 Plotting your route...
              </div>
            )}
            {destinationName && (
              <div
                style={{
                  padding: "10px 16px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(67, 233, 123, 0.35)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "0.95vw",
                }}
              >
                <strong>From:</strong> {originName} <br />
                <strong>To:</strong> {destinationName}
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestions */}
        {recentSearches.length > 0 && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "10px",
              border: "1px solid #38f9d7",
            }}
          >
            <p style={{ margin: "0 0 10px 0", color: "#38f9d7", fontSize: "0.9vw" }}>
              ⏱️ Recent Searches:
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocation(search)}
                  style={{
                    padding: "0.4vw 0.8vw",
                    background: "rgba(67, 233, 123, 0.2)",
                    border: "1px solid #43e97b",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.85vw",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "rgba(67, 233, 123, 0.4)")}
                  onMouseLeave={(e) => (e.target.style.background = "rgba(67, 233, 123, 0.2)")}
                >
                  🔍 {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Controls with Better Feedback */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <button
            onClick={getCurrentLocation}
            title="Get your current GPS location"
            style={{
              padding: "0.6vw 1.1vw",
              background: "linear-gradient(90deg, #ff6b6b 0%, #ee5a52 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9vw",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            📍 My Location
          </button>

          <button
            onClick={() => {
              if (currentLocation) {
                setOriginCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
                setOriginName(currentLocation.name || "Your Location");
                speak("Current location is set as the route origin.");
              } else {
                getCurrentLocation();
              }
            }}
            title="Use your current position as the route origin"
            style={{
              padding: "0.6vw 1.1vw",
              background: currentLocation
                ? "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
                : "rgba(255,255,255,0.12)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9vw",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {currentLocation ? "🏁 Set Origin" : "⌛ Set Origin"}
          </button>

          <button
            onClick={isTracking ? stopGPSTracking : startGPSTracking}
            title={isTracking ? "Stop tracking your location" : "Enable GPS tracking"}
            style={{
              padding: "0.6vw 1.1vw",
              background: isTracking
                ? "linear-gradient(90deg, #ff4757 0%, #ff3838 100%)"
                : "linear-gradient(90deg, #3742fa 0%, #2f3542 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9vw",
              animation: isTracking ? "pulse 2s infinite" : "none",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {isTracking ? "⏹️ Stop Track" : "📡 GPS Track"}
          </button>

          <button
            onClick={shareLocation}
            disabled={!currentLocation}
            title="Copy your location link to clipboard"
            style={{
              padding: "0.6vw 1.1vw",
              background: currentLocation
                ? "linear-gradient(90deg, #ffa726 0%, #fb8c00 100%)"
                : "#666",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: currentLocation ? "pointer" : "not-allowed",
              fontSize: "0.9vw",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => currentLocation && (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            📤 Share
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            title="Toggle map display options"
            style={{
              padding: "0.6vw 1.1vw",
              background: "linear-gradient(90deg, #9c88ff 0%, #8c7ae6 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9vw",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            {showControls ? "✕ Hide" : "⚙️"} Map
          </button>

          <button
            onClick={scrollToRouteInfo}
            disabled={!routeInfo}
            title={routeInfo ? "View detailed route summary" : "Search for a location first"}
            style={{
              padding: "0.6vw 1.1vw",
              background: routeInfo
                ? "linear-gradient(90deg, #ffa726 0%, #fb8c00 100%)"
                : "#666",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "600",
              cursor: routeInfo ? "pointer" : "not-allowed",
              fontSize: "0.9vw",
              transition: "all 0.3s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => routeInfo && (e.target.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            📊 Route Summary
          </button>
        </div>

        {/* Map Layer Controls */}
        {showControls && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "12px",
              border: "1px solid #43e97b",
            }}
          >
            <h4 style={{ color: "#fff", margin: "0 0 10px 0", fontSize: "1.1vw" }}>
              Map Layers
            </h4>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {[
                { key: "streets", label: "🗺️ Streets", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
                { key: "satellite", label: "🛰️ Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
                { key: "terrain", label: "🏔️ Terrain", url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
              ].map((layer) => (
                <button
                  key={layer.key}
                  onClick={() => toggleMapLayer(layer.key)}
                  style={{
                    padding: "0.4vw 0.8vw",
                    background: mapLayer === layer.key ? "#43e97b" : "rgba(255,255,255,0.1)",
                    border: `1px solid ${mapLayer === layer.key ? "#43e97b" : "#666"}`,
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "0.8vw",
                  }}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Location Name */}
        {currentLocation && currentLocation.name && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "rgba(67, 233, 123, 0.15)",
              borderRadius: "10px",
              border: "1px solid #43e97b",
              color: "#fff",
              fontSize: "1vw",
              textAlign: "center",
            }}
          >
            <strong>📍 Current Location:</strong> {currentLocation.name}
          </div>
        )}

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

      {destination && !originCoords && (
        <div
          style={{
            width: "80vw",
            marginTop: "20px",
            padding: "20px",
            background: "rgba(255,193,7,0.1)",
            border: "2px solid #ffc107",
            borderRadius: "16px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#ffc107", marginBottom: "10px" }}>📍 Origin Required</h3>
          <p>Please set your starting location by clicking "Set Origin" or allowing location access to see the route.</p>
          <button
            onClick={getCurrentLocation}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "linear-gradient(90deg, #ffc107 0%, #ff8c00 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#222",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Get My Location
          </button>
        </div>
      )}

      {destination && originCoords && (
        <div
          className="map-wrapper"
          style={{
            width: "80vw",
            height: "70vh",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
            position: "relative",
          }}
        >
          {routeLoading && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 1200,
                padding: "12px 16px",
                background: "rgba(0,0,0,0.75)",
                borderRadius: "14px",
                color: "#fff",
                fontSize: "0.95vw",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              }}
            >
              🔄 Plotting route...
            </div>
          )}
          <MapContainer
            center={[destination.lat, destination.lng]}
            zoom={14}
            zoomControl={false}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            boxZoom={true}
            keyboard={true}
            dragging={true}
            touchZoom={true}
            tap={true}
            inertia={true}
            inertiaDeceleration={3500}
            bounceAtZoomLimits={true}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url={
                mapLayer === "satellite"
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : mapLayer === "terrain"
                  ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={
                mapLayer === "satellite"
                  ? "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  : "&copy; OpenStreetMap contributors"
              }
            />
            <Routing
              origin={originCoords}
              destination={destination}
              onRouteFound={handleRouteFound}
              onRouteError={handleRouteError}
            />
            <ZoomToDestination destination={destination} />
            <CurrentLocationMarker currentLocation={currentLocation} isTracking={isTracking} />
            <ZoomControls />
            <Marker position={[destination.lat, destination.lng]} icon={locationIcon} />
          </MapContainer>
        </div>
      )}

      {/* Route Information Panel - Enhanced */}
      {routeInfo && (
        <div
          ref={routeInfoRef}
          style={{
            width: "80vw",
            marginTop: "20px",
            padding: "25px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "16px",
            border: "2px solid #43e97b",
            color: "#fff",
            animation: "slideDown 0.5s ease-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#43e97b", fontSize: "1.4vw" }}>
              🛣️ Route Summary
            </h3>
            <button
              onClick={() => {
                if (destination) {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
                  window.open(url, "_blank");
                }
              }}
              style={{
                padding: "0.7vw 1vw",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid #43e97b",
                borderRadius: "12px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9vw",
              }}
            >
              🌐 Open in Maps
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div style={{
              background: "rgba(67, 233, 123, 0.12)",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(67, 233, 123, 0.35)",
              color: "#fff"
            }}>
              <div style={{ fontSize: "0.8vw", color: "#43e97b", marginBottom: "6px" }}>📍 From</div>
              <div style={{ fontSize: "1vw", fontWeight: "700" }}>{originName || "Your Location"}</div>
            </div>
            <div style={{
              background: "rgba(56, 249, 215, 0.12)",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(56, 249, 215, 0.35)",
              color: "#fff"
            }}>
              <div style={{ fontSize: "0.8vw", color: "#38f9d7", marginBottom: "6px" }}>📍 To</div>
              <div style={{ fontSize: "1vw", fontWeight: "700" }}>{destinationName || query || "Destination"}</div>
            </div>
          </div>

          {/* Route Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #43e97b",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "0.8vw", color: "#43e97b" }}>📏 Distance</div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", marginTop: "8px" }}>{routeInfo.distance}</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, rgba(56, 249, 215, 0.2) 0%, rgba(67, 233, 123, 0.2) 100%)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #38f9d7",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "0.8vw", color: "#38f9d7" }}>⏱️ Duration</div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", marginTop: "8px" }}>{routeInfo.duration}</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%)",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #ffc107",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "0.8vw", color: "#ffc107" }}>🛣️ Routes</div>
              <div style={{ fontSize: "1.4vw", fontWeight: "bold", marginTop: "8px" }}>{(routeInfo.alternatives?.length || 0) + 1}</div>
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#38f9d7", fontSize: "1.1vw" }}>📋 Turn-by-Turn Directions:</h4>
            <ol
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                background: "rgba(0,0,0,0.3)",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #43e97b",
                listStylePosition: "inside",
                margin: 0,
              }}
            >
              {routeInfo.instructions.map((step, idx) => (
                <li
                  key={idx}
                  onClick={() => speak(step.text)}
                  style={{
                    marginBottom: "10px",
                    fontSize: "0.9vw",
                    padding: "10px",
                    background: "rgba(67, 233, 123, 0.1)",
                    borderLeft: "3px solid #43e97b",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    listStyleType: "decimal",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(67, 233, 123, 0.18)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(67, 233, 123, 0.1)")}
                >
                  <strong style={{ color: "#38f9d7" }}>Step {step.step}:</strong> {step.text}<br/>
                  <small style={{ color: "#999" }}>📏 {step.distance}</small>
                </li>
              ))}
            </ol>
          </div>

          {routeInfo.alternatives && routeInfo.alternatives.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#ffc107", fontSize: "1.1vw" }}>🔀 Alternative Routes:</h4>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {routeInfo.alternatives.map((alt, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: "rgba(255, 193, 7, 0.1)",
                      border: "1px solid #ffc107",
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "0.85vw"
                    }}
                  >
                    <strong>Route {alt.index}:</strong> {alt.distance} • {alt.duration}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
            }
            50% { 
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .current-location-marker {
            animation: pulse 2s infinite;
          }

          .location-card {
            animation: slideDown 0.6s ease-out;
          }

          .leaflet-routing-container {
            background: rgba(0,0,0,0.8) !important;
            color: #fff !important;
          }

          .leaflet-routing-container .leaflet-routing-alt {
            background: rgba(67, 233, 123, 0.1) !important;
            border: 1px solid #43e97b !important;
          }

          /* Map scroll and touch properties */
          .map-wrapper {
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }

          .map-wrapper .leaflet-container {
            cursor: grab;
            -webkit-touch-callout: none;
          }

          .map-wrapper .leaflet-container:active {
            cursor: grabbing;
          }

          .leaflet-pane {
            z-index: auto !important;
          }

          /* Suggestions dropdown styling */
          .suggestions-dropdown {
            animation: slideDown 0.3s ease-out;
          }

          .suggestions-dropdown::-webkit-scrollbar {
            width: 6px;
          }

          .suggestions-dropdown::-webkit-scrollbar-track {
            background: rgba(67, 233, 123, 0.1);
            border-radius: 10px;
          }

          .suggestions-dropdown::-webkit-scrollbar-thumb {
            background: #43e97b;
            border-radius: 10px;
          }

          .suggestions-dropdown::-webkit-scrollbar-thumb:hover {
            background: #38f9d7;
          }

          input:focus {
            box-shadow: 0 0 15px rgba(67, 233, 123, 0.5) !important;
          }

          button:active {
            transform: scale(0.95) !important;
          }

          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: #43e97b;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #38f9d7;
          }

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
            .location-card button {
              font-size: 1.5vw !important;
              padding: 0.8vw 1.5vw !important;
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
            button {
              font-size: 2.5vw !important;
              padding: 1.2vw 2vw !important;
            }
            .map-wrapper {
              width: 95vw !important;
              height: 50vh !important;
            }
            .directions-text {
              font-size: 2.5vw !important;
              margin-top: 12px !important;
            }
          }
        `}
      </style>
      <TurnBackButton />
    </div>
  );
}
