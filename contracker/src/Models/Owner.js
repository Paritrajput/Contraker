import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  postion: String,
  email: { type: String, unique: true },
  isSuperOwner: Boolean,
  password: String,
  secretCode: { type: String, unique: true },
});

export default mongoose.models.Owner || mongoose.model("Owner", OwnerSchema);
