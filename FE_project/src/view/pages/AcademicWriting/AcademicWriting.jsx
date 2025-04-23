import React, { useState } from "react";
import PageHeader from "../PageHeader";
import "./AcademicWriting.css";
import { Link } from "react-router-dom";
import "../../../styles/styles.css";

function AcademicWriting() {
  const [documentType, setDocumentType] = useState("מאמר");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");

  const documentTypes = ["מאמר", "תזה", "סמינריון", "מסמך"];
  const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"];
  const typeOfTemplate = ["תבנית בסיסית", "תבנית מחקר", "תבנית תזה", "תבנית מותאמת אישית"];

  return (
    <div className="academic-writing-container">
      <PageHeader />

      <header className="academic-header">
        <h1>כתיבה אקדמית</h1>
        <p>כתוב, ערוך וצטט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים</p>
      </header>

      <section className="academic-controls">
        <div className="academic-select">
          <label>סוג מסמך:</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="academic-select">
          <label>סגנון ציטוט:</label>
          <select value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)}>
            {citationStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div className="academic-select">
          <label>תבנית מסמך:</label>
          <select value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)}>
            {typeOfTemplate.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </section>

      <main className="academic-main">
        <section className="academic-editor">
          <label>תוכן המסמך:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            placeholder="כתבי כאן את הטקסט האקדמי..."
          />
          <div className="save-info">נשמר אוטומטית.</div>
        </section>

        <aside className="academic-sidebar">
          <h2>אפשרויות נוספות</h2>
          <h3>ייצוא</h3>
          <ul>
            <li><button onClick={() => alert("ייצוא ל-PDF")}>ייצוא ל־PDF</button></li>
            <li><button onClick={() => alert("ייצוא ל־Word")}>ייצוא ל־Word</button></li>
          </ul>

          <h3>שמירה</h3>
          <ul>
            <li><button onClick={() => alert("שמור מקומית")}>שמור מקומית</button></li>
            <li><button onClick={() => alert("שמור בענן")}>שמור בענן</button></li>
          </ul>

          <h3>סניפים</h3>
          <ul>
            <li><button onClick={() => alert("צפי בגרסאות קודמות")}>הצג גרסאות</button></li>
            <li><button onClick={() => alert("צור סניף חדש")}>צור סניף חדש</button></li>
          </ul>
        </aside>
      </main>

      <section className="academic-analysis">
        <h3>זיהוי אוטומטי</h3>
        <p>
          הפונקציה תסרוק את המסמך ותזהה מקורות, בעיות ניסוח, אזכורים לא עקביים ועוד.
          תוצאות הזיהוי יופיעו כאן.
        </p>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">עזרה והגדרות</Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">תנאי שימוש</div>
            <span className="footer-separator">|</span>
            <div className="footer-item">מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AcademicWriting;
