import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Government from "@/Models/Government";
import { dbConnect } from "@/lib/dbConnect";
import Owner from "@/Models/Owner";

export async function POST(req) {
  await dbConnect();
  
  try {
    const { email, password } = await req.json();

    let user = await Owner.findOne({ email });
    let isOwner = true;
    let isSuperOwner = false;

    if (!user) {
      user = await Government.findOne({ email });
      isOwner = false;
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (isOwner) {
      isSuperOwner = user.isSuperOwner || false;
    }

    const token = jwt.sign(
      { id: user._id, owner: isOwner, superOwner: isSuperOwner },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
