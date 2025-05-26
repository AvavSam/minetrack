import axios from "axios";

/**
 * Log an admin activity
 * @param {string} adminId - ID of the admin performing the action
 * @param {string} adminName - Name of the admin
 * @param {string} action - Type of action (edit, approve, delete, warn)
 * @param {string} targetType - Type of target (user, post, comment, etc.)
 * @param {string} targetId - ID of the target
 * @param {string} details - Additional details about the action
 * @returns {Promise<boolean>} - Success status
 */
export const logActivity = async (
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
