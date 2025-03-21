import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Contractor from "@/Models/Contractor"; 
import {dbConnect} from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();
  const { name, email, password, companyName } = await req.json();

  const existingUser = await Contractor.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newContractor = new Contractor({ name, email, password: hashedPassword, companyName });
  await newContractor.save();

  return NextResponse.json({ success: true, message: "Signup successful" });
}
