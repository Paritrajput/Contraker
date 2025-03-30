import { Verified } from "lucide-react";
import mongoose from "mongoose";

const GovernmentSchema = new mongoose.Schema({
  name: String,
  postion: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: Boolean,
  verifiedBy: String,
});

export default mongoose.models.Government ||
  mongoose.model("Government", GovernmentSchema);
