import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const mockUsers = [
  { id: 1, name: "יוסף כהן", email: "yosef@example.com", institution: "אוניברסיטת תל אביב", field: "פיזיקה", status: "פעיל" },
  { id: 2, name: "שרה לוי", email: "sara@example.com", institution: "הטכניון", field: "הנדסת תוכנה", status: "פעיל" },
  { id: 3, name: "מאור ישראלי", email: "maor@example.com", institution: "האוניברסיטה העברית", field: "סוציולוגיה", status: "מוקפא" },
];

const mockSummaries = [
  { id: 1, title: "מבוא לפיזיקה", author: "יוסף כהן", date: "12/4/2025" },
  { id: 2, title: "יסודות המתמטיקה", author: "שרה לוי", date: "11/4/2025" },
  { id: 3, title: "תיאוריות סוציולוגיות", author: "מאור ישראלי", date: "10/4/2025" },
];

const AdminManagement = () => {
  const navigate = useNavigate();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [summarySearchTerm, setSummarySearchTerm] = useState("");
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [activeTab, setActiveTab] = useState("summaries");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      alert("אין הרשאה");
      navigate("/");
    }
  }, [navigate]);

  const filteredUsers = mockUsers.filter(user => 
    user.name.includes(userSearchTerm) || user.email.includes(userSearchTerm)
  );

  const filteredSummaries = mockSummaries.filter(summary => 
    summary.title.includes(summarySearchTerm) || summary.author.includes(summarySearchTerm)
  );

  const handleSummaryAction = (action, summaryId) => {
    alert(`פעולת ${action} בוצעה על סיכום ${summaryId}`);
    setSelectedSummary(null);
    setFeedbackText("");
  };

  return (
    <div style={{ minHeight: "100vh", direction: "rtl", padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>ניהול מערכת</h1>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </header>

      <nav style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={() => setActiveTab("summaries")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "summaries" ? "2px solid black" : "none" }}>אישור סיכומים</button>
        <button onClick={() => setActiveTab("users")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "users" ? "2px solid black" : "none" }}>ניהול משתמשים</button>
      </nav>

      <main style={{ marginTop: "2rem", maxWidth: "1000px", margin: "0 auto" }}>

        {activeTab === "users" && (
          <section>
            <h2>רשימת משתמשים</h2>
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ccc" }}>
                  <th>שם משתמש</th>
                  <th>אימייל</th>
                  <th>תחום לימוד</th>
                  <th>מוסד לימודים</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.field}</td>
                    <td>{user.institution}</td>
                    <td>{user.status}</td>
                    <td>
                      <button>הקפאה</button>
                      <button>הסרה</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "summaries" && (
          <section>
            <h2>רשימת סיכומים לאישור</h2>
            <input
              type="text"
              placeholder="חיפוש סיכומים..."
              style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
              value={summarySearchTerm}
              onChange={(e) => setSummarySearchTerm(e.target.value)}
            />

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ccc" }}>
                  <th>כותרת הסיכום</th>
                  <th>מחבר</th>
                  <th>תאריך העלאה</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummaries.map(summary => (
                  <tr key={summary.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td>📄 {summary.title}</td>
                    <td>{summary.author}</td>
                    <td>{summary.date}</td>
                    <td>ממתין</td>
                    <td>
                      <button onClick={() => handleSummaryAction("אישור", summary.id)}>אישור</button>
                      <button onClick={() => handleSummaryAction("דחייה", summary.id)}>דחייה</button>
                      <button onClick={() => setSelectedSummary(summary)}>משוב</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedSummary && (
              <div style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
                <h3>משוב לסיכום: {selectedSummary.title}</h3>
                <textarea
                  value={feedbackText}
                  onChange={(e) => {
                    setFeedbackText(e.target.value);
                    console.log("שמור משוב אוטומטי:", e.target.value);
                  }}
                  placeholder="כתוב משוב..."
                  style={{ width: "100%", height: "100px" }}
                />
              </div>
            )}
          </section>
        )}
      </main>

      <footer style={{ padding: "1rem", textAlign: "center", marginTop: "3rem" }}>
        <Link to="/help-settings">עזרה והגדרות</Link> |
        <Link to="/terms"> תנאי שימוש </Link> |
        <Link to="/privacy"> מדיניות פרטיות</Link>
      </footer>
    </div>
  );
};

export default AdminManagement;
