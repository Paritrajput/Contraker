import { dbConnect } from "@/lib/dbConnect";
import Issue from "@/Models/Issue";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);

    const newIssue = new Issue(body);
    await newIssue.save();

    return NextResponse.json(
      { message: "Issue created successfully", issue: newIssue },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const issues = await Issue.find();
    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
