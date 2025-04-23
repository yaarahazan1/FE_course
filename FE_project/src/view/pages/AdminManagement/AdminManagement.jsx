import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminManagement.css";
import "../../../styles/styles.css";

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
  const [selectedUser, setSelectedUser] = useState(null);

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
    <div className="admin-container">
      <header className="admin-header">
        <h2>ניהול מערכת</h2>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </header>

      <nav className="admin-tabs">
        <button onClick={() => setActiveTab("summaries")} className={activeTab === "summaries" ? "active" : ""}>אישור סיכומים</button>
        <button onClick={() => setActiveTab("users")} className={activeTab === "users" ? "active" : ""}>ניהול משתמשים</button>
      </nav>

      <main className="admin-main">
        {activeTab === "users" && (
          <section>
            <h2>רשימת משתמשים</h2>
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
            />
            <table>
              <thead>
                <tr>
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
                  <tr key={user.id}>
                    <td onClick={() => setSelectedUser(user)} className="clickable">{user.name}</td>
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
              value={summarySearchTerm}
              onChange={(e) => setSummarySearchTerm(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>כותרת הסיכום</th>
                  <th>מחבר</th>
                  <th>תאריך העלאה</th>
                  <th>סטטוס</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummaries.map(summary => (
                  <tr key={summary.id}>
                    <td onClick={() => setSelectedSummary(summary)} className="clickable">📄 {summary.title}</td>
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
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedSummary(null)}>×</button>
            <h2>פרטי סיכום</h2>
            <p><strong>כותרת:</strong> {selectedSummary.title}</p>
            <p><strong>מחבר:</strong> {selectedSummary.author}</p>
            <p><strong>תאריך העלאה:</strong> {selectedSummary.date}</p>
            <div className="summary-box">
              <strong>תוכן הסיכום:</strong>
              <p>זהו תוכן הסיכום לדוגמה. במערכת אמיתית, כאן יוצג תוכן הסיכום המלא.</p>
            </div>
            <label>משוב למשתמש:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="הוסף משוב או הערות עבור המשתמש..."
            />
            <div className="modal-actions">
              <button onClick={() => handleSummaryAction("דחייה", selectedSummary.id)}>דחיית הסיכום</button>
              <button onClick={() => handleSummaryAction("אישור", selectedSummary.id)}>אישור הסיכום</button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal">
          <div className="modal-content user-modal">
            <h2>פרטי משתמש</h2>
            <p className="gray-text">מידע מפורט על המשתמש</p>
            <div className="user-columns">
              <div className="user-box">
                <h3>🗂 פעולות אחרונות</h3>
                <div>
                  <strong>10/04/2025:</strong> העלאת סיכום <br />
                  <small>מבוא לפסיכולוגיה - פרק 1</small>
                  <hr />
                  <strong>08/04/2025:</strong> הוספת מטלה <br />
                  <small>עבודה מסכמת בקורס התפתחות הילד</small>
                  <hr />
                  <strong>05/04/2025:</strong> הגיב לשאלה <br />
                  <small>בפורום של קורס שיטות מחקר</small>
                </div>
              </div>
              <div className="user-details">
                <div className="user-box">
                  <h3>📘 פרטים אישיים</h3>
                  <p><strong>שם:</strong> {selectedUser.name}</p>
                  <p><strong>אימייל:</strong> {selectedUser.email}</p>
                  <p><strong>סטטוס:</strong> {selectedUser.status}</p>
                </div>
                <div className="user-box">
                  <h3>📅 פרטי לימודים</h3>
                  <p><strong>תחום לימוד:</strong> {selectedUser.field}</p>
                  <p><strong>מוסד לימודים:</strong> {selectedUser.institution}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)}>סגור</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">עזרה והגדרות</Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">תנאי שימוש</div>
            <span className="footer-separator">|</span>
            <div className="footer-item">מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminManagement;
