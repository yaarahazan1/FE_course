import React, { useState } from "react";
import PageHeader from "../PageHeader";
import styles from "../../../styles/styles.module.css"; 
import { Link } from "react-router-dom";

function AcademicWriting() {
  const [documentType, setDocumentType] = useState("מאמר");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");

  const documentTypes = ["מאמר", "תזה", "סמינריון", "מסמך"];
  const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"];
  const typeOfTemplate = ["תבנית בסיסית", "תבנית מחקר", "תבנית תזה", "תבנית מותאמת אישית"];


  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />

      <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1>כתיבה אקדמית</h1>
        <p>כתוב, ערוך וצטט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים</p>
      </header>

      <section style={{
          display: "flex", 
          gap: "0.5rem", 
        }}>
          <div style={{ flex: "0 1 340px" }}>
          <label>סוג מסמך:</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "0 1 340px" }}>
          <label>סגנון ציטוט:</label>
          <select value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            {citationStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "0 1 340px" }}>
          <label>תבנית מסמך:</label>
          <select value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            {typeOfTemplate.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </section>

      <main style={{ display: "flex", flexWrap: "wrap", gap: "2rem", flex: 1 }}>
        <section style={{ flex: "3 1 600px", minWidth: "300px" }}>
          <label>תוכן המסמך:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            placeholder="כתבי כאן את הטקסט האקדמי..."
          />
          <div style={{ fontSize: "0.9rem", color: "#555" }}>
            נשמר אוטומטית.
          </div>
        </section>

        <aside style={{ flex: "1 1 200px", minWidth: "250px", border: "1px solid #ccc", padding: "1rem", marginTop: "0" }}>
          <h2>אפשרויות נוספות</h2>
          <h3>ייצוא</h3>
          <ul>
            <li><button onClick={() => alert("ייצוא ל-PDF")}>ייצוא ל־PDF</button></li>
            <li><button onClick={() => alert("ייצוא ל־Word")}>ייצוא ל־Word</button></li>
          </ul>

          <h3 style={{ marginTop: "1.5rem" }}>שמירה</h3>
          <ul>
            <li><button onClick={() => alert("שמור מקומית")}>שמור מקומית</button></li>
            <li><button onClick={() => alert("שמור בענן")}>שמור בענן</button></li>
          </ul>

          <h3 style={{ marginTop: "1.5rem" }}>סניפים</h3>
          <ul>
            <li><button onClick={() => alert("צפי בגרסאות קודמות")}>הצג גרסאות</button></li>
            <li><button onClick={() => alert("צור סניף חדש")}>צור סניף חדש</button></li>
          </ul>
        </aside>

      </main>

      <section style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <h3>זיהוי אוטומטי</h3>
        <p>
          הפונקציה תסרוק את המסמך ותזהה מקורות, בעיות ניסוח, אזכורים לא עקביים ועוד.
          תוצאות הזיהוי יופיעו כאן.
        </p>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>
              עזרה והגדרות
            </Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>
              תנאי שימוש
            </div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AcademicWriting;
