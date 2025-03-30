import mongoose from "mongoose";

const AdminRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  userId: String,
  ownerId: String, // The owner who added the admin
  isVerified: { type: Boolean, default: false }, // Verification status
});

export default mongoose.models.AdminRequest ||
  mongoose.model("AdminRequest", AdminRequestSchema);
