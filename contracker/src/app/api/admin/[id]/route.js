import { NextResponse } from "next/server";
import AdminRequest from "@/Models/AdminRequest";
import { dbConnect } from "@/lib/dbConnect";
import Government from "@/Models/Government";

export async function POST(req, context) {
  await dbConnect();

  try {
    const params = await context.params;
    const { id } = params;
    const { ownerId } = await req.json();
    console.log("id:", id);

    console.log("owner:", ownerId);

    const adminRequest = await AdminRequest.findById(id);
    console.log("admin req:", adminRequest);
    if (!adminRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const user = await Government.findById(adminRequest.userId);
    console.log("user:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.verifiedBy = ownerId;
    user.isVerified = true;
    await user.save();

    adminRequest.isVerified = true;
    await adminRequest.save();

    return NextResponse.json(
      { message: "Admin request approved", data: adminRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving admin request:", error);
    return NextResponse.json(
      { error: "Error approving admin request" },
      { status: 500 }
    );
  }
}
