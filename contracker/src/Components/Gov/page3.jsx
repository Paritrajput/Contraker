"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tender/get-tender");
        setTenders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Could not get tenders", error);
        setError("Could not get tenders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Active Tenders</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-md animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="mt-4 h-10 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenders.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-lg shadow-md transition hover:scale-105 hover:bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-teal-400">
                {item.title}
              </h2>
              <p className="text-gray-400 mt-2">Tender ID: {item._id}</p>
              <button
                onClick={() =>
                  router.push(
                    `/bid-auth?tenderId=${encodeURIComponent(
                      JSON.stringify(item._id)
                    )}`
                  )
                }
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}