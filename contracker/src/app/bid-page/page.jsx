"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BidForm = () => {
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposalDocument, setProposalDocument] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const blockchainTenderId = searchParams.get("tenderId");
  const tenderId=searchParams.get('mongoId')

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
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/bidding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockchainTenderId,
          tenderId,
          contractorId,
          bidAmount,
          proposalDocument,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Bid placed successfully!");
      } else {
        alert(`Error placing bid: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-[82vh] items-center">
      <div className="p-4 bg-gray-900 text-white rounded-lg w-[40%]">
        <h2 className="text-lg font-bold">Place a Bid</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mt-2">Bid Amount</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
            placeholder="Enter bid amount"
            required
          />

          <label className="block mt-2">Proposal Document</label>
          <input
            type="text"
            value={proposalDocument}
            onChange={(e) => setProposalDocument(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
            placeholder="Enter proposal document link"
            required
          />

          <button
            type="submit"
            className="mt-3 p-2 bg-teal-600 rounded w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BidForm;
