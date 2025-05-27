import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PrivacySettings from "../../components/HelpSettingsHelper/PrivacySettings/PrivacySettings";
import HelpGuides from "../../components/HelpSettingsHelper/HelpGuides/HelpGuides";
import "./HelpSettings.css";

const HelpSettings = () => {
  const [activeTab, setActiveTab] = useState("help");

  return (
    <div className="help-settings-container">
      <div className="help-settings-content">
        <div className="back-navigation">
          <Link to="/" className="back-link">
            <ArrowLeft className="back-icon" />
            <span>חזרה לדף הבית</span>
          </Link>
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
                <HelpGuides />
              </div>
            )}
            
            {activeTab === "privacy" && (
              <div className="content-card">
                <PrivacySettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSettings;