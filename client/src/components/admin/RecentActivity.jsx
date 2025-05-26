import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecentActivity.css";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("/api/activity-logs/recent");
        setActivities(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        setError("Failed to load recent activities");
        setLoading(false);
      }
    };

    fetchActivities();

    // Poll for new activities every 30 seconds
    const interval = setInterval(fetchActivities, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (action) => {
    switch (action) {
      case "edit":
        return "✏️";
      case "approve":
        return "✅";
      case "delete":
        return "🗑️";
      case "warn":
        return "⚠️";
      default:
        return "📝";
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="recent-activity-loading">
        Loading recent activities...
      </div>
    );
  }

  if (error) {
    return <div className="recent-activity-error">{error}</div>;
  }

  return (
    <div className="recent-activity-container">
      <h3 className="recent-activity-title">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="no-activity">No recent activity found</p>
      ) : (
        <ul className="activity-list">
          {activities.map((activity) => (
            <li
              key={activity._id}
              className={`activity-item activity-${activity.action}`}
            >
              <div className="activity-icon">
                {getActionIcon(activity.action)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="admin-name">{activity.adminName}</span>
                  <span className="activity-time">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                </div>
                <p className="activity-details">
                  {activity.action === "edit" &&
                    `Edited a ${activity.targetType}`}
                  {activity.action === "approve" &&
                    `Approved a ${activity.targetType}`}
                  {activity.action === "delete" &&
                    `Deleted a ${activity.targetType}`}
                  {activity.action === "warn" &&
                    `Issued a warning for a ${activity.targetType}`}
                  {activity.details && `: ${activity.details}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
