import mongoose from "mongoose";

const GovernmentSchema = new mongoose.Schema({
  name: String,
  postion: String,
  email: { type: String, unique: true },
  password: String,
  secretCode: { type: String, unique: true },
});

export default mongoose.models.Government ||
  mongoose.model("Government", GovernmentSchema);
