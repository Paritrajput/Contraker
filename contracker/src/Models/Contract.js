import mongoose from "mongoose";
import Payment from "./Payment";

const ContractSchema = new mongoose.Schema({
  contractId: { type: String, required: true, unique: true },
  tenderId: { type: String, required: true },
  winner: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paidAmount: Number,
  availableFund:Number,
  isCompleted: Boolean,
  blockchainContractId: { type: String },
  transactionHash: { type: String },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
