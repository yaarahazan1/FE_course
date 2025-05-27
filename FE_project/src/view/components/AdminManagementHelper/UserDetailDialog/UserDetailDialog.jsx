import React from "react";
import { BookOpen, Calendar, ClipboardList } from "lucide-react";
import "./UserDetailDialog.css";

const UserDetailDialog = ({ user, isOpen, onOpenChange }) => {
  if (!user || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div className="user-dialog-overlay" onClick={handleBackdropClick}>
      <div className="user-dialog-content">
        <div className="user-dialog-header">
          <h2 className="user-dialog-title">פרטי משתמש</h2>
          <p className="user-dialog-description">מידע מפורט על המשתמש</p>
        </div>
        
        <div className="user-dialog-body">
          <div className="user-details-container">
            <div className="user-details-left">
              <div className="user-info-section">
                <h3 className="user-section-title">
                  <BookOpen className="user-section-icon" />
                  פרטים אישיים
                </h3>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-label">שם:</div>
                    <div className="user-info-value">{user.name}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">אימייל:</div>
                    <div className="user-info-value">{user.email}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">סטטוס:</div>
                    <div className="user-info-value">
                      <span className={`user-status-badge ${user.status === "פעיל" ? "active" : "inactive"}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="user-info-section">
                <h3 className="user-section-title">
                  <Calendar className="user-section-icon" />
                  פרטי לימודים
                </h3>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-label">תחום לימוד:</div>
                    <div className="user-info-value">{user.studyField}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">מוסד לימודים:</div>
                    <div className="user-info-value">{user.institution}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-info-section user-activities-section">
              <h3 className="user-section-title">
                <ClipboardList className="user-section-icon" />
                פעולות אחרונות
              </h3>
              <div className="user-activities-list">
                {user.recentActivities && user.recentActivities.map((activity) => (
                  <div key={activity.id} className="user-activity-item">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-details">
                      <span className="activity-text">{activity.details}</span>
                      <span className="activity-date">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="user-dialog-footer">
          <button 
            className="user-dialog-close-btn"
            onClick={() => onOpenChange(false)}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailDialog;