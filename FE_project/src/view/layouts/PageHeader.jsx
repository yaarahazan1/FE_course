import React from "react";
import { Link } from "react-router-dom";

const PageHeader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#333" }}>
        <span style={{ marginLeft: "0.5rem" }}>🏠</span>
        <span>דף הבית</span>
      </Link>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Link to="/TimeManagement"><button style={{ padding: "0.5rem 1rem" }}>ניהול זמנים</button></Link>
        <Link to="/SummaryLibrary"><button style={{ padding: "0.5rem 1rem" }}>ספריית סיכומים</button></Link>
        <Link to="/CourseManagement"><button style={{ padding: "0.5rem 1rem" }}>ניהול משימות ופרויקטים</button></Link>
        <Link to="/AcademicWriting"><button style={{ padding: "0.5rem 1rem" }}>כלי לכתיבה אקדמית</button></Link>
        <Link to="/SocialNetwork"><button style={{ padding: "0.5rem 1rem" }}>רשת חברתית</button></Link>
      </div>
    </div>
  );
};

export default PageHeader;
