import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { auth } from "../../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import PrivacySettings from "../../components/HelpSettingsHelper/PrivacySettings/PrivacySettings";
import HelpGuides from "../../components/HelpSettingsHelper/HelpGuides/HelpGuides";
import "./HelpSettings.css";

const HelpSettings = () => {
  const [activeTab, setActiveTab] = useState("help");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // מעקב אחר מצב ההתחברות של המשתמש
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // ניקוי הליסנר כאשר הקומפוננט נמחק
  }, []);

  // אם המשתמש לא מחובר, הפנה אותו לדף הכניסה
  if (!loading && !user) {
    return (
      <div className="help-settings-container">
        <div className="help-settings-content">
          <div className="back-navigation">
            <Link to="/" className="back-link">
              <ArrowLeft className="back-icon" />
              <span>חזרה לדף הבית</span>
            </Link>
          </div>
          
          <div className="auth-required-message" style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <h2>נדרשת התחברות</h2>
            <p>כדי לגשת להגדרות ולמרכז העזרה, עליך להתחבר למערכת</p>
            <Link to="/login" style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              התחבר למערכת
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // מסך טעינה בזמן בדיקת סטטוס ההתחברות
  if (loading) {
    return (
      <div className="help-settings-container">
        <div className="help-settings-content">
          <div className="loading-spinner" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px'
          }}>
            טוען...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="help-settings-container">
      <div className="help-settings-content">
        <div className="back-navigation">
          <Link to="/" className="back-link">
            <ArrowLeft className="back-icon" />
            <span>חזרה לדף הבית</span>
          </Link>
        </div>
        
        {/* הצגת מידע על המשתמש המחובר */}
        <div className="user-info" style={{
          backgroundColor: '#e3f2fd',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          מחובר כ: {user?.displayName || user?.email}
        </div>
        
        <h1 className="main-title-settings">מרכז עזרה והגדרות</h1>
        
        <div className="tabs-container">
          <div className="tabs-list-settings">
            <button 
              className={`tab-trigger ${activeTab === "help" ? "active" : ""}`}
              onClick={() => setActiveTab("help")}
            >
              מדריכי משתמש
            </button>
            <button 
              className={`tab-trigger ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              הגדרות פרטיות והתראות
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === "help" && (
              <div className="content-card">
                <HelpGuides user={user} />
              </div>
            )}
            
            {activeTab === "privacy" && (
              <div className="content-card">
                <PrivacySettings user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSettings;