"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BidForm = () => {
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposalDocument, setProposalDocument] = useState("");
  const [milestones, setMilestones] = useState([{ description: "", amount: "", dueDate: "" }]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const blockchainTenderId = searchParams.get("tenderId");
  const tenderId = searchParams.get("mongoId");

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
          milestones, // Send milestones to backend
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

  // Handle milestone input changes
  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  // Add a new milestone
  const addMilestone = () => {
    setMilestones([...milestones, { description: "", amount: "", dueDate: "" }]);
  };

  // Remove a milestone
  const removeMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  return (
    <div className="flex justify-center my-9 items-center">
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

          <div className="mt-4">
            <h3 className="text-lg font-bold">Milestones</h3>
            {milestones.map((milestone, index) => (
              <div key={index} className="mb-4 border-b pb-2">
                <label className="block mt-2">Milestone Description</label>
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
                  placeholder="Enter milestone description"
                  required
                />

                <label className="block mt-2">Milestone Amount</label>
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
                  placeholder="Enter milestone amount"
                  required
                />

                <label className="block mt-2">Milestone Due Date</label>
                <input
                  type="date"
                  value={milestone.dueDate}
                  onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-1"
                  required
                />

                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="mt-2 p-2 bg-red-600 text-white rounded"
                  >
                    Remove Milestone
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addMilestone}
              className="mt-2 p-2 bg-green-600 text-white rounded"
            >
              Add Milestone
            </button>
          </div>

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
