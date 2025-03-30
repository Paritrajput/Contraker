import { dbConnect } from "@/lib/dbConnect";
import Payments from "@/Models/Payment";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const body = await req.json();
      // const body = JSON.parse(bodyData);
      const {
        contractorId,
        contractorWallet,
        contractId,
        bidAmount,
        reason,
        paymentMade,
        status,
      } = body;
      console.log("body", body);

      const newPayment = new Payments({
        contractorId,
        contractorWallet,
        contractId,
        bidAmount,
        reason,
        paymentMade,
        status,
      });

      await newPayment.save();
      return NextResponse.json(
        { success: true, message: "Payment saved successfully!" },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Error saving payment details." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}


