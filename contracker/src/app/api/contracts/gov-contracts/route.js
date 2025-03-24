import { dbConnect } from "@/lib/dbConnect";
import Contract from "@/Models/Contract";
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import TenderContract from "@/contracts/TenderCreation.json"; // ABI of Tender contract
import Bidding from "@/contracts/Bidding.json"



export async function GET() {
    try {
        await dbConnect();
        
        // Fetch active tenders from MongoDB
        const contracts = await Contract.find();


            const provider = new ethers.JsonRpcProvider(
              process.env.NEXT_PUBLIC_RPC_URL
            );
            const wallet = new ethers.Wallet(
              process.env.NEXT_PUBLIC_PRIVATE_KEY,
              provider
            );
            const contract = new ethers.Contract(
              process.env.BID_CONTRACT_ADDRESS,
              TenderContract.abi,
              wallet
            );

        // Fetch blockchain data for each tender
        const contractsWithBlockchainData = await Promise.all(contracts.map(async (tender) => {
            try {
                console.log(Number(tender.blockchainTenderId))
                const tenderData = await contract.getContract(Number(tender.blockchainContractId)); 
                
                return {
                    ...tender._doc, 

                    blockchainData: {
                        bidId: tenderData[0].toString(), // Convert BigInt to string
                        tenderId: tenderData[1],
                        contractor: tenderData[2],
                        contractorMongoId: tenderData[3],
                        bidAmount: Number(tenderData[4]), 
                        proposalDocument: tenderData[5],
                        experienceYears: Number(tenderData[6]), 
                        contractorRating: Number(tenderData[7]), 
                       
                        isApproved: tenderData[8],
                    }
                };
            } catch (error) {
                console.error(`Error fetching blockchain data for tender ${tender.tenderId}:`, error);
                return { ...tender._doc, blockchainData: null }; // If error, return null for blockchain data
            }
        }));

        return NextResponse.json(contractsWithBlockchainData, { status: 200 });
    } catch (error) {
        console.error("Error fetching tenders:", error);
        return NextResponse.json({ error: "Error fetching tenders" }, { status: 500 });
    }
}
