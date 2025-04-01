"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import IssueManagementABI from "../contracts/IssueManagement.json";
import VotingSystemABI from "../contracts/VotingSystem.json";
import ApprovedContractABI from "../contracts/ApprovedContract.json";

const issueManagementAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const votingSystemAddress = "0xYOUR_VOTING_SYSTEM_ADDRESS";
const approvedContractAddress = "0xYOUR_APPROVED_CONTRACT_ADDRESS";

export function useContracts() {
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const issueManagementContract = new ethers.Contract(
        issueManagementAddress,
        IssueManagementABI.abi,
        signer
      );
      const votingSystemContract = new ethers.Contract(
        votingSystemAddress,
        VotingSystemABI.abi,
        signer
      );
      const approvedContract = new ethers.Contract(
        approvedContractAddress,
        ApprovedContractABI.abi,
        signer
      );

      setContracts({
        issueManagementContract,
        votingSystemContract,
        approvedContract,
      });
    }
  }, []);

  return contracts;
}
