"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import IssueManagementABI from "@/contracts/IssueManagement.json";
import axios from "axios";

const issueManagementAddress = "0x7739dF3d308e20774001bC3A9FB4589A65Cc0245";

export default function IssuesList() {
  const [issues, setIssues] = useState([]);
  const [issues2, setIssues2] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get("/api/public-issue");
        setIssues2(response.data.issues);
      } catch (error) {
        console.error("Error fetching public issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, []);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        issueManagementAddress,
        IssueManagementABI.abi,
        signer
      );

      fetchIssues(contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchIssues = async (contractInstance) => {
    try {
      const issuesData = await contractInstance.getAllIssues();

      if (!issuesData || issuesData.length === 0) return;

      const [ids, names, descriptions, approvals, latitudes, longitudes] =
        issuesData;

      const formattedIssues = ids.map((id, index) => ({
        id: Number(id),
        issue_type: names[index],
        description: descriptions[index],
        approvals: Number(approvals[index]),
        location: {
          latitude: Number(latitudes[index]) / 1e6,
          longitude: Number(longitudes[index]) / 1e6,
        },
      }));

      setIssues(formattedIssues);
    } catch (error) {
      console.error("Error fetching issues from blockchain:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Reported Issues</h1>

      <div className="grid gap-6">
        {loading
          ? // Skeleton Loading Cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-700 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-700 rounded mt-4"></div>
              </div>
            ))
          : issues2.length > 0
          ? issues2.map((issue) => (
              <div
                key={issue._id}
                className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-teal-400">
                  {issue.issue_type}
                </h2>
                <p className="text-gray-300">{issue.description}</p>
                <strong className="text-teal-400">Location : </strong>{issue.placename}

                <div className="flex items-center gap-10">
                  <p className="text-gray-400">Votes: ✅ {issue.approvals}</p>
                  <h2 className="flex gap-3">
                    <h2 className="text-md font-normal text-gray-400">
                      Date Of Complaint:
                    </h2>
                    {issue.date_of_complaint}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    router.push(`/public-sec/people-voting/${issue._id}`)
                  }
                  className="mt-3 px-4 py-2 bg-teal-500 text-black font-medium rounded-lg hover:bg-teal-400 transition"
                >
                  View Details
                </button>
              </div>
            ))
          : !loading && <p className="text-gray-400 text-center">No issues found.</p>}
      </div>

      {/* Floating Add Issue Button */}
      <button
        onClick={() => router.push("/public-sec/public-issue")}
        className="fixed bottom-6 right-6 bg-green-500 text-black px-6 py-3 rounded-full text-xl font-bold shadow-xl hover:bg-green-400 transition"
      >
        +
      </button>
    </div>
  );
}
