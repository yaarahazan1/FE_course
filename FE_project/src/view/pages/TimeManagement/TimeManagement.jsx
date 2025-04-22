import React from "react";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";

function TimeManagement() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PageHeader />

      {/* כותרת עמוד */}
      <header style={{ textAlign: "center", padding: "1rem" }}>
        <h1>ניהול זמנים</h1>
        <p>נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים בצורה חכמה ויעילה</p>
      </header>

      {/* תוכן עיקרי */}
      <div style={{ display: "flex", flex: 1, gap: "1rem", padding: "1rem", flexWrap: "wrap" }}>
        {/* צד שמאל - פרופיל + הצעות למידה באותו קו */}
        <aside style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {/* פרופיל */}
            <section style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "#ccc", borderRadius: "50%", margin: "0 auto" }}>
                <p style={{ fontSize: "12px" }}>פרופיל</p>
              </div>
              <p><strong>יעל כהן</strong></p>
              <p>מדעי ההתנהגות</p>
            </section>

            {/* הצעות למידה */}
            <section style={{ flex: 2 }}>
              <h2>הצעות למידה</h2>
              <p>[רשימת משימות מוצעת]</p>
            </section>
          </div>
        </aside>

        {/* צד ימין - לוח שנה + משימות קרובות */}
        <main style={{ flex: "3 1 600px", minWidth: "300px" }}>
          {/* לוח שנה */}
          <section>
            <h2>לוח שנה</h2>
            <p>[כאן יוצג תצוגת חודש או שבוע]</p>
          </section>

          {/* משימות קרובות */}
          <section style={{ marginTop: "2rem" }}>
            <h2>משימות קרובות</h2>
            <p>[רשימת משימות קרובות]</p>
            <Link to="/AddTask">
              <button >הוסף משימה</button>
            </Link>
          </section>
        </main>
      </div>

      {/* פוטר */}
      <footer style={{
        marginTop: "auto",
        textAlign: "center",
        padding: "1rem",
        borderTop: "1px solid #ccc"
      }}>
        <p>עזרה והגדרות | תנאי שימוש | מדיניות פרטיות</p>
      </footer>
    </div>
  );
}

export default TimeManagement;
