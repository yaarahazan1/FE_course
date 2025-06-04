import React from "react";
import "./ProfileSidebar.css";

const ProfileSidebar = ({ user, studyGroups = [] }) => {
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'משתמש';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="profile-sidebar">
      {/* פרופיל המשתמש */}
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">
              {getUserInitials()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h3 className="profile-name">{getUserDisplayName()}</h3>
          <p className="profile-email">{user?.email}</p>
        </div>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-number">{studyGroups.length}</span>
            <span className="profile-stat-label">קבוצות לימוד</span>
          </div>
        </div>
      </div>

      {/* קבוצות הלימוד שלי */}
      <div className="study-groups-section">
        <h4 className="section-title">קבוצות הלימוד שלי</h4>
        
        {studyGroups.length > 0 ? (
          <div className="study-groups-list">
            {studyGroups.map(group => (
              <div key={group.id} className="study-group-card">
                <div className="study-group-header">
                  <h5 className="study-group-title">{group.title}</h5>
                  <span className="study-group-course">{group.course}</span>
                </div>
                
                <div className="study-group-info">
                  <div className="study-group-members">
                    <svg className="study-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{group.members?.length || 1} חברים</span>
                  </div>
                  
                  {group.nextMeeting && (
                    <div className="study-group-meeting">
                      <svg className="study-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{new Date(group.nextMeeting).toLocaleDateString('he-IL')}</span>
                    </div>
                  )}
                </div>
                
                <div className="study-group-status">
                  <span className={`status-badge status-${group.status || 'active'}`}>
                    {group.status === 'active' ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p>אתה עדיין לא חבר בקבוצות לימוד</p>
            <small>צור קבוצת לימוד חדשה או הצטרף לקיימת</small>
          </div>
        )}
      </div>

      {/* הישגים מהירים */}
      <div className="achievements-section">
        <h4 className="section-title">הישגים</h4>
        
        <div className="achievements-grid">
          <div className="achievement-badge">
            <div className="achievement-icon">📚</div>
            <div className="achievement-info">
              <span className="achievement-title">חבר פעיל</span>
              <span className="achievement-desc">משתתף בקבוצות לימוד</span>
            </div>
          </div>
          
          <div className="achievement-badge">
            <div className="achievement-icon">🤝</div>
            <div className="achievement-info">
              <span className="achievement-title">עוזר לאחרים</span>
              <span className="achievement-desc">תגובות מועילות</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;