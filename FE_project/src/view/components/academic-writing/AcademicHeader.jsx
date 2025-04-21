import React from "react";
import { BookOpen, Pen } from "lucide-react";
import "./AcademicHeader.css";

const AcademicHeader = () => {
  return (
    <header className="academic-header">
      <div className="header-title-container">
        <BookOpen className="header-icon-large" />
        <h1 className="header-title">כלי לכתיבה אקדמית</h1>
        <Pen className="header-icon-small" />
      </div>
      <p className="header-description">
        כתוב, ערוך וצטט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים
      </p>
    </header>
  );
};

export default AcademicHeader;