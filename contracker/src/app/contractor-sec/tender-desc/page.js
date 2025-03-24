"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const TenderDesc = () => {
  const searchParams = useSearchParams();
  const tenderParam = searchParams.get("tender");
  const router = useRouter();

  if (!tenderParam) {
    return <div>Error: No tender data found</div>;
  }

  const tenderData = JSON.parse(decodeURIComponent(tenderParam));

  return (
    <div className="flex flex-col p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">
        {tenderData.category}
      </h1>

      <div className="w-full max-w-lg mx-auto">
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">Tender Id:</p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.blockchainTenderId}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Tender Title:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.title}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Tender Description:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.description}
          </pre>
        </div>

        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Tender Category:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.category}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Minimum Bid Amount:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.minBidAmount}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Maximum Bid Amount:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.maxBidAmount}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Last Date For Bidding :
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.bidClosingDate}
          </pre>
        </div>
        <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold text-gray-300 capitalize">
            Work Location:
          </p>

          <pre className="text-teal-400 whitespace-pre-wrap">
            {tenderData.location}
          </pre>
        </div>
      </div>

      <button
        onClick={() =>
          router.push(
            `/contractor-sec/bid-page?tenderId=${encodeURIComponent(
              tenderData.blockchainTenderId
            )}&mongoId=${encodeURIComponent(tenderData._id)}`
          )
        }
        className="mt-6 px-6 py-3 bg-teal-500 text-black font-semibold rounded-lg text-lg shadow-md hover:bg-teal-400 transition duration-300 mx-auto"
      >
        Make Bid
      </button>
    </div>
  );
};

export default TenderDesc;
