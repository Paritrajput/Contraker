"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import axios from "axios";
import TenderCreationABI from "@/contracts/TenderCreation.json"; // Update with actual ABI path

// const tenderContractAddress = "0xYourContractAddress"; 

const MakeTender = () => {
  const searchParams = useSearchParams();
  const issueParam = searchParams.get("issue");
  const parsedIssue = issueParam
    ? JSON.parse(decodeURIComponent(issueParam))
    : null;

    console.log(parsedIssue)

  const [creator, setCreator] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  // const [formData, setFormData] = useState({
  //   referenceNumber: "",
  //   type: "",
  //   category: "",
  //   formOfContract: "",
  //   timeOfComplition: "",
  //   paymentMode: "",
  // });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    minBidAmount: "",
    maxBidAmount: "",
    bidOpeningDate: "",
    bidClosingDate: "",
    location:""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (token) {
      axios
        .get("/api/gov-sec/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCreator(res.data))
        .catch(() => localStorage.removeItem("gov-token"));
       
    }
  }, []);
   console.log(creator)


  
  const submitTender = async () => {
 

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Store in MongoDB
      const mongoResponse = await fetch("/api/tender/create-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          issueDetails: parsedIssue,
          creator,
        }),
      });

      const mongoData = await mongoResponse.json();
      if (!mongoResponse.ok)
        throw new Error(mongoData.error || "Failed to store in MongoDB");

     

      setSuccess("Tender successfully created on MongoDB and Blockchain!");
      setFormData({
        title: "",
        description: "",
        category: "",
        minBidAmount: "",
        maxBidAmount: "",
        bidOpeningDate: "",
        bidClosingDate: "",
      });
    } catch (err) {
      console.error("Error submitting tender:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!parsedIssue) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-red-500 text-lg">Error: Issue details not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-black text-white p-6 min-h-screen">
      {/* Issue Details */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-teal-400">Issue Details</h2>
        <p className="mt-2">
          <strong>Type:</strong> {parsedIssue.issue_type}
        </p>
        <p>
          <strong>Description:</strong> {parsedIssue.description}
        </p>
        <p className="mt-2">
          <strong>Location:</strong> {parsedIssue.placename}
        </p>
        {parsedIssue.image && (
          <img
            src={parsedIssue.image}
            alt="Issue"
            className="w-full h-48 object-cover mt-3 rounded-md shadow-md"
          />
        )}
        <p className="mt-2">
          <strong>Date:</strong> {parsedIssue.date_of_complaint}
        </p>
      </div>

      {/* Tender Form */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-2xl font-bold text-teal-400">
          Enter Tender Details
        </h2>

      

        <div className="grid gap-4">
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Tender Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Tender Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Tender Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          
          <label className="block font-semibold text-gray-300">
          Min Bid Amount
          </label>
          <input
            type="number"
            name="minBidAmount"
            placeholder="Min Bid Amount (ETH)"
            value={formData.minBidAmount}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Max Bid Amount
          </label>
          <input
            type="number"
            name="maxBidAmount"
            placeholder="Max Bid Amount (ETH)"
            value={formData.maxBidAmount}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Bid Opening Date
          </label>
          <input
            type="date"
            name="bidOpeningDate"
            value={formData.bidOpeningDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Bid Closing Date
          </label>
          <input
            type="date"
            name="bidClosingDate"
            value={formData.bidClosingDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>
          <div className="mt-2">
          <label className="block font-semibold text-gray-300">
            Work Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Work Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          </div>

          <button
            type="submit"
            onClick={submitTender}
            className="bg-teal-400 text-black p-2 rounded-lg font-bold"
            disabled={loading}
          >
            {loading ? "Creating Tender..." : "Submit Tender"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeTender;
