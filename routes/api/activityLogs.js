const express = require("express");
const router = express.Router();
const {
  createActivityLog,
  getRecentActivityLogs,
} = require("../../controllers/activityLogController");

// Routes
router.post("/", createActivityLog);
router.get("/recent", getRecentActivityLogs);

module.exports = router;
