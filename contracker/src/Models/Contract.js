import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema({
    contractId: { type: String, required: true, unique: true },
    tenderId: { type: String, required: true },
    winner: { type: String, required: true }, // Address of winning contractor
    bidAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    blockchainContractId: { type: String },
    transactionHash: { type: String },
});

export default mongoose.models.Contract || mongoose.model("Contract", ContractSchema);
