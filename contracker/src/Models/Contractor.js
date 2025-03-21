import mongoose from "mongoose";

const ContractorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  experienceYears:Number,
  contractorRating:Number,
});

export default mongoose.models.Contractor || mongoose.model("Contractor", ContractorSchema);
