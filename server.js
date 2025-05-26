// Import activity log routes
const activityLogRoutes = require("./routes/api/activityLogs");

// Mount routes
app.use("/api/activity-logs", activityLogRoutes);
