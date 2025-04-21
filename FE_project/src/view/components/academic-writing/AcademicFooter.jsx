import React from "react";
import { Link } from "react-router-dom";
import "./AcademicFooter.css";

const AcademicFooter = () => {
  return (
    <footer className="academic-footer">
      <div className="footer-links">
        <Link to="/help-settings" className="footer-link">עזרה והגדרות</Link>
        <span className="separator">|</span>
        <div className="footer-link">תנאי שימוש</div>
        <span className="separator">|</span>
        <div className="footer-link">מדיניות פרטיות</div>
      </div>
    </footer>
  );
};

export default AcademicFooter;