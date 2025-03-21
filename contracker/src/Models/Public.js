import mongoose from "mongoose";

const PublicSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
 
});

export default mongoose.models.Public || mongoose.model("Public", PublicSchema);
