import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Public from "@/Models/Public"; 
import {dbConnect} from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  const contractor = await Public.findOne({ email });
  if (!contractor) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, contractor.password);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: contractor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return NextResponse.json({ success: true, token });
}
