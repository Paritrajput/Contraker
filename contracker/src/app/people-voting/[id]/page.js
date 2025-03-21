"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ethers } from "ethers";
import IssueManagementABI from "@/contracts/IssueManagement.json";
import axios from "axios";

const issueManagementAddress = "0x7739dF3d308e20774001bC3A9FB4589A65Cc0245";

const PeopleVote = () => {
  const router = useRouter();
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [issue2, setIssue2] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const getIssue = async () => {
      try {
        const response = await axios.get(`/api/public-issue/${id}`);
        setIssue2(response.data);
        console.log(response.data);
      } catch {
        console.log("failed to fetch issue");
      }
    };
    getIssue();
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
      setWalletAddress(await signer.getAddress());

      const contract = new ethers.Contract(
        issueManagementAddress,
        IssueManagementABI.abi,
        signer
      );
      fetchIssue(contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const fetchIssue = async (contract) => {
    try {
      const issueData = await contract.getIssueById(Number(id));
      console.log("Issue Data:", issueData);
      console.log(Number(issueData[0]));

      setIssue({
        id: Number(issueData[0]),
        issue_type: issueData[1],
        description: issueData[2],
        imageUrl: issueData.imageUrl,
      });
    } catch (error) {
      console.error("Error fetching issue:", error);
    }
  };

  const handleVote = async (issueId, voteType) => {
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

      // Ensure issueId is a valid number
      issueId = Number(issueId);

      if (isNaN(issueId)) {
        console.error("Invalid issue ID format");
        alert("Invalid issue ID format");
        return;
      }

      // Check if issue exists before voting
      const issueData = await contract.getIssueById(issueId);
      if (!issueData || issueData[0] == 0) {
        console.error("Issue does not exist");
        alert("Issue not found. Please select a valid issue.");
        return;
      }

      const voteValue = voteType === "approve" ? true : false; // true = approve, false = deny
      console.log(voteValue);
      const tx = await contract.voteOnIssue(issueId - 1, voteType);
      await tx.wait(); // Wait for transaction confirmation

      console.log("Vote submitted successfully!");
      setIsVoting(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert(error.reason || "Error submitting your vote. Please try again.");
    }
  };

  if (!issue2)
    return <p className="text-center text-white">Loading issue details...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-6">
      <div className="bg-gray-900 shadow-lg border border-gray-700 rounded-lg p-6 w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold text-teal-400">
          {issue2.issue_type}
        </h2>
        <p className="text-gray-300 mt-2">{issue2.description}</p>
        {issue2.image && <img src={issue2.image} alt="Issue Image" />}

        {!isVoting ? (
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => handleVote(issue2.id, "approve")}
              className="px-4 py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition shadow-lg"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleVote(issue2.id, "deny")}
              className="px-4 py-2 bg-red-500 text-black font-semibold rounded-md hover:bg-red-400 transition shadow-lg"
            >
              ❌ Deny
            </button>
          </div>
        ) : (
          <button className="mt-6 px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-md cursor-not-allowed shadow-lg w-full">
            Voting in progress...
          </button>
        )}
      </div>
    </div>
  );
};

export default PeopleVote;
