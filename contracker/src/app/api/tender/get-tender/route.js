import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import TenderContract from "@/contracts/TenderCreation.json"; // ABI of Tender contract

export async function GET() {
  try {
    await dbConnect();

    // Fetch active tenders from MongoDB
    const tenders = await Tender.find({ active: true });

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

    // Fetch blockchain data for each tender
    const tendersWithBlockchainData = await Promise.all(
      tenders.map(async (tender) => {
        try {
          console.log(Number(tender.blockchainTenderId));
          const tenderData = await contract.getTender(
            Number(tender.blockchainTenderId)
          );

          return {
            ...tender._doc,
            blockchainData: {
              tenderId: tenderData[0].toString(), // Convert BigInt to string
              title: tenderData[1],
              description: tenderData[2],
              category: tenderData[3],
              minBidAmount: Number(ethers.formatUnits(tenderData[4], "ether")), // Convert to number
              maxBidAmount: Number(ethers.formatUnits(tenderData[5], "ether")), // Convert to number
              bidOpeningDate: new Date(
                Number(tenderData[6]) * 1000
              ).toLocaleDateString(), // Convert timestamp
              bidClosingDate: new Date(
                Number(tenderData[7]) * 1000
              ).toLocaleDateString(),
              location: tenderData[8],
              createdByMongoId: tenderData[9],
              creatorBlockchainId: tenderData[10],
              isActive: tenderData[11],
            },
          };
        } catch (error) {
          console.error(
            `Error fetching blockchain data for tender ${tender.tenderId}:`,
            error
          );
          return { ...tender._doc, blockchainData: null }; // If error, return null for blockchain data
        }
      })
    );

    return NextResponse.json(tendersWithBlockchainData, { status: 200 });
  } catch (error) {
    console.error("Error fetching tenders:", error);
    return NextResponse.json(
      { error: "Error fetching tenders" },
      { status: 500 }
    );
  }
}
