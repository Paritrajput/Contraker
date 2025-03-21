import { dbConnect } from "@/lib/dbConnect";
import UserIssue from "@/Models/UserIssue";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const issueId = searchParams.get("issueId");

    const userIssue = await UserIssue.findOne({ userId, issueId });

    return NextResponse.json({ voted: userIssue ? userIssue.voted : null }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vote status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
