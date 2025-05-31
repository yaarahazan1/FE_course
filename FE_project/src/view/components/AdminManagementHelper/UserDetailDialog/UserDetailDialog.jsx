import React from "react";
import { BookOpen, Calendar, ClipboardList, User, Mail, Shield } from "lucide-react";
import "./UserDetailDialog.css";

const UserDetailDialog = ({ user, isOpen, onOpenChange }) => {
  if (!user || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  // פורמט תאריך לתצוגה - מותאם ל-Firebase Timestamp
  const formatDate = (date) => {
    if (!date) return "לא זמין";
    
    // אם זה Firestore timestamp
    if (date?.toDate) {
      return date.toDate().toLocaleDateString('he-IL');
    }
    
    // אם זה Date object
    if (date instanceof Date) {
      return date.toLocaleDateString('he-IL');
    }
    
    // אם זה timestamp number (milliseconds)
    if (typeof date === 'number') {
      return new Date(date).toLocaleDateString('he-IL');
    }
    
    // אם זה string, ננסה להמיר לתאריך
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('he-IL');
      }
      return date;
    }
    
    return "לא זמין";
  };

  // פורמט זמן מלא - מותאם ל-Firebase Timestamp
  const formatDateTime = (date) => {
    if (!date) return "לא זמין";
    
    // אם זה Firestore timestamp
    if (date?.toDate) {
      return date.toDate().toLocaleString('he-IL');
    }
    
    // אם זה Date object
    if (date instanceof Date) {
      return date.toLocaleString('he-IL');
    }
    
    // אם זה timestamp number (milliseconds)
    if (typeof date === 'number') {
      return new Date(date).toLocaleString('he-IL');
    }
    
    // אם זה string, ננסה להמיר לתאריך
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleString('he-IL');
      }
      return date;
    }
    
    return "לא זמין";
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
                  <User className="user-section-icon" />
                  פרטים אישיים
                </h3>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-label">שם:</div>
                    <div className="user-info-value">{user.name || user.displayName || "לא זמין"}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">אימייל:</div>
                    <div className="user-info-value">{user.email || "לא זמין"}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">סטטוס:</div>
                    <div className="user-info-value">
                      <span className={`user-status-badge ${
                        user.status === "פעיל" ? "active" : 
                        user.status === "קפוא" ? "frozen" : "inactive"
                      }`}>
                        {user.status || "פעיל"}
                      </span>
                    </div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">תאריך הצטרפות:</div>
                    <div className="user-info-value">{formatDate(user.createdAt || user.joinDate)}</div>
                  </div>
                  {user.updatedAt && (
                    <div className="user-info-row">
                      <div className="user-info-label">עדכון אחרון:</div>
                      <div className="user-info-value">{formatDateTime(user.updatedAt)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="user-info-section">
                <h3 className="user-section-title">
                  <BookOpen className="user-section-icon" />
                  פרטי לימודים
                </h3>
                <div className="user-info-grid">
                  <div className="user-info-row">
                    <div className="user-info-label">תחום לימוד:</div>
                    <div className="user-info-value">{user.studyField || user.major || "לא צוין"}</div>
                  </div>
                  <div className="user-info-row">
                    <div className="user-info-label">מוסד לימודים:</div>
                    <div className="user-info-value">{user.institution || user.university || "לא צוין"}</div>
                  </div>
                  {user.year && (
                    <div className="user-info-row">
                      <div className="user-info-label">שנת לימוד:</div>
                      <div className="user-info-value">{user.year}</div>
                    </div>
                  )}
                  {user.degree && (
                    <div className="user-info-row">
                      <div className="user-info-label">תואר:</div>
                      <div className="user-info-value">{user.degree}</div>
                    </div>
                  )}
                </div>
              </div>

              {user.isAdmin && (
                <div className="user-info-section">
                  <h3 className="user-section-title">
                    <Shield className="user-section-icon" />
                    הרשאות מיוחדות
                  </h3>
                  <div className="user-info-grid">
                    <div className="user-info-row">
                      <div className="user-info-label">רמת הרשאה:</div>
                      <div className="user-info-value">
                        <span className="admin-badge">מנהל מערכת</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="user-info-section user-activities-section">
              <h3 className="user-section-title">
                <ClipboardList className="user-section-icon" />
                סטטיסטיקות ופעילות
              </h3>
              
              <div className="user-stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{user.summariesCount || 0}</div>
                  <div className="stat-label">סיכומים שהועלו</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{user.commentsCount || 0}</div>
                  <div className="stat-label">תגובות</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{user.likesReceived || 0}</div>
                  <div className="stat-label">לייקים שהתקבלו</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{formatDate(user.lastLogin || user.lastActivity)}</div>
                  <div className="stat-label">כניסה אחרונה</div>
                </div>
              </div>

              {user.recentActivities && user.recentActivities.length > 0 && (
                <>
                  <h4 className="activities-subtitle">פעילות אחרונה</h4>
                  <div className="user-activities-list">
                    {user.recentActivities.map((activity, index) => (
                      <div key={activity.id || index} className="user-activity-item">
                        <div className="activity-action">{activity.action}</div>
                        <div className="activity-details">
                          <span className="activity-text">{activity.details}</span>
                          <span className="activity-date">{formatDate(activity.date || activity.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {(!user.recentActivities || user.recentActivities.length === 0) && (
                <div className="no-activities">
                  <p>אין פעילות אחרונה לתצוגה</p>
                </div>
              )}

              {user.preferences && (
                <>
                  <h4 className="activities-subtitle">העדפות משתמש</h4>
                  <div className="user-preferences">
                    {user.preferences.notifications !== undefined && (
                      <div className="preference-item">
                        <span className="preference-label">התראות:</span>
                        <span className="preference-value">
                          {user.preferences.notifications ? "מופעל" : "מבוטל"}
                        </span>
                      </div>
                    )}
                    {user.preferences.theme && (
                      <div className="preference-item">
                        <span className="preference-label">ערכת נושא:</span>
                        <span className="preference-value">{user.preferences.theme}</span>
                      </div>
                    )}
                    {user.preferences.language && (
                      <div className="preference-item">
                        <span className="preference-label">שפה:</span>
                        <span className="preference-value">{user.preferences.language}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
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