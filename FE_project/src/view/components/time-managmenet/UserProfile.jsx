import React from "react";
import "./UserProfile.css";

const UserProfile = () => {
  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-container">
          <div className="profile-avatar">
            <span className="profile-label">פרופיל</span>
          </div>
          <span className="profile-name">יעל כהן</span>
          <span className="profile-dept">מדעי ההתנהגות</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;