const axios = require("axios");

const logActivity = async (
  adminId,
  adminName,
  action,
  targetType,
  targetId,
  details
) => {
  try {
    await axios.post("/api/activity-logs", {
      adminId,
      adminName,
      action,
      targetType,
      targetId,
      details,
    });
    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
};

module.exports = {
  logActivity,
};
