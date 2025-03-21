import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Government from "@/Models/Government"; 
import {dbConnect} from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { name, email, password,position } = await req.json();

  const existingUser = await Government.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newContractor = new Government({ name, email, password: hashedPassword ,position});
  await newContractor.save();

  return NextResponse.json({ success: true, message: "Signup successful" });
}
