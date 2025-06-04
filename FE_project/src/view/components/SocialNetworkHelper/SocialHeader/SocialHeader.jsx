import React from "react";
import "./SocialHeader.css";

const SocialHeader = ({ onCreateGroup, onCreateEvent }) => {
  return (
    <header className="social-header">
      <div className="social-header-content">
        <div className="social-header-main">
          <h1 className="social-header-title">רשת חברתית אקדמית</h1>
          <p className="social-header-subtitle">
            התחבר עם סטודנטים, שתף תוכן לימודי וצור קבוצות לימוד
          </p>
        </div>
        
        <div className="social-header-actions">
          <button 
            className="social-header-btn social-header-btn-outline"
            onClick={onCreateEvent}
          >
            <svg className="social-header-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            צור אירוע
          </button>
          
          <button 
            className="social-header-btn social-header-btn-primary"
            onClick={onCreateGroup}
          >
            <svg className="social-header-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            צור קבוצת לימוד
          </button>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;