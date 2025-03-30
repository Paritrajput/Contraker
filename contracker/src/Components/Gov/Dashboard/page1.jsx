"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Page1({ ownerId }) {
  const [adminRequests, setAdminRequests] = useState([]);

  const fetchAdminRequests = async () => {
    try {
      const res = await axios.get(`/api/admin`);
      console.log(res.data.data);
      setAdminRequests(res.data.data);
    } catch (error) {
      console.error("Error fetching admin requests", error);
    }
  };
  useEffect(() => {
    fetchAdminRequests();
  }, []);

  // const approveRequest = async (id) => {
  //   try {
  //     await axios.post(`/api/admin-approve/${id}`);
  //     setAdminRequests(adminRequests.filter((req) => req._id !== id));
  //     alert("Admin request approved!");
  //   } catch (error) {
  //     console.error("Error approving admin request", error);
  //   }
  // };
  const approveRequest = async (id) => {
    try {
      const response=await axios.post(`/api/admin/${id}`, { ownerId });
      console.log(response)
      setAdminRequests(adminRequests.filter((req) => req._id !== id));
      alert("Admin request approved!");
    } catch (error) {
      console.error("Error approving admin", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl text-teal-400 font-bold mb-4">
        Pending Admin Requests
      </h2>
      {adminRequests.length === 0 ? (
        <p className="text-gray-400">No pending requests</p>
      ) : (
        <ul className="space-y-3">
          {adminRequests.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between bg-gray-700 p-3 rounded-md"
            >
              <div>
                <p className="font-semibold">{admin.name}</p>
                <p className="text-sm text-gray-400">{admin.email}</p>
              </div>
              <button
                onClick={() => approveRequest(admin._id)}
                className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
