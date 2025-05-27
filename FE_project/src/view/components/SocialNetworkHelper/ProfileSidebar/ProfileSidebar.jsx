import React from "react";
import "./ProfileSidebar.css";

const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <div className="profile-header">
        <div className="profile-avatar">שכ</div>
        <div className="profile-name">שירה כהן</div>
        <div className="profile-major">מדעי המחשב</div>
        <div className="profile-badge">סטודנטית שנה ג׳</div>
      </div>
      <ul className="profile-menu">
        <li><span className="icon">👤</span> פרופיל</li>
        <li><span className="icon">👥</span> חברים</li>
        <li><span className="icon">💬</span> הודעות</li>
        <li><span className="icon">🔔</span> התראות</li>
        <li><span className="icon">📚</span> קבוצות לימוד</li>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
