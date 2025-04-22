import React, { useState } from "react";
import PageHeader from "../PageHeader";

function SummaryLibrary() {
  const [hasUploaded] = useState(false);
  const summaries = [
    { title: "מבוא לסטטיסטיקה", locked: false },
    { title: "פסיכולוגיה חברתית", locked: false },
    { title: "אלגוריתמים", locked: true },
    { title: "אלגברה לינארית", locked: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />
    
      <header style={{ textAlign: "center" }}>
        <h1>ספריית סיכומים</h1>
        <p>כאן תוכל לחפש ולצפות בסיכומים</p>
      </header>

      {/* חיפוש */}
      <section style={{ marginTop: "1rem" }}>
        <input type="text" placeholder="חפש סיכום..." style={{ width: "100%", padding: "0.5rem" }} />
      </section>

      {/* סיכומים */}
      <main style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {summaries.map((s, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "100px" }}>
            <p>{s.title}</p>
            {s.locked && !hasUploaded && <p>[נעול – העלה סיכום כדי לפתוח]</p>}
          </div>
        ))}
      </main>

      {/* הודעה אם לא הועלה סיכום */}
      {!hasUploaded && (
        <section style={{ marginTop: "2rem", border: "1px dashed gray", padding: "1rem", textAlign: "center" }}>
          <h3>גישה מוגבלת</h3>
          <p>כדי לצפות בכל הסיכומים עליך להעלות לפחות אחד.</p>
          <button onClick={() => alert("מעבר למסך העלאה")}>העלה סיכום</button>
        </section>
      )}

      {/* כפתור קבוע */}
      <div style={{ position: "fixed", bottom: "1rem", left: "1rem" }}>
        <button onClick={() => alert("העלה סיכום")}>+ העלה סיכום</button>
      </div>

      <footer style={{ marginTop: "auto", textAlign: "center", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <p>עזרה והגדרות | תנאי שימוש | מדיניות פרטיות</p>
      </footer>
    </div>
  );
}

export default SummaryLibrary;
