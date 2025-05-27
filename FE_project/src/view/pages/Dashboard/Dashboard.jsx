import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Star, User, Trophy, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  // מידע סטטיסטי לדוגמה
  const tasksData = {
    completed: 75,
    pending: 25
  };

  const pieData = [
    { name: "הושלמו", value: tasksData.completed, color: "#10B981" },
    { name: "ממתינות", value: tasksData.pending, color: "#EF4444" }
  ];

  const recentSummaries = [
    { id: 1, title: "מבוא לפסיכולוגיה", date: "10/04/2025", author: "רונית כהן" },
    { id: 2, title: "אלגוריתמים", date: "08/04/2025", author: "משה לוי" },
    { id: 3, title: "סטטיסטיקה", date: "05/04/2025", author: "יעל גולדמן" }
  ];

  const recentActivities = [
    { id: 1, activity: "השלמת משימה", details: "מבוא לפיזיקה - הגשת תרגיל", date: "11/04/2025" },
    { id: 2, activity: "העלאת סיכום", details: "תכנות מונחה עצמים", date: "10/04/2025" },
    { id: 3, activity: "עדכון פרופיל", details: "שינוי תחום לימודים", date: "09/04/2025" }
  ];

  const timeSpentData = [
    { name: "אלגברה", hours: 10 },
    { name: "פיזיקה", hours: 8 },
    { name: "תכנות", hours: 6 },
    { name: "אנגלית", hours: 4 }
  ];

  const summaryUploadData = [
    { month: "חודש 1", uploads: 1 },
    { month: "חודש 2", uploads: 2 },
    { month: "חודש 3", uploads: 3 },
    { month: "חודש 4", uploads: 1 }
  ];

  const summaryRatings = [
    { id: 1, title: "תכנות מונחה עצמים", rating: 5 },
    { id: 2, title: "מבנה נתונים", rating: 3 }
  ];

  const userEngagement = {
    visitors: 24,
    activeUsers: 8,
    newUsers: 5
  };

  const completionRate = 92;

  // נתונים עבור המשתמש הנוכחי
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
      { day: "יום ד'", hours: 4 },
      { day: "יום ה'", hours: 6 },
      { day: "יום ו'", hours: 2 },
      { day: "שבת", hours: 0 },
    ],
    topCourses: [
      { name: "פיזיקה", percent: 40 },
      { name: "אלגברה", percent: 30 },
      { name: "תכנות", percent: 20 },
      { name: "אנגלית", percent: 10 },
    ]
  };

  return (
    <div className="dashboard-container">
        <div>
          <Link to="/" className="dashboard-home-link">חזרה לדף הבית</Link>
        </div>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">לוח מחוונים מערכתי</h1>
          <p className="dashboard-subtitle">סיכום סטטיסטי של פעילות המערכת</p>
        </div>
      </div>

      {/* מידע על המשתמש הנוכחי */}
      <div className="dashboard-card user-info-card">
        <div className="card-content">
          <div className="user-header">
            <h2 className="user-title">
              <User className="icon" />
              הנתונים שלי
            </h2>
            <span className="last-update">עדכון אחרון: {currentUserData.lastActive}</span>
          </div>
          
          <div className="user-stats-grid">
            <div className="stat-card">
              <div className="stat-number">{currentUserData.tasksCompleted}</div>
              <div className="stat-label">משימות שהושלמו</div>
              <div className="stat-sublabel">מתוך {currentUserData.tasksTotal}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentUserData.studyHours}</div>
              <div className="stat-label">שעות למידה</div>
              <div className="stat-sublabel">בשבוע האחרון</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentUserData.summariesUploaded}</div>
              <div className="stat-label">סיכומים שהועלו</div>
              <div className="stat-sublabel">בחודש האחרון</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Math.round((currentUserData.tasksCompleted / currentUserData.tasksTotal) * 100)}%</div>
              <div className="stat-label">השלמת משימות</div>
              <div className="stat-sublabel">מתוך היעד</div>
            </div>
          </div>
          
          <div className="charts-grid">
            <div className="chart-section">
              <h3 className="chart-title">
                <Clock className="chart-icon" />
                פעילות לפי ימים
              </h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentUserData.progress}>
                    <XAxis dataKey="day" />
                    <YAxis direction={"ltr"}/>
                    <Tooltip />
                    <Bar dataKey="hours" fill="#89A8B2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="chart-section">
              <h3 className="chart-title">
                <Trophy className="chart-icon" />
                התפלגות זמן לפי קורסים
              </h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentUserData.topCourses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percent"
                      label={({ name, percent }) => `${name} ${percent}%`}
                    >
                      {currentUserData.topCourses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#89A8B2', '#B3C8CF', '#FDE1D3', '#FEF7CD'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="recommendation-card">
            <div className="recommendation-title">המלצה אישית:</div>
            <p className="recommendation-text">
              בהתבסס על הנתונים שלך, כדאי להקדיש יותר זמן לקורס אנגלית בשבוע הקרוב
            </p>
          </div>
        </div>
      </div>

      {/* סיכום סטטיסטי */}
      <div className="summary-grid">
        {/* גרף עוגה של משימות */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">סטטוס משימות</h2>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                <div className="legend-item">
                  <div className="legend-dot completed"></div>
                  <span>הושלמו</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot pending"></div>
                  <span>ממתינות</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* סיכומים חדשים */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">סיכומים חדשים</h2>
            <div className="summaries-list">
              {recentSummaries.map(summary => (
                <div key={summary.id} className="summary-item">
                  <div className="summary-title">{summary.title}</div>
                  <div className="summary-details">
                    <span>מועלה ע"י: {summary.author}</span>
                    <span>{summary.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* פעילויות אחרונות */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">פעילות אחרונה</h2>
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-title">{activity.activity}</div>
                  <div className="activity-details">
                    <span>{activity.details}</span>
                    <span>{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">מדדי ביצוע מרכזיים</h2>
      
      {/* מדדי ביצוע מרכזיים */}
      <div className="kpi-grid">
        {/* זמן שהוקדש לקורסים */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">זמן שהוקדש לקורסים</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSpentData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} direction={"ltr"}/>
                  <Tooltip />
                  <Bar dataKey="hours" fill="#89A8B2" />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-footer">
                סה"כ: 42 שעות למידה השבוע
              </div>
            </div>
          </div>
        </div>

        {/* תדירות העלאת סיכומים */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">תדירות העלאת סיכומים</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summaryUploadData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                  <XAxis dataKey="month" tick={{ dy: 10 }} />
                  <YAxis tick={{ dy: -10 }} direction={"ltr"}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="uploads" stroke="#89A8B2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-footer">
                7 סיכומים הועלו בחודש האחרון
              </div>
            </div>
          </div>
        </div>

        {/* שיעור השלמת משימות */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">שיעור השלמת משימות</h2>
            <div className="completion-rate-container">
              <div className="completion-circle">
                <div className="completion-inner">
                  <span className="completion-percentage">{completionRate}%</span>
                </div>
              </div>
              <div className="completion-details">
                <div>12 משימות הושלמו מתוך 16</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* מעורבות משתמשים ופידבק */}
      <div className="engagement-grid">
        {/* פידבק וציונים על סיכומים */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">פידבק וציונים על סיכומים</h2>
            <div className="ratings-list">
              {summaryRatings.map(summary => (
                <div key={summary.id} className="rating-item">
                  <span className="rating-title">{summary.title}</span>
                  <div className="rating-stars-dashboard">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < summary.rating ? "star-filled" : "star-empty-dashboard"}
                      />
                    ))}
                    <span className="rating-score">({summary.rating} מתוך 5)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="overall-satisfaction">
              <div className="satisfaction-rate">{completionRate}%</div>
              <div className="satisfaction-label">שביעות רצון כללית</div>
            </div>
          </div>
        </div>

        {/* מעורבות משתמשים */}
        <div className="dashboard-card">
          <div className="card-content">
            <h2 className="card-title">מעורבות משתמשים</h2>
            <div className="engagement-stats">
              <div className="engagement-stat">
                <div className="engagement-number">{userEngagement.visitors}</div>
                <div className="engagement-label">כניסות למערכת</div>
              </div>
              <div className="engagement-stat">
                <div className="engagement-number">{userEngagement.activeUsers}</div>
                <div className="engagement-label">משתמשים פעילים</div>
              </div>
              <div className="engagement-stat">
                <div className="engagement-number">{userEngagement.newUsers}</div>
                <div className="engagement-label">חברים שהצטרפו</div>
              </div>
            </div>
            <div className="tip-card">
              <div className="tip-title">טיפ היום:</div>
              <p className="tip-text">הקדשת 30 דקות ללמידה יומית מגדילה ב-40% את סיכויי ההצלחה במבחנים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;