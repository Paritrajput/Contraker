"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Page2() {
  const { ownerId } = useParams(); // Get ownerId from URL
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [adminRequests, setAdminRequests] = useState([]);

  useEffect(() => {
    if (ownerId) {
      fetchAdminRequests();
    }
  }, [ownerId]);


  const fetchAdminRequests = async () => {
    try {
      const res = await axios.get(`/api/admin-requests?ownerId=${ownerId}`);
      setAdminRequests(res.data);
    } catch (error) {
      console.error("Error fetching admin requests", error);
    }
  };


  const handleAddOwner = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/owners", { ...newOwner, addedBy: ownerId });
      alert("Owner added successfully!");
      setNewOwner({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Error adding owner", error);
    }
  };

  const handleApproveAdmin = async (id) => {
    try {
      await axios.post(`/api/admin-approve/${id}`, { ownerId });
      setAdminRequests(adminRequests.filter((req) => req._id !== id));
      alert("Admin request approved!");
    } catch (error) {
      console.error("Error approving admin", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
   <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Owner</h2>
        <form onSubmit={handleAddOwner} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newOwner.name}
            onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newOwner.email}
            onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newOwner.password}
            onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            required
          />
          <button type="submit" className="bg-teal-500 px-4 py-2 rounded-md w-full hover:bg-teal-600">
            Add Owner
          </button>
        </form>
      </div>
    </div>
  );
}
