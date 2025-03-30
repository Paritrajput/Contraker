import { dbConnect } from "@/lib/dbConnect";
import Payment from "@/Models/Payment";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { contractId } = await params;
    console.log("mongoContractId:", contractId);

    const payments = await Payment.find({
      contractId: contractId,
    });
    console.log(payments);

    if (payments.length === 0) {
      return NextResponse.json(
        { message: "Payments are not available" },
        { status: 404 }
      );
    }

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
