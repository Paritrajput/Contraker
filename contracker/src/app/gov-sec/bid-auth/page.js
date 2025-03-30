"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BidAuth = () => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const tenderData = searchParams.get("tender");
  const tender = JSON.parse(tenderData);
  const [tenders, setTenders] = useState(tender);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const response = await axios.get(`/api/bidding?tenderId=${tender._id}`);
        setBids(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Could not get bids", error);
        setError("Could not get bids");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // const handleApproveBid = async () => {
  //   if (!selectedBidder) {
  //     alert("Please select a bidder to approve");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     console.log("selected bidder", selectedBidder);
  //     const data = {
  //       blockchainBidId: selectedBidder.blockchainBidId,
  //       bidId: selectedBidder._id,
  //       bidAmount: selectedBidder.bidAmount,
  //       tenderId: selectedBidder.tenderId,
  //       contractorId: selectedBidder.contractorId,
  //     };

  //     const response = await fetch("/api/bid-approve", {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //     });
  //     if (response.ok) {
  //       console.log("Response:", response);
  //       alert("Bid approved successfully!");
  //     } else {
  //       console.log("Error approving bid", response.error);
  //     }
  //   } catch (error) {
  //     alert("Failed to approve bid");
  //     console.error("Error approving bid:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const closeTender = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/tender/close-tender", {
        method: "POST",
        body: JSON.stringify(tenders._id),
      });
      if (response.ok) {
        router.push("/gov-sec");
        console.log("Response:", response);
        alert("Tender closed successfully!");
      } else {
        console.log("Error approving bid", response.error);
      }
    } catch (error) {
      alert("Failed to approve bid");
      console.error("Error approving bid:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {tenders.status === "Active" ? (
        <div className="my-5  text-teal-500 py-2 text-2xl font-semibold justify-self-center">
          Bidding Process Ongoing
        </div>
      ) : tenders.status === "Completed" ? (
        <div className="my-5  text-teal-500 py-2 text-2xl font-semibold justify-self-center">
          Bidding Completed
        </div>
      ) : null}
      <h1 className="text-2xl font-bold text-center text-teal-400 mb-6">
        Submitted Bid
      </h1>
      {isLoadingData ? (
        <div className="text-gray-300 text-center"> Loading Data... </div>
      ) : (
        <div>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className={`p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer border-2 transition duration-200 ${
                  selectedBidder?._id === bid._id
                    ? "border-teal-500"
                    : "border-gray-700"
                } hover:border-teal-400`}
                onClick={() => setSelectedBidder(bid)}
              >
                <h2 className="text-lg font-semibold text-white">{bid.name}</h2>
                <h2 className="text-md text-gray-400">{bid.contractorId}</h2>
                <p className="text-md text-teal-300">
                  Bid Amount: ₹{bid.bidAmount}
                </p>
              </div>
            ))}
          </div>
          {bids.length > 0 ? (
            tenders.status === "Completed" ? (
              <button
                onClick={closeTender}
                disabled={isLoading}
                className="mt-6 w-full bg-gray-600 text-black py-2 rounded-lg disabled:opacity-50 transition duration-200"
              >
                Close Tender
              </button>
            ) : null
          ) : (
            <div className="mt-6 text-center text-gray-400">
              No Bids for this tender
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidAuth;
