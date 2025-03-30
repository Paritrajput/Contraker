"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function OwnerDashboard() {
  const { id } = useParams(); // Get ownerId from URL
  const [adminRequest, setAdminRequest] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  console.log(id)

  useEffect(() => {
    if (id) {
      fetchAdminRequest();
    }
  }, [id]);

  // Fetch admin request for this owner
  const fetchAdminRequest = async () => {
    try {
      const res = await axios.get(`/api/admin?userId=${id}`);
      if (res.data.request) {
        setAdminRequest(res.data.request);
        if (res.data.request.approved) {
          fetchAdminDetails(res.data.request.adminId);
        }
      }
    } catch (error) {
      console.error("Error fetching admin request", error);
    }
  };

  // Fetch admin details if request is approved
  const fetchAdminDetails = async (adminId) => {
    try {
      const res = await axios.get(`/api/admins/${adminId}`);
      setAdminDetails(res.data);
    } catch (error) {
      console.error("Error fetching admin details", error);
    }
  };

  // Send approval request
  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin", { ...formData, userId:id });
      setAdminRequest(res.data); // Update state with the newly created request
      alert("Approval request sent successfully!");
    } catch (error) {
      console.error("Error sending request", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Admin Approval</h1>

      {adminRequest ? (
        adminRequest.approved ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Admin Details</h2>
            {adminDetails ? (
              <div>
                <p className="font-semibold">Name: {adminDetails.name}</p>
                <p className="text-gray-400">Email: {adminDetails.email}</p>
              </div>
            ) : (
              <p className="text-gray-400">Fetching admin details...</p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Approval Request Sent
            </h2>
            <p className="text-gray-400">Your request is pending approval.</p>
          </div>
        )
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Request Admin Approval</h2>
          <form onSubmit={handleSendRequest} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-teal-500 px-4 py-2 rounded-md w-full hover:bg-teal-600"
            >
              Send Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
