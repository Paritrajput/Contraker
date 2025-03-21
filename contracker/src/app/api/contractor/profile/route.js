import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Contractor from "@/Models/Contractor";
import {dbConnect} from "@/lib/dbConnect";

export async function GET(req) {
  await dbConnect();
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Contractor.findById(decoded.id).select("name email");
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
export async function POST() {
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}