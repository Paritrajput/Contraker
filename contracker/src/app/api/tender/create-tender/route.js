import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import TenderContract from "@/contracts/TenderCreation.json";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

  try {
    // ✅ Use req.json() to parse the request body
    const body = await req.json();
    console.log("Received Body:", body);

    const {
      title,
      description,
      category,
      minBidAmount,
      maxBidAmount,
      bidOpeningDate,
      bidClosingDate,
      location,
      issueDetails,
      creator,
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !minBidAmount ||
      !maxBidAmount ||
      !location ||
      !bidOpeningDate ||
      !bidClosingDate
    ) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Step 1: Store Tender in MongoDB
    const newTender = new Tender({
      title,
      description,
      category,
      minBidAmount,
      maxBidAmount,
      bidOpeningDate,
      bidClosingDate,
      location,
      active: true,
      issueDetails,
      creator,
    });

    const savedTender = await newTender.save();

    // Step 2: Call Smart Contract
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const wallet = new ethers.Wallet(
      process.env.NEXT_PUBLIC_PRIVATE_KEY,
      provider
    );
    const contract = new ethers.Contract(
      process.env.TENDER_CONTRACT_ADDRESS,
      TenderContract.abi,
      wallet
    );

    const tx = await contract.createTender(
      body.title,
      body.description,
      body.category,
      ethers.parseEther(body.minBidAmount),
      ethers.parseEther(body.maxBidAmount),
      Math.floor(new Date(body.bidOpeningDate).getTime() / 1000), // Convert to UNIX timestamp
      Math.floor(new Date(body.bidClosingDate).getTime() / 1000),
      body.issueDetails.placename,
      String(body.creator._id)
    );
    const receipt = await tx.wait();
    
    console.log("Transaction Receipt:", receipt);
    savedTender.transactionHash = receipt.transactionHash;

    // Step 3: Extract `tenderId` from Event Logs
    let blockchainTenderId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === "TenderCreated") { // ✅ Match the correct event
          blockchainTenderId = parsedLog.args[0].toString(); // Get tenderId from event
          break;
        }
      } catch (error) {
        continue; // Ignore logs that do not match
      }
    }

    if (!blockchainTenderId) {
      throw new Error("Tender ID not found in blockchain event logs");
    }

    // Step 4: Update MongoDB with Blockchain Details
    savedTender.blockchainTenderId = blockchainTenderId;
   
    await savedTender.save();

    return NextResponse.json(
      { message: "Tender created successfully!", tenderId: savedTender._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating tender:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
