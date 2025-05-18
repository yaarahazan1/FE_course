import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HelpSettings.css";

const HelpSettings = () => {
  const [activeTab, setActiveTab] = useState("help");

  return (
    <div className="help-container">
      <div className="help-inner">

        <div className="help-back">
          <Link to="/" className="help-back-link">
            <span className="arrow">←</span>
            חזרה לדף הבית
          </Link>
        </div>

        <h1 className="help-title">מרכז עזרה והגדרות</h1>

        <div>
          <div className="help-tabs">
            <button
              onClick={() => setActiveTab("help")}
              className={`help-tab ${activeTab === "help" ? "active" : ""}`}
            >
              מדריכי משתמש
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`help-tab ${activeTab === "privacy" ? "active" : ""}`}
            >
              הגדרות פרטיות והתראות
            </button>
          </div>

          <div className="help-content-box">
            {activeTab === "help" ? (
              <div>
                <h2 className="help-section-title">מדריכי משתמש</h2>
                <ul className="help-list">
                  <li>איך להשתמש במערכת?</li>
                  <li>ניהול החשבון האישי</li>
                  <li>שיתוף סיכומים עם אחרים</li>
                  <li>שימוש בכתיבה האקדמית</li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="help-section-title">הגדרות פרטיות והתראות</h2>
                <ul className="help-list">
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
    </div>
  );
};

export default HelpSettings;
