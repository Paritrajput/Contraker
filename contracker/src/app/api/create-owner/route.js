import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Owner from "@/Models/Owner";
import { dbConnect } from "@/lib/dbConnect";

async function createOwners() {
  await dbConnect();

  const owners = [
    {
      name: "Modi Ji",
      username: "modi",
      postion: "Chief",
      email: "modi@123",
      isSuperOwner: true,
      password: await bcrypt.hash("123", 10),
      secretCode: "SUPER123",
    },
    {
      name: "mayank",
      username: "mayank",
      postion: "Project Manager",
      email: "mayank@123",
      isSuperOwner: false,
      password: await bcrypt.hash("123", 10),
      secretCode: "OWNER123",
    },
  ];

  try {
    await Owner.deleteMany({ email: { $in: owners.map((o) => o.email) } }); // Remove existing ones
    await Owner.insertMany(owners);
    console.log("SuperOwner and Owner created successfully!");
  } catch (error) {
    console.error("Error creating owners:", error);
  } finally {
    mongoose.connection.close();
  }
}

createOwners();
