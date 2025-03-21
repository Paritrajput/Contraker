"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import IssueManagementABI from "@/contracts/IssueManagement.json";
import axios from "axios";

const issueManagementAddress = "0x7739dF3d308e20774001bC3A9FB4589A65Cc0245";

export default function IssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [issues2, setIssues2] = useState([]);



  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get("/api/public-issue");

        console.log(response.data);
        setIssues2(response.data.issues);
      } catch (error) {
        console.log(error);
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
      const contract = new ethers.Contract(issueManagementAddress, IssueManagementABI.abi, signer);
      console.log("Connected to contract:", contract);
      fetchIssues(contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setLoading(false);
    }
  };

  const fetchIssues = async (contractInstance) => {
    try {
      console.log("Fetching issues...");
      const issuesData = await contractInstance.getAllIssues();
      console.log("Blockchain Data:", issuesData);

      if (!issuesData || issuesData.length === 0) {
        console.log("No issues found");
        setLoading(false);
        return;
      }

      const [ids, names, descriptions, approvals, latitudes, longitudes] = issuesData;

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

      console.log("Formatted Issues:", formattedIssues);
      setIssues(formattedIssues);
    } catch (error) {
      console.error("Error fetching issues from blockchain:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Reported Issues</h1>
      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-900 p-5 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
          ))
        ) : issues2.length > 0 ? (
          issues2.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-700 transition transform hover:scale-105 hover:border-teal-400"
            >
              <h2 className="text-xl font-semibold text-teal-300">{item.issue_type}</h2>
              <p className="text-gray-300 mt-2">{item.description}</p>
              <button
                onClick={() =>
                  router.push(`/issue-details?issue=${encodeURIComponent(JSON.stringify(item))}`)
                }
                className="mt-4 bg-teal-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-teal-400 transition"
              >
                🔍 View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No issues found.</p>
        )}
      </div>
    </div>
  );
}
