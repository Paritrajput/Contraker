const mongoose = require("mongoose");

const userIssueSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  issueId: { type: String, required: true },
  voted: { type: String, required: true },
});

export default mongoose.models.UserIssue ||
  mongoose.model("UserIssue", userIssueSchema);
