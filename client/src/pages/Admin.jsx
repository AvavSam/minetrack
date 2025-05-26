import React from "react";
import RecentActivity from "../components/admin/RecentActivity";

const Admin = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-content-row">
        <div className="admin-main-content">{/* ...existing code... */}</div>

        <div className="admin-sidebar">
          <RecentActivity />
          {/* ...existing code... */}
        </div>
      </div>

      {/* ...existing code... */}
    </div>
  );
};

export default Admin;
