const ActivityLog = require("../models/ActivityLog");

// Create a new activity log
exports.createActivityLog = async (req, res) => {
  try {
    const { adminId, adminName, action, targetType, targetId, details } =
      req.body;

    const newActivityLog = new ActivityLog({
      adminId,
      adminName,
      action,
      targetType,
      targetId,
      details,
    });

    await newActivityLog.save();

    res.status(201).json({
      success: true,
      data: newActivityLog,
    });
  } catch (error) {
    console.error("Error creating activity log:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// Get recent activity logs
exports.getRecentActivityLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const activityLogs = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activityLogs.length,
      data: activityLogs,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
