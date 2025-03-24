import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Government from "@/Models/Government";
import { dbConnect } from "@/lib/dbConnect";
import Owner from "@/Models/Owner";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();
  try {
    const owner = await Owner.findOne({ email });
    if (!owner) {
      const contractor = await Government.findOne({ email });
      if (!contractor) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const validPassword = await bcrypt.compare(password, contractor.password);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: contractor._id, owner: false },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return NextResponse.json({ success: true, token });
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: owner._id, owner: true, superOwner: owner.isSuperOwner },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ error: "could not find user" }, {status:500});
  }
}
