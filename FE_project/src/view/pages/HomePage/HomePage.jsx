import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import "./HomePage.css";
import AdminBadge from "../AdminBadge/AdminBadge";
import "../../../styles/styles.css";

const HomePage = () => {
  const [user, loading] = useAuthState(auth);
  const [userStats, setUserStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalSummaries: 0,
    totalStudyHours: 0,
    recentActivity: []
  });
  const [setIsLoadingStats] = useState(false);

  // Log user visit to homepage
  const logPageVisit = async () => {
    if (!user) return;

    try {
      const visitRef = doc(db, 'pageVisits', `${user.uid}_${Date.now()}`);
      await setDoc(visitRef, {
        userId: user.uid,
        page: 'homepage',
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error("Error logging page visit:", error);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    if (!user) return;

    setIsLoadingStats(true);
    try {
      // Fetch tasks
      const tasksRef = collection(db, 'tasks');
      const tasksQuery = query(tasksRef, where('userId', '==', user.uid));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      let totalTasks = 0;
      let completedTasks = 0;
      
      tasksSnapshot.forEach((doc) => {
        const task = doc.data();
        totalTasks++;
        if (task.status === 'completed') {
          completedTasks++;
        }
      });

      // Fetch summaries
      const summariesRef = collection(db, 'summaries');
      const summariesQuery = query(summariesRef, where('userId', '==', user.uid));
      const summariesSnapshot = await getDocs(summariesQuery);
      const totalSummaries = summariesSnapshot.size;

      // Fetch study time
      const studyTimeRef = collection(db, 'studyTime');
      const studyTimeQuery = query(studyTimeRef, where('userId', '==', user.uid));
      const studyTimeSnapshot = await getDocs(studyTimeQuery);
      
      let totalStudyHours = 0;
      studyTimeSnapshot.forEach((doc) => {
        const data = doc.data();
        totalStudyHours += data.hours || 0;
      });

      // Fetch recent activity
      const activitiesRef = collection(db, 'activities');
      const activitiesQuery = query(
        activitiesRef, 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(3)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      
      const recentActivity = [];
      activitiesSnapshot.forEach((doc) => {
        const data = doc.data();
        recentActivity.push({
          id: doc.id,
          type: data.activityType,
          details: data.details,
          date: data.timestamp?.toDate().toLocaleDateString('he-IL') || ''
        });
      });

      setUserStats({
        totalTasks,
        completedTasks,
        totalSummaries,
        totalStudyHours,
        recentActivity
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Log card click
  const logCardClick = async (cardTitle) => {
    if (!user) return;

    try {
      const activityRef = doc(db, 'activities', `${user.uid}_${Date.now()}`);
      await setDoc(activityRef, {
        userId: user.uid,
        activityType: 'navigation',
        details: `Clicked on ${cardTitle} card`,
        timestamp: new Date(),
        section: 'homepage'
      });
    } catch (error) {
      console.error("Error logging card click:", error);
    }
  };

  // Fetch stats when user is available
  useEffect(() => {
    if (user && !loading) {
      fetchUserStats();
      logPageVisit();
    }
  }, [user, loading]);

  // Enhanced navigation cards with logging
  const navigationCards = [
    { 
      title: "ניהול לוח זמנים", 
      desc: "סדר את לוח הזמנים שלך עם כל מה שמרכיב את היום שלך וצור את לוח הזמנים החכם", 
      to: "/TimeManagement",
      requiresAuth: true
    },
    { 
      title: "ספריית סיכומים", 
      desc: "גישה מהירה לספריית הסיכומים שלך, למידה משותפת וסיכומים מאורגנים", 
      to: "/SummaryLibrary",
      requiresAuth: false
    },
    { 
      title: "ניהול משימות ופרויקטים", 
      desc: "עקוב אחרי משימות, הבנת מה יש לסיים ופרויקטים עם צ'אט קבוצתי והתראות", 
      to: "/CourseManagement",
      requiresAuth: true
    },
    { 
      title: "כלי לכתיבה אקדמית", 
      desc: "כתיבת עבודות וסיכומים עם ציטוטים אקדמיים מובנים", 
      to: "/AcademicWriting",
      requiresAuth: true
    },
    { 
      title: "רשת חברתית לסטודנטים", 
      desc: "התחברי לפי קורסים ותחומי לימודים וקבלי סיכומים", 
      to: "/SocialNetwork",
      requiresAuth: true
    },
  ];

  return (
    <div className="pageWrapper">
      <header className="header">
        <div className="logoContainer">
          <AdminBadge />
          <span className="logoText">סטודנת חכם</span>
          {user && (
            <div className="user-info-header">
              <span >שלום, {user.displayName || user.email}</span>
            </div>
          )}
        </div>
        <div className="navButtons">
          <Link to="/Dashboard">
            <button className="navButton">לוח מחוונים</button>
          </Link>
          {!user && (
            <Link to="/Login">
              <button className="navButton">כניסה</button>
            </Link>
          )}
          {user && (
              <div className="user-info-header">
                <button 
                  className="navButton"
                  onClick={() => auth.signOut()}
                >
                  יציאה
                </button>
              </div>
            )}
        </div>

      </header>

      <section className="introSection">
        <h1 className="mainTitle">סטודנט חכם</h1>
        <p className="info" style={{ marginBottom: "1rem"}}>
          נהל את הלימודים שלך בצורה חכמה - גישה מהירה לסיכומים, משימות ולוח זמנים מותאם אישית
        </p>
        <p className="info">
          המערכת עוזרת לך לארגן את הלימודים שלך, לשתף סיכומים, לעקוב אחרי משימות והגשות לוח זמנים מותאם לסיכומים והחומרים האישיים שלך.
        </p>
        
        {/* User stats section - only show when logged in */}
        {user && (
          <div className="user-stats-section">
            {/* Recent activity */}
            {userStats.recentActivity.length > 0 && (
              <div className="recent-activity-section">
                <h4 className="activity-title">פעילות אחרונה</h4>
                <div className="activity-list">
                  {userStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item-home">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-details">{activity.details}</span>
                      <span className="activity-date">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="cardsSection">
        <div className="cardsGrid">
          {navigationCards.map((item, index) => (
            <div key={index} className="card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {item.requiresAuth && !user && (
                  <div className="auth-required-notice">
                    <small>נדרשת כניסה למערכת</small>
                  </div>
                )}
              </div>
              {item.requiresAuth && !user ? (
                <Link to="/Login" style={{ marginTop: "1rem" }}>
                  <button className="cardButton">כניסה נדרשת</button>
                </Link>
              ) : (
                <Link 
                  to={item.to} 
                  style={{ marginTop: "1rem" }}
                  onClick={() => logCardClick(item.title)}
                >
                  <button className="cardButton">למעבר</button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;