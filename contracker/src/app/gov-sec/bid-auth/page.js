"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BidAuth = () => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const tenderId = searchParams.get("tenderId");

  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        
        const response = await axios.get(`/api/bidding?tenderId=${tenderId}`);
        setBids(response.data);
        console.log(response.data);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Could not get bids", error);
        setError("Could not get bids");
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveBid = async () => {
    if (!selectedBidder) {
      alert("Please select a bidder to approve");
      return;
    }

    setIsLoading(true);

    try {
      console.log("selected bidder",selectedBidder)
      const data = {
        blockchainBidId: selectedBidder.blockchainBidId,
        bidId: selectedBidder._id,
        bidAmount: selectedBidder.bidAmount,
        tenderId: selectedBidder.tenderId,
        contractorId: selectedBidder.contractorId,
      };

      const response = await fetch("/api/bid-approve", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("Response:", response);
        alert("Bid approved successfully!");
      } else {
        console.log("error fetching data", response.error);
      }
    } catch (error) {
      alert("Failed to approve bid");
      console.error("Error approving bid:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Bid Approval
      </h1>
      {isLoadingData ? (
        <div className="text-black justify-self-center"> Loading Data Please Wait ....</div>
      ) : (
        <div>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className={`p-4 bg-white rounded-lg shadow-md cursor-pointer border-2 ${
                  selectedBidder?._id === bid._id
                    ? "border-green-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedBidder(bid)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {bid.name}
                </h2>
                <h2 className="text-lg font-semibold text-gray-800">
                  {bid.contractorId}
                </h2>
                <p className="text-md text-green-600">
                  Bid Amount: ₹{bid.bidAmount}
                </p>
              </div>
            ))}
          </div>
          {bids.length > 0 ? (
            <button
              onClick={handleApproveBid}
              disabled={isLoading}
              className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {isLoading ? "Approving..." : "Approve Bid"}
            </button>
          ) : (
            <div className="mt-6 w-full text-black flex justify-center py-2 rounded-lg disabled:opacity-50">
              No Bids for this tender
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidAuth;
