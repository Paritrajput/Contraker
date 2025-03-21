import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import Bid from "@/Models/Bid";
import Contract from "@/Models/Contract";
import Bidding from "@/contracts/Bidding.json";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
let blockchainTenderId=""
  try {
    await dbConnect();
    const body = await req.json();
    console.log("body:", body);
    const { tenderId, bidId, blockchainBidId, bidAmount } = body;
    console.log("body:", body);

    if (!tenderId || !bidId || !blockchainBidId || !bidAmount) {
      return NextResponse.json({ error: "Tender ID and Bid ID are required!" }, { status: 400 });
    }

    // Fetch the tender
    const tender = await Tender.findOne({ _id: tenderId});
    console.log("tender:",tender);
     blockchainTenderId=tender.blockchainTenderId
    if (!tender) {
      return NextResponse.json({ error: "Tender not found or already closed!" }, { status: 404 });
    }

    // Fetch the winning bid
    const winningBid = await Bid.findOne({ _id: bidId });
    console.log("winning bid :",winningBid);
    if (!winningBid) {
      return NextResponse.json({ error: "Winning bid not found!" }, { status: 404 });
    }


    winningBid.status = "Accepted";
    await winningBid.save();

  
    await Bid.updateMany(
      { tenderId, _id: { $ne: bidId } }, 
      { $set: { status: "Rejected" } }
    );


    // tender.active = false;
    // await tender.save();

  
    const newContract = new Contract({
      contractId: `CON-${Date.now()}`,
      tenderId,
      winner: winningBid.contractorId,
      bidAmount: winningBid.bidAmount,
      createdAt: new Date(),
      blockchainContractId: null, 
    });

    const savedContract = await newContract.save();

   
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.BID_CONTRACT_ADDRESS, Bidding.abi, wallet);

    // if (!ethers.isAddress(winningBid.contractorId)) {
    //   return NextResponse.json({ error: "Invalid contractor address!" }, { status: 400 });
    // }
    
console.log(Number(blockchainTenderId))
console.log( Number(blockchainBidId))
    const tx = await contract.approveBid(Number(blockchainTenderId), Number(blockchainBidId));
   

    const receipt = await tx.wait();

   
    const event = receipt.logs.find((log) => log.address === contract.target);
    const parsedLog = contract.interface.parseLog(event);
    const blockchainContractId = parsedLog.args[0];

 
    savedContract.blockchainContractId = blockchainContractId;
    savedContract.transactionHash = receipt.hash;
    await savedContract.save();

    return NextResponse.json(
      {
        message: "Bid approved successfully, contract created!",
        // contractId: savedContract._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving bid:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
