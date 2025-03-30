import Payment from "@/Models/Payment";
import Contract from "@/Models/Contract"; // Ensure Contract model is created
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { paymentId } = params;
    const { action } = await request.json();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    if (action === "Approve") {
      payment.status = "Approve";
      await payment.save();

      await Contract.findByIdAndUpdate(payment.contractId, {
        $push: { payments: paymentId },
      });

      return NextResponse.json(
        { message: "Payment approved successfully", payment },
        { status: 200 }
      );
    } else if (action === "Deny") {
      // Deny the payment by deleting it
      await Payment.findByIdAndDelete(paymentId);

      return NextResponse.json(
        { message: "Payment denied successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'approve' or 'deny'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { paymentId } = params;

//     // Find the payment
//     const payment = await Payment.findById(paymentId);
//     if (!payment) {
//       return NextResponse.json(
//         { message: "Payment not found" },
//         { status: 404 }
//       );
//     }

//     // Update payment status to true
//     payment.status = true;
//     await payment.save();

//     // Add paymentId to the related contract
//     await Contract.findByIdAndUpdate(payment.contractId, {
//       $push: { payments: paymentId },
//     });

//     return NextResponse.json(
//       { message: "Payment approved successfully", payment },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error approving payment:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
