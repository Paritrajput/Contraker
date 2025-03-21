import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Public from "@/Models/Public"; 
import {dbConnect} from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const existingUser = await Public.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newContractor = new Public({ name, email, password: hashedPassword });
  await newContractor.save();

  return NextResponse.json({ success: true, message: "Signup successful" });
}
