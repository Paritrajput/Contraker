"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Dynamically import the MapContainer and necessary components to prevent SSR errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false });
const useMapEvents = dynamic(() => import("react-leaflet").then((mod) => mod.useMapEvents), { ssr: false });

let L;
useEffect(() => {
  if (typeof window !== "undefined") {
    L = require("leaflet");
  }
}, []);

// Draggable Marker component
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

  return L ? (
    <Marker
      position={position}
      icon={new L.Icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
          reverseGeocode(newPos.lat, newPos.lng, setSearchQuery);
        },
      }}
    />
  ) : null;
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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("public-token");
      if (token) {
        axios
          .get("/api/public-sec/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setPublicId(res.data._id))
          .catch(() => localStorage.removeItem("public-token"));
      }
    }
  }, []);

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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", publicId);
      formData.append("issue_type", issueName);
      formData.append("description", description);
      formData.append("date_of_complaint", dateOfComplaint);
      formData.append("placename", searchQuery);
      formData.append("location", JSON.stringify(position));
      formData.append("approval", 0);
      formData.append("denial", 0);
      formData.append("status", "Pending");

      if (issueImg) {
        formData.append("image", issueImg);
      }

      await axios.post("/api/public-issue", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-teal-400">Raise an Issue</h2>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker position={position} setPosition={setPosition} setSearchQuery={setSearchQuery} />
      </MapContainer>
      <button
        onClick={handleSubmit}
        className={`mt-6 px-4 py-2 rounded-lg transition font-semibold ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-400"}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Issue"}
      </button>
    </div>
  );
};

export default PeopleIssue;
