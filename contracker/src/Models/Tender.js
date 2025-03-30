const mongoose = require("mongoose");

const tenderSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  minBidAmount: Number,
  maxBidAmount: Number,
  bidOpeningDate: Date,
  bidClosingDate: Date,
  location: String,
  winnerId: String,
  status: {
    type: String,
    enum: ["Active", "Completed", "Closed"],
    default: "Pending",
  },
  active: Boolean,
  blockchainTenderId: String,
  transactionHash: String,
  issueDetails: Object,
  creator: Object,
});

export default mongoose.models.tender || mongoose.model("tender", tenderSchema);
