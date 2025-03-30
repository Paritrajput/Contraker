import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Issue from "@/Models/Issue";

export async function PUT(req) {
  try {
    await dbConnect();

    const data = await req.json();

    const { issueId, vote } = data;
    console.log(issueId, vote);
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }
    console.log(issue);
    const isUpvote = vote === true;
    if (isUpvote) {
      issue.approval += 1;
    } else {
      issue.denial += 1;
    }

    await issue.save();

    return NextResponse.json(
      { message: "Vote updated", issue },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
