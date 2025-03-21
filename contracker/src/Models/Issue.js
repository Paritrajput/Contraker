import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Store userId as ObjectId
    ref: "Public",
    required: true,
  },
  issue_type: { type: String, required: true },
  description: { type: String, required: true },
  date_of_complaint: { type: String, required: true },
  approval: { type: Number, required: true },
  denial: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  image: { type: String, required: false },
  placename: { type: String, required: false },
  location: {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
});

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
