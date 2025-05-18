import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const tasksData = { completed: 75, pending: 25 };
  const completionRate = 92;

  const pieData = [
    { name: "הושלמו", value: tasksData.completed },
    { name: "ממתינות", value: tasksData.pending }
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

  const currentUserData = {
    name: "יעל ישראלי",
    tasksCompleted: 12,
    tasksTotal: 16,
    studyHours: 28,
    summariesUploaded: 5,
    lastActive: "11/04/2025",
    progress: [
      { day: "א'", hours: 2 },
      { day: "ב'", hours: 5 },
      { day: "ג'", hours: 3 },
      { day: "ד'", hours: 4 },
      { day: "ה'", hours: 6 },
      { day: "ו'", hours: 2 },
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>לוח מחוונים מערכתי</h1>
          <p>סיכום סטטיסטי של פעילות המערכת</p>
        </div>
        <Link to="/">חזרה לדף הבית</Link>
      </header>

      {/* אישי */}
      <section className="section">
        <h2>👤 הלוח האישי</h2>
        <div className="stats-row">
          <StatBox label="משימות שהושלמו" value={`${currentUserData.tasksCompleted} מתוך ${currentUserData.tasksTotal}`} />
          <StatBox label="סיכומים שהועלו" value={currentUserData.summariesUploaded} />
          <StatBox label="שעות למידה" value={currentUserData.studyHours} />
          <StatBox label="השלמת משימות" value={`${Math.round((currentUserData.tasksCompleted / currentUserData.tasksTotal) * 100)}%`} />
        </div>

        <div className="charts-row">
          <div className="chart">
            <h4>📅 פעילות לפי ימים</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={currentUserData.progress}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#ccc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart">
            <h4>🧪 חלוקת זמן לפי קורסים</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={currentUserData.topCourses} dataKey="percent" outerRadius={70} label>
                  {currentUserData.topCourses.map((_, i) => (
                    <Cell key={i} fill={["#ccc", "#bbb", "#aaa", "#999"][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="recommendation">
          <strong>💡 המלצה:</strong> הקדש/י יותר זמן לקורס אנגלית השבוע.
        </div>
      </section>

      {/* כלליות */}
      <section>
        <h2>📊 סטטיסטיקות כלליות</h2>
        <div className="grid">
          <ChartBox title="סטטוס משימות">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={60} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={["#bbb", "#eee"][i % 2]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="סיכומים חדשים">
            {recentSummaries.map(item => (
              <div key={item.id}>
                <strong>{item.title}</strong><br />
                <small>{item.author} - {item.date}</small>
              </div>
            ))}
          </ChartBox>

          <ChartBox title="פעילות אחרונה">
            {recentActivities.map(item => (
              <div key={item.id}>
                <strong>{item.activity}</strong><br />
                <small>{item.details} - {item.date}</small>
              </div>
            ))}
          </ChartBox>

          <ChartBox title="זמן לקורסים">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={timeSpentData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="hours" fill="#bbb" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="תדירות העלאת סיכומים">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={summaryUploadData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="uploads" stroke="#aaa" />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="ציונים על סיכומים">
            {summaryRatings.map(s => (
              <div key={s.id}>
                {s.title}: {"★".repeat(s.rating)}{"☆".repeat(5 - s.rating)}
              </div>
            ))}
            <div><strong>{completionRate}%</strong> שביעות רצון</div>
          </ChartBox>

          <ChartBox title="מעורבות משתמשים">
            <p>כניסות: {userEngagement.visitors}</p>
            <p>פעילים: {userEngagement.activeUsers}</p>
            <p>חדשים: {userEngagement.newUsers}</p>
            <div><strong>טיפ:</strong> הקדשת 30 דקות ביום מעלה הצלחה ב־40%</div>
          </ChartBox>
        </div>
      </section>

    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="stat-box">
    <div>{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="chart-box">
    <h4>{title}</h4>
    {children}
  </div>
);

export default Dashboard;
