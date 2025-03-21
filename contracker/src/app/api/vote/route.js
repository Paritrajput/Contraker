import { dbConnect } from "@/lib/dbConnect";
import Issue from "@/Models/Issue";
import UserIssue from "@/Models/UserIssue";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { issueId, userId, voteType } = await req.json();
    console.log(issueId)

    const issue = await Issue.findOne({ _id: issueId });
    console.log(issue)
    if (!issue) return NextResponse.json({ error: "Issue not found" }, { status: 404 });

    const update = voteType === "approve" ? { approval: issue.approval + 1 } : { denial: issue.denial + 1 };
    await Issue.updateOne({ id: issueId }, update);

    await UserIssue.create({ userId, issueId, voted: voteType });

    return NextResponse.json({ message: "Vote recorded successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
