import React, { useState } from "react";
import { Link } from "react-router-dom";

const HelpSettings = () => {
  const [activeTab, setActiveTab] = useState("help");

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", direction: "rtl", backgroundColor: "#fdfdfd" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* חזור לדף הבית */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", fontSize: "1rem" }}>
            <span style={{ marginLeft: "0.5rem", fontSize: "1.2rem" }}>←</span>
            חזרה לדף הבית
          </Link>
        </div>

        {/* כותרת */}
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
          מרכז עזרה והגדרות
        </h1>

        {/* טאבים */}
        <div>
          {/* רשימת טאבים */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <button
              onClick={() => setActiveTab("help")}
              style={{
                padding: "1rem",
                fontSize: "1rem",
                backgroundColor: activeTab === "help" ? "#ddd" : "#f5f5f5",
                border: "1px solid #ccc",
                cursor: "pointer"
              }}
            >
              מדריכי משתמש
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              style={{
                padding: "1rem",
                fontSize: "1rem",
                backgroundColor: activeTab === "privacy" ? "#ddd" : "#f5f5f5",
                border: "1px solid #ccc",
                cursor: "pointer"
              }}
            >
              הגדרות פרטיות והתראות
            </button>
          </div>

          {/* תוכן טאב */}
          <div style={{
            border: "1px solid #ccc",
            padding: "2rem",
            minHeight: "300px",
            backgroundColor: "#fafafa"
          }}>
            {activeTab === "help" ? (
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>מדריכי משתמש</h2>
                <ul style={{ lineHeight: "2" }}>
                  <li>איך להשתמש במערכת?</li>
                  <li>ניהול החשבון האישי</li>
                  <li>שיתוף סיכומים עם אחרים</li>
                  <li>שימוש בכתיבה האקדמית</li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>הגדרות פרטיות והתראות</h2>
                <ul style={{ lineHeight: "2" }}>
                  <li>ניהול הרשאות חשיפה</li>
                  <li>קביעת העדפות אימייל</li>
                  <li>שליטה בהתראות בתוך האתר</li>
                  <li>מחיקת החשבון</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* פוטר */}
      <footer style={{
        marginTop: "4rem",
        padding: "2rem 1rem",
        textAlign: "center",
        borderTop: "1px solid #ccc"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <Link to="/help-settings" style={{ textDecoration: "underline" }}>
            עזרה והגדרות
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>תנאי שימוש</span>
            <span style={{ cursor: "pointer", textDecoration: "underline" }}>מדיניות פרטיות</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpSettings;
