import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../../styles/styles.module.css";

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
  const [selectedUser, setSelectedUser] = useState(null); // חדש

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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>ניהול מערכת</h2>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </header>

      <nav style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center" }}>
        <button onClick={() => setActiveTab("summaries")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "summaries" ? "2px solid black" : "none" }}>אישור סיכומים</button>
        <button onClick={() => setActiveTab("users")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "users" ? "2px solid black" : "none" }}>ניהול משתמשים</button>
      </nav>

      <main style={{ marginTop: "2rem", width: "70%", margin: "0 auto" }}>
      {activeTab === "users" && (
          <section>
            <h2>רשימת משתמשים</h2>
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              style={{ width: "95%", marginBottom: "1rem" }}
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
                    <td
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.name}
                    </td>
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
                    <td style={{ cursor: "pointer" }} onClick={() => setSelectedSummary(summary)}>📄 {summary.title}</td>
                    <td>{summary.author}</td>
                    <td>{summary.date}</td>
                    <td>ממתין</td>
                    <td>
                      <button onClick={() => handleSummaryAction("אישור", summary.id)}>אישור</button>
                      <button onClick={() => handleSummaryAction("דחייה", summary.id)}>דחייה</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      {selectedSummary && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", maxWidth: "600px", width: "100%", direction: "rtl", position: "relative" }}>
            <button onClick={() => setSelectedSummary(null)} style={{ position: "absolute", top: "10px", left: "10px", background: "transparent", border: "none", fontSize: "1.5rem" }}>×</button>
            <h2>פרטי סיכום</h2>
            <p><strong>כותרת:</strong> {selectedSummary.title}</p>
            <p><strong>מחבר:</strong> {selectedSummary.author}</p>
            <p><strong>תאריך העלאה:</strong> {selectedSummary.date}</p>
            <div style={{ backgroundColor: "#f7f7f7", padding: "1rem", borderRadius: "5px", marginBottom: "1rem" }}>
              <strong>תוכן הסיכום:</strong>
              <p>זהו תוכן הסיכום לדוגמה. במערכת אמיתית, כאן יוצג תוכן הסיכום המלא שהועלה על ידי המשתמש.</p>
            </div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>משוב למשתמש:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="הוסף משוב או הערות עבור המשתמש..."
              style={{ width: "100%", height: "100px", border: "1px solid #000", borderRadius: "5px", marginBottom: "1rem", padding: "0.5rem" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => handleSummaryAction("דחייה", selectedSummary.id)} style={{ backgroundColor: "#fff", border: "1px solid red", color: "red", padding: "0.5rem 1rem", borderRadius: "5px" }}>דחיית הסיכום</button>
              <button onClick={() => handleSummaryAction("אישור", selectedSummary.id)} style={{ backgroundColor: "green", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}>אישור הסיכום</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "700px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginBottom: "5px" }}>פרטי משתמש</h2>
            <p style={{ marginTop: 0, color: "#888" }}>מידע מפורט על המשתמש</p>

            <div style={{ display: "flex", gap: "20px", direction: "rtl" }}>
              {/* פעולות אחרונות */}
              <div
                style={{
                  flex: 1,
                  background: "#f8f8f8",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <h3>🗂 פעולות אחרונות</h3>
                <div style={{ marginTop: "10px" }}>
                  <div>
                    <strong>10/04/2025:</strong> העלאת סיכום<br />
                    <small>מבוא לפסיכולוגיה - פרק 1</small>
                  </div>
                  <hr />
                  <div>
                    <strong>08/04/2025:</strong> הוספת מטלה<br />
                    <small>עבודה מסכמת בקורס התפתחות הילד</small>
                  </div>
                  <hr />
                  <div>
                    <strong>05/04/2025:</strong> הגיב לשאלה<br />
                    <small>בפורום של קורס שיטות מחקר</small>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
                {/* פרטים אישיים */}
                <div
                  style={{
                    background: "#f8f8f8",
                    padding: "15px",
                    borderRadius: "10px",
                  }}
                >
                  <h3>📘 פרטים אישיים</h3>
                  <p><strong>שם:</strong> {selectedUser.name}</p>
                  <p><strong>אימייל:</strong> {selectedUser.email}</p>
                  <p>
                    <strong>סטטוס:</strong>{" "}
                    <span
                      style={{
                        padding: "2px 8px",
                        backgroundColor: selectedUser.status === "פעיל" ? "#d0f0d0" : "#f0d0d0",
                        borderRadius: "6px",
                        fontSize: "0.9em",
                      }}
                    >
                      {selectedUser.status}
                    </span>
                  </p>
                </div>

                {/* פרטי לימודים */}
                <div
                  style={{
                    background: "#f8f8f8",
                    padding: "15px",
                    borderRadius: "10px",
                  }}
                >
                  <h3>📅 פרטי לימודים</h3>
                  <p><strong>תחום לימוד:</strong> {selectedUser.field}</p>
                  <p><strong>מוסד לימודים:</strong> {selectedUser.institution}</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "left" }}>
              <button onClick={() => setSelectedUser(null)}>סגור</button>
            </div>
          </div>
        </div>
      )}


      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>עזרה והגדרות</Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>תנאי שימוש</div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminManagement;
