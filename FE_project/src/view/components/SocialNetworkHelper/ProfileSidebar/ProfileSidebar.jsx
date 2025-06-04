import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
} from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./ProfileSidebar.css";

const ProfileSidebar = ({ user, studyGroups = [] }) => {
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    likesReceived: 0,
    eventsCreated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // ספירת פוסטים של המשתמש
      const postsQuery = query(
        collection(db, "socialPosts"),
        where("authorId", "==", user.uid)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const userPosts = postsSnapshot.docs.map(doc => doc.data());
      
      // ספירת לייקים שהמשתמש קיבל
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
      
      // ספירת תגובות של המשתמש (בכל הפוסטים)
      let commentsCount = 0;
      const allPostsSnapshot = await getDocs(collection(db, "socialPosts"));
      
      for (const postDoc of allPostsSnapshot.docs) {
        const commentsQuery = query(
          collection(db, "socialPosts", postDoc.id, "comments"),
          where("authorId", "==", user.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        commentsCount += commentsSnapshot.size;
      }

      // ספירת אירועים שהמשתמש יצר
      const eventsQuery = query(
        collection(db, "socialEvents"),
        where("createdBy", "==", user.uid)
      );
      const eventsSnapshot = await getDocs(eventsQuery);

      setUserStats({
        postsCount: userPosts.length,
        commentsCount,
        likesReceived: totalLikes,
        eventsCreated: eventsSnapshot.size
      });
      
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'משתמש';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getAchievements = () => {
    const achievements = [];
    
    // הישג פוסטים
    if (userStats.postsCount >= 5) {
      achievements.push({
        icon: "📝",
        title: "כותב פעיל",
        desc: `${userStats.postsCount} פוסטים`
      });
    } else if (userStats.postsCount >= 1) {
      achievements.push({
        icon: "✍️",
        title: "כותב מתחיל",
        desc: `${userStats.postsCount} פוסטים`
      });
    }

    // הישג תגובות
    if (userStats.commentsCount >= 10) {
      achievements.push({
        icon: "💬",
        title: "דיון פעיל",
        desc: `${userStats.commentsCount} תגובות`
      });
    } else if (userStats.commentsCount >= 3) {
      achievements.push({
        icon: "🗨️",
        title: "משתתף בדיונים",
        desc: `${userStats.commentsCount} תגובות`
      });
    }

    // הישג לייקים
    if (userStats.likesReceived >= 20) {
      achievements.push({
        icon: "⭐",
        title: "תוכן פופולרי",
        desc: `${userStats.likesReceived} לייקים`
      });
    } else if (userStats.likesReceived >= 5) {
      achievements.push({
        icon: "👍",
        title: "תוכן מוערך",
        desc: `${userStats.likesReceived} לייקים`
      });
    }

    // הישג אירועים
    if (userStats.eventsCreated >= 3) {
      achievements.push({
        icon: "🎯",
        title: "מארגן אירועים",
        desc: `${userStats.eventsCreated} אירועים`
      });
    } else if (userStats.eventsCreated >= 1) {
      achievements.push({
        icon: "📅",
        title: "יוזם אירועים",
        desc: `${userStats.eventsCreated} אירועים`
      });
    }

    // הישג קבוצות
    if (studyGroups.length >= 3) {
      achievements.push({
        icon: "🤝",
        title: "חבר פעיל",
        desc: `${studyGroups.length} קבוצות`
      });
    } else if (studyGroups.length >= 1) {
      achievements.push({
        icon: "👥",
        title: "חבר קבוצה",
        desc: `${studyGroups.length} קבוצות`
      });
    }

    return achievements.slice(0, 4); // מקסימום 4 הישגים
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
          <div className="profile-stat">
            <span className="profile-stat-number">{userStats.postsCount}</span>
            <span className="profile-stat-label">פוסטים</span>
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

      {/* הישגים חכמים */}
      <div className="achievements-section">
        <h4 className="section-title">הישגים</h4>
        
        {loading ? (
          <div className="achievements-loading">
            <div className="loading-spinner"></div>
            <p>טוען הישגים...</p>
          </div>
        ) : (
          <div className="achievements-grid">
            {getAchievements().length > 0 ? (
              getAchievements().map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <span className="achievement-title">{achievement.title}</span>
                    <span className="achievement-desc">{achievement.desc}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-achievements">
                <div className="achievement-icon">🌟</div>
                <div className="achievement-info">
                  <span className="achievement-title">התחל לפעול!</span>
                  <span className="achievement-desc">שתף פוסטים וצבור הישגים</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;