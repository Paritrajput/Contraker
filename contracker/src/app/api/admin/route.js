import { NextResponse } from "next/server";

import AdminRequest from "@/Models/AdminRequest";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, userId } = await req.json();
    console.log(name, email, userId);

    if (!name || !email || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const userIds = String(userId);
    const newRequest = new AdminRequest({ name, email, userId: userIds });
    await newRequest.save();

    return NextResponse.json(
      { message: "Approval request sent successfully", data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sending approval request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const approvalReq = await AdminRequest.find({isVerified:false});

    return NextResponse.json(
      { message: "Approval request sent successfully", data: approvalReq },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error sending approval request" },
      { status: 500 }
    );
  }
}
