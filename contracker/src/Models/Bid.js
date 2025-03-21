import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  tenderId: { type: String, required: true },
  contractorId: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  proposalDocument: String,
  experienceYears: Number,
  contractorRating: Number,
  blockchainBidId: String,
  transactionHash: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Bid || mongoose.model("Bid", BidSchema);
