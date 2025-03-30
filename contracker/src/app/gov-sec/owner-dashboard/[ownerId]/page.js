"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Page1 from "@/Components/Gov/Dashboard/page1";
import Page2 from "@/Components/Gov/Dashboard/page2";

export default function OwnerDashboard() {
  const { ownerId } = useParams(); // Get ownerId from URL
  const [owners, setOwners] = useState([]);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [adminRequests, setAdminRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("AdminRequest");

  const renderScene = () => {
    switch (activeTab) {
      case "AdminRequest":
        return <Page1 ownerId={ownerId} />;
      case "AddOwner":
        return <Page2 />;
      default:
        return <Page1 ownerId={ownerId} />;
    }
  };

  

  // Fetch admin approval requests for this owner


  // Handle new owner submission
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




  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Owner Dashboard - {ownerId}
      </h1>

      {/* Add Owner Section */}
      {/* <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
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
      </div> */}

      {/* Admin Requests Section */}
      {/* <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Admin Approval Requests</h2>
        {adminRequests.length === 0 ? (
          <p className="text-gray-400">No pending requests</p>
        ) : (
          <ul className="space-y-3">
            {adminRequests.map((admin) => (
              <li key={admin._id} className="flex justify-between bg-gray-700 p-3 rounded-md">
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                </div>
                <button
                  onClick={() => handleApproveAdmin(admin._id)}
                  className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div> */}
      <div className="flex-1 p-4 mt-16">{renderScene()}</div>
      <div className="flex  justify-around bg-gray-900 py-4 fixed bottom-0 w-full border-t border-gray-700">
        {["AdminRequest", "AddOwner"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
