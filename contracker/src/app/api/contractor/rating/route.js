import { NextResponse } from "next/server";
import Contractor from "@/Models/Contractor";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { contractorId, userId, rating } = await req.json();

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  const contractor = await Contractor.findById(contractorId);
  if (!contractor) {
    return NextResponse.json(
      { error: "Contractor not found" },
      { status: 404 }
    );
  }

  //   // Check if the user has already rated
  //   const existingRating = contractor.ratings.find(
  //     (r) => r.userId.toString() === userId
  //   );
  //   if (existingRating) {
  //     existingRating.rating = rating;
  //   } else {
  contractor.contractorRating = (contractor.contractorRating + rating) / 2;
  //   }

  await contractor.save();
  return NextResponse.json({
    success: true,
    message: "Rating added successfully",
    contractor,
  });
}
