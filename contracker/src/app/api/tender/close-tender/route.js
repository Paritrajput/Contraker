import { dbConnect } from "@/lib/dbConnect";
import Tender from "@/Models/Tender";
import TenderContract from "@/contracts/TenderCreation.json";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

  try {
    const body = await req.json();
    console.log("Received Body:", body);

    // const { tenderId } = body;

    await dbConnect();

    const tender = await Tender.findById(body);

    tender.active = false;
    tender.status = "Closed";
    await tender.save();
    return NextResponse.json(
      { message: "Tender Closed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Closing tender:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
