"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contractorId, setContractorId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/contractor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setContractorId(res.data._id);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setError("Failed to fetch contractor profile");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("Unauthorized: No token found");
    }
  }, []);

  useEffect(() => {
    if (!contractorId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/contracts/${contractorId}`);
        setContracts(response.data.contracts); 
        console.log(response.data.contracts)
      } catch (error) {
        console.error("Could not get contracts", error);
        setError("Could not get contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractorId]);

  if (loading) {
    return <p className="text-lg text-center mt-6 text-gray-400">Loading...</p>;
  }

  if (error) {
    return <p className="text-lg text-center mt-6 text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Your Contracts</h1>
      <div className="w-full max-w-3xl">
        {contracts.length === 0 ? (
          <p className="text-gray-500 justify-self-center">No contracts found</p>
        ) : (
          contracts.map((item) => (
            <CardComponent
              key={item.contractId} 
              title={`Contract ID: ${item.mongoContractId
              }`}
              content={`Bid Amount: ${item.contractAmount} ETH`}
              status={`Status: ${item.isCompleted? "Completed":"Pending"}`}
              onClick={() =>
                router.push(
                  `/contractor-sec/contract-desc?contract=${encodeURIComponent(
                    JSON.stringify(item)
                  )}`
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardComponent({ title, content, status, onClick }) {
  return (
    <div
      className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-800 border border-gray-700"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-green-400 font-medium">{content}</p>
      <p className="text-green-400 font-medium">{status}</p>
    </div>
  );
}
