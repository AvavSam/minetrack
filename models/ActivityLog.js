const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["edit", "approve", "delete", "warn"],
    required: true,
  },
  targetType: {
    type: String,
    required: true, // e.g., 'user', 'post', 'comment'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
