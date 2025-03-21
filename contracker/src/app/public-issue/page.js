"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DraggableMarker = ({ position, setPosition, setSearchQuery }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng, setSearchQuery);
    },
  });

  const reverseGeocode = async (lat, lon, setSearchQuery) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data.display_name) {
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  return (
    <Marker
      position={position}
      icon={customIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
          reverseGeocode(newPos.lat, newPos.lng, setSearchQuery);
        },
      }}
    />
  );
};

const PeopleIssue = () => {
  const [issueName, setIssueName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateOfComplaint] = useState(new Date().toISOString().split("T")[0]);
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.209 });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [publicId, setPublicId] = useState("");
  const [issueImg, setIssueImg] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("public-token");
    if (token) {
      axios.get("/api/public-sec/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setPublicId(res.data._id))
        .catch(() => localStorage.removeItem("public-token"));
    }
  }, []);

  const searchLocation = async (query) => {
    if (!query || query.length < 2) {
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

  const MapCenter = ({ position }) => {
    const map = useMap();
    map.setView(position, 13);
    return null;
  };

  const handleSelectLocation = (lat, lon) => {
    setPosition({ lat, lng: lon });
    setSuggestions([]);
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 13);
    }
  };

  const handleCaptureImage = (event) => {
    const file = event.target.files[0];
    setIssueImg(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", publicId);
      formData.append("issue_type", issueName);
      formData.append("description", description);
      formData.append("date_of_complaint", dateOfComplaint);
      formData.append("placename", searchQuery);
      formData.append("location", JSON.stringify(position)); // Convert to JSON string

      formData.append("approval", 0);
      formData.append("denial", 0);
      formData.append("status", "Pending");
      if (issueImg) {
        formData.append("image", issueImg);
      }
      const response = await axios.post("/api/public-issue", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response:", response.data);

      console.log(response);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="flex flex-row-reverse justify-between items-center p-6 pt-0 bg-black min-h-screen text-white">
      <div className="w-[50vw]">
     
        <div className="border-2 border-solid rounded-2xl">
          {/* Search Bar */}

          {/* Map */}
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "557px", width: "100%", zIndex:"3" }}
            className="border-2 border-solid rounded-2xl"
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Store map reference
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenter position={position} />
            <DraggableMarker position={position} setPosition={setPosition} setSearchQuery={setSearchQuery}  />
          </MapContainer>
        </div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-teal-400">
          Raise an Issue
        </h2>

        {/* {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <p className="text-sm text-green-400 mb-4">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        )} */}

        <label className="block text-lg font-medium">Issue Name</label>
        <input
          type="text"
          value={issueName}
          onChange={(e) => setIssueName(e.target.value)}
          className="w-full p-2 border border-gray-600 bg-gray-800 rounded mt-1 text-white placeholder-gray-400"
          placeholder="Enter issue name"
        />

        <label className="block text-lg font-medium mt-4">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-600 bg-gray-800 rounded mt-1 text-white placeholder-gray-400"
          placeholder="Enter description"
        />
        <label className="block text-lg font-medium mt-1">Location</label>
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchLocation(e.target.value);
          }}
          className="w-full p-2 border border-gray-600 bg-gray-800 rounded mt-1 text-white placeholder-gray-400"
        />

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <ul
            style={{
              color: "#ededed",
              listStyle: "none",
              padding: 0,
              maxHeight: "150px",
              overflowY: "auto",
              background: "#101828",
              border: "1px solid #ccc",
              position: "absolute",
              width: "40%",
              zIndex: 1000,
            }}
          >
            {suggestions.map((place) => (
              <li
                key={place.place_id}
                onClick={() => {
                  handleSelectLocation(place.lat, place.lon);
                  setSearchQuery(place.display_name);
                }}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  color: "white",
                }}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}

        <label className="block text-lg font-medium mt-4">
          Capture Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCaptureImage}
          className="mt-2 bg-gray-800 p-2 rounded cursor-pointer text-white"
        />

        {image && (
          <div className="mt-4 flex justify-center">
            <Image
              src={image}
              alt="Captured"
              width={400}
              height={200}
              className="rounded-lg border border-gray-600"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`mt-6 w-full px-4 py-2 rounded-lg transition font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-400"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </div>
    </div>
  );
};

export default PeopleIssue;
