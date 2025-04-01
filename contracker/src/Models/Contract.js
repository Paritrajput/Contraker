import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Completed", "Rejected"],
    default: "Pending",
  },
  approvalVotes: { type: Number, default: 0 },
  rejectionVotes: { type: Number, default: 0 },
});

const ContractSchema = new mongoose.Schema({
  contractId: String,
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: "Tender" },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor" },
  bidAmount: Number,
  paidAmount: Number,
  createdAt: { type: Date, default: Date.now },
  blockchainContractId: String,
  transactionHash: String,
  milestones: [MilestoneSchema],
});

export default mongoose.models.Contract || mongoose.model("Contract", ContractSchema);
