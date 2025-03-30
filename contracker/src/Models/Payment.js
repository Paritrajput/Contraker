const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  contractorId: String,
  contractorWallet: String,
  contractId: String,
  bidAmount: Number,
  amountUsed: Number,
  reason: String,
  paymentMade: Number,
  status: String,
});

export default mongoose.models.Payments ||
  mongoose.model("Payments", paymentSchema);
