import { ethers } from "ethers";
import Bidding from "@/contracts/Bidding.json"; // ABI of the contract
import Bid from "@/Models/Bid"; // Mongoose model for storing bid data
import { dbConnect } from "@/lib/dbConnect";
import Contractor from "@/Models/Contractor";
import { NextResponse } from "next/server";
import mongoose, { mongo } from "mongoose";

export async function POST(req) {
  await dbConnect();

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const body = await req.json(); // Await the request body
    console.log("Received body:", body);
    
    const {tenderId, blockchainTenderId, contractorId, bidAmount, proposalDocument } = body;

    // Fetch contractor data
   
    const contractorIdM = new mongoose.Types.ObjectId(contractorId);
    console.log(contractorIdM)
      const contractorData = await Contractor.findById(contractorIdM);
      if (!contractorData) {
        return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
      }

      let experienceYears = Number(contractorData.experienceYears);
      let contractorRating = Number(contractorData.contractorRating);
      if(!experienceYears || !contractorRating){
        experienceYears=0;
        contractorRating=0;
      }

      console.log("got data",contractorData)
      console.log("experiance:",experienceYears)
    
    

    // Connect to Ethereum network
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.BID_CONTRACT_ADDRESS,
      Bidding.abi,
      wallet
    );
console.log(experienceYears)
    // Submit bid to blockchain
    const tx = await contract.placeBid(
      Number(blockchainTenderId),
      contractorId,
      Number(bidAmount),
      proposalDocument,
      experienceYears,
      contractorRating
    );
    const receipt=await tx.wait(); // Wait for transaction confirmation

    console.log("Transaction Receipt:", receipt);
  

    // Step 3: Extract `tenderId` from Event Logs
    let blockchainBidId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === "BidPlaced") { 
          blockchainBidId = parsedLog.args[0].toString(); // Get bidId instead of tenderId
          break;
        }
      } catch (error) {
        continue; // Ignore logs that do not match
      }
    }

    if (!blockchainBidId) {
      throw new Error("Tender ID not found in blockchain event logs");
    }

  
    const newBid = new Bid({
      tenderId,
      contractorId,
      bidAmount,
      status: "Pending",
      proposalDocument,
      experienceYears,
      contractorRating,
      blockchainBidId,
      transactionHash: tx.hash,
    });

    await newBid.save();

    return NextResponse.json(
      { success: true, message: "Bid placed successfully", txHash: tx.hash },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tenderId = searchParams.get("tenderId")?.replace(/^"|"$/g, "").trim();


    if (!tenderId) {
      console.log("❌ No tenderId received");
      return NextResponse.json({ error: "Tender ID is required!" }, { status: 400 });
    }

    console.log("🔍 Searching for bids with tenderId:", (tenderId));

    const bids = await Bid.find({tenderId:tenderId});
    
  


    if (bids.length === 0) {
      console.log("⚠️ No bids found for tenderId:", tenderId);
    } else {
      console.log("✅ Found bids:", bids);
    }

    return NextResponse.json(bids, { status: 200 });
  } catch (error) {
    console.error("🚨 Error fetching bids:", error);
    return NextResponse.json({ error: "Error fetching bids" }, { status: 500 });
  }
}

