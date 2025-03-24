import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Issue from "@/Models/Issue";

// PUT: Update issue votes
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id, vote } = params; 
    console.log(id, vote)
    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }

    const isUpvote = vote === "true"; 
    issue.approvals += isUpvote ? 1 : -1;
    await issue.save();

    return NextResponse.json({ message: "Vote updated", issue }, { status: 200 });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
