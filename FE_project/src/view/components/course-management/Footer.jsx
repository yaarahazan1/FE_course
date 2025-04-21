import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/help-settings" className="footer-link">
            עזרה והגדרות
          </Link>
          <span className="footer-divider">|</span>
          <div className="footer-link">
            תנאי שימוש
          </div>
          <span className="footer-divider">|</span>
          <div className="footer-link">
            מדיניות פרטיות
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;