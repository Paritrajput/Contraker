import { NextResponse } from "next/server";

import Contractor from "@/Models/Contractor";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { contractorId } = await req.json();

  const contractor = await Contractor.findById(contractorId);
  console.log(contractor);
  if (!contractor) {
    return NextResponse.json(
      { error: "Contractor not found" },
      { status: 401 }
    );
  }

  return NextResponse.json(contractor,{ status: 200 } );
}
