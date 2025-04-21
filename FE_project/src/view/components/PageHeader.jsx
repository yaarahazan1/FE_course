// PageHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./PageHeader.css";

const PageHeader = () => {
  return (
    <div className="page-header">
      <Link to="/" className="home-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>דף הבית</span>
      </Link>
      <div className="nav-links">
        <Link to="/TimeManagement" className="nav-button">
          ניהול זמנים
        </Link>
        <Link to="/SummaryLibrary" className="nav-button">
          ספריית סיכומים
        </Link>
        <Link to="/CourseManagement" className="nav-button">
          ניהול משימות ופרויקטים
        </Link>
        <Link to="/AcademicWriting" className="nav-button">
          כלי לכתיבה אקדמית
        </Link>
        <Link to="/SocialNetwork" className="nav-button">
          רשת חברתית
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;