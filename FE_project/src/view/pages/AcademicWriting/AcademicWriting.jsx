import React, { useState } from "react";
import PageHeader from "../PageHeader";

function AcademicWriting() {
  const [documentType, setDocumentType] = useState("מאמר");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");

  const documentTypes = ["מאמר", "תזה", "סמינריון", "מסמך"];
  const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />

      {/* כותרת כללית */}
      <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1>כתיבה אקדמית</h1>
        <p>בחרי את סוג המסמך וסגנון הציטוט, כתבי את התוכן, ונהלי אותו באופן חכם</p>
      </header>

      {/* אזור בחירה של סוג מסמך וסגנון ציטוט */}
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={{ flex: "1 1 200px" }}>
          <label>סוג מסמך:</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <label>סגנון ציטוט:</label>
          <select value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            {citationStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </section>

      {/* אזור התוכן הראשי */}
      <main style={{ display: "flex", flexWrap: "wrap", gap: "2rem", flex: 1 }}>
        {/* אזור כתיבה */}
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

        {/* אפשרויות צד */}
        <aside style={{ flex: "1 1 250px", minWidth: "250px", border: "1px solid #ccc", padding: "1rem" }}>
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

      {/* זיהוי אוטומטי */}
      <section style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <h3>זיהוי אוטומטי</h3>
        <p>
          הפונקציה תסרוק את המסמך ותזהה מקורות, בעיות ניסוח, אזכורים לא עקביים ועוד.
          תוצאות הזיהוי יופיעו כאן.
        </p>
      </section>

      {/* פוטר */}
      <footer style={{ marginTop: "auto", textAlign: "center", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <p>עזרה והגדרות | תנאי שימוש | מדיניות פרטיות</p>
      </footer>
    </div>
  );
}

export default AcademicWriting;
