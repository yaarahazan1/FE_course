import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../PageHeader";

const Dashboard = () => {
  <PageHeader />
  // מידע מדומה פשוט
  const currentUserData = {
    name: "יעל ישראלי",
    tasksCompleted: 12,
    tasksTotal: 16,
    studyHours: 28,
    summariesUploaded: 5,
    lastActive: "11/04/2025",
    progress: [
      { day: "יום א'", hours: 2 },
      { day: "יום ב'", hours: 5 },
      { day: "יום ג'", hours: 3 },
    ],
  };

  const recentSummaries = [
    { id: 1, title: "מבוא לפסיכולוגיה", date: "10/04/2025", author: "רונית כהן" },
    { id: 2, title: "אלגוריתמים", date: "08/04/2025", author: "משה לוי" }
  ];

  const recentActivities = [
    { id: 1, activity: "השלמת משימה", details: "מבוא לפיזיקה", date: "11/04/2025" },
    { id: 2, activity: "העלאת סיכום", details: "תכנות", date: "10/04/2025" }
  ];

  const summaryRatings = [
    { id: 1, title: "תכנות מונחה עצמים", rating: 5 },
    { id: 2, title: "מבנה נתונים", rating: 3 }
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "1rem", direction: "rtl" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem" }}>לוח מחוונים</h1>
          <p>סיכום סטטיסטי של פעילות</p>
        </div>
        <div>
          <Link to="/">חזרה לדף הבית</Link>
        </div>
      </header>

      {/* נתונים אישיים */}
      <section style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>הנתונים שלי (עדכון אחרון: {currentUserData.lastActive})</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <div style={{ flex: "1 1 200px" }}>
            <strong>{currentUserData.tasksCompleted}</strong>
            <p>משימות שהושלמו מתוך {currentUserData.tasksTotal}</p>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <strong>{currentUserData.studyHours}</strong>
            <p>שעות למידה בשבוע האחרון</p>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <strong>{currentUserData.summariesUploaded}</strong>
            <p>סיכומים שהועלו</p>
          </div>
        </div>
      </section>

      {/* סיכומים חדשים */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>סיכומים חדשים</h2>
        <ul>
          {recentSummaries.map((summary) => (
            <li key={summary.id}>
              <strong>{summary.title}</strong> — {summary.author} ({summary.date})
            </li>
          ))}
        </ul>
      </section>

      {/* פעילויות אחרונות */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>פעילות אחרונה</h2>
        <ul>
          {recentActivities.map((act) => (
            <li key={act.id}>
              {act.activity}: {act.details} ({act.date})
            </li>
          ))}
        </ul>
      </section>

      {/* ציונים / פידבק */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>פידבק על סיכומים</h2>
        <ul>
          {summaryRatings.map((s) => (
            <li key={s.id}>
              {s.title}: {s.rating} מתוך 5
            </li>
          ))}
        </ul>
      </section>

      {/* טיפ יומי */}
      <section style={{ borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
        <h3>טיפ היומי:</h3>
        <p>30 דקות לימוד ביום מגדילות הצלחה במבחנים</p>
      </section>

      <footer style={{ marginTop: "4rem", textAlign: "center", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
        <Link to="/help-settings" style={{ margin: "0 1rem" }}>עזרה והגדרות</Link>
        <span style={{ margin: "0 1rem" }}>תנאי שימוש</span>
        <span style={{ margin: "0 1rem" }}>מדיניות פרטיות</span>
      </footer>
    </div>
  );
};

export default Dashboard;
