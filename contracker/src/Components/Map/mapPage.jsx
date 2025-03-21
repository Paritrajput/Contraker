import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Draggable Marker Component
const DraggableMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng); // Place marker on map click
    },
  });

  return (
    <Marker
      position={position}
      icon={customIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng()); // Update position after dragging
        },
      }}
    />
  );
};

const MapComponent = () => {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 }); // Default: New Delhi
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Function to search locations using Nominatim API
  const searchLocation = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Function to handle location selection
  const handleSelectLocation = (lat, lon) => {
    setPosition({ lat, lng: lon });
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search location..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          searchLocation(e.target.value);
        }}
        style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
      />

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            maxHeight: "150px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            position: "absolute",
            width: "100%",
            zIndex: 1000,
          }}
        >
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelectLocation(place.lat, place.lon)}
              style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #ddd" , color:"black" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Map */}
      <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
