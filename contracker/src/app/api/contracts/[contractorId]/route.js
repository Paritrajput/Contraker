import { dbConnect } from "@/lib/dbConnect";
import Contract from "@/Models/Contract";
import Tender from "@/Models/Tender";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import Bidding from "@/contracts/Bidding.json";

export async function GET(req) {
  try {
    await dbConnect();

    const contractorId = req.nextUrl.pathname.split("/").pop();
    console.log("Received contractorId (MongoDB ID):", contractorId);

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor MongoDB ID is required" },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const wallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY,
      provider
    );
    const contract = new ethers.Contract(
      process.env.BID_CONTRACT_ADDRESS,
      Bidding.abi,
      wallet
    );

    const blockchainContracts = await contract.getContractsByContractor(
      contractorId
    );
    console.log("Contracts fetched from blockchain:", blockchainContracts);

    if (!Array.isArray(blockchainContracts)) {
      return NextResponse.json(
        { error: "Invalid response from blockchain" },
        { status: 500 }
      );
    }

    const mongoContracts = await Contract.find({ winner: contractorId }).lean();
    console.log("Contracts fetched from MongoDB:", mongoContracts);

    const formattedContracts = await Promise.all(
      blockchainContracts
        .map(async (c) => {
          const matchingMongoContract = mongoContracts.find((m) => {
            return (
              String(m.winner) === String(c.contractorMongoId) &&
              Number(m.blockchainContractId) === Number(c.contractId)
            );
          });
    
          if (!matchingMongoContract) {
            console.warn(`No matching contract found for blockchain contractId: ${c.contractId}`);
            return null; // Exclude this contract from the final result
          }
    
          let tenderDetail = null;
          if (matchingMongoContract) {
            tenderDetail = await Tender.findById(
              matchingMongoContract.tenderId
            ).lean();
          }
    
          return {
            contractId: Number(c.contractId),
            tenderId: Number(c.tenderId),
            winningBidId: Number(c.winningBidId),
            contractor: c.contractor,
            contractorMongoId: c.contractorMongoId,
            contractAmount: Number(c.contractAmount),
            isCompleted: c.isCompleted,
            mongoContractId: matchingMongoContract._id,
            projectTitle: tenderDetail?.title || "Unknown Project",
            projectDescription: tenderDetail?.description || "No description available",
            workLocation: tenderDetail?.location || "N/A",
            mongoTenderId: tenderDetail?._id || "N/A",
            issue: tenderDetail?.issueDetails || "N/A",
          };
        })
    );
    
    const validContracts = formattedContracts.filter((c) => c !== null); // Remove undefined/null values
    
    return NextResponse.json({ contracts: validContracts });
    

    return NextResponse.json({ contracts: formattedContracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Error fetching contracts" },
      { status: 500 }
    );
  }
}
