import React from "react";

function SocialNetwork() {
  const posts = [
    {
      author: "רחל לוי",
      time: "לפני שעתיים",
      content: "שיתפתי את סיכומי השיעור האחרון בנושא דיפרנציאליים...",
    },
    {
      author: "יואב שמעון",
      time: "לפני 5 שעות",
      content: "מישהו משתתף בסדנת לימוד לקראת המבחן?",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <header>
        <h1>רשת חברתית</h1>
      </header>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flex: 1, flexWrap: "wrap" }}>
        {/* Sidebar */}
        <aside style={{ flex: "1 1 250px", minWidth: "250px" }}>
          <section>
            <h2>פרופיל</h2>
            <p>[שם משתמש]</p>
          </section>
          <section style={{ marginTop: "1rem" }}>
            <h3>אירועים קרובים</h3>
            <ul>
              <li>בחינת אמצע בפיזיקה - היום</li>
              <li>הגשת עבודה במתמטיקה - 15 ביוני</li>
            </ul>
          </section>
        </aside>

        {/* Main content */}
        <main style={{ flex: "3 1 600px", minWidth: "300px" }}>
          {/* טופס פוסט */}
          <section>
            <h2>הוספת פוסט</h2>
            <textarea placeholder="כתוב משהו..." rows="3" style={{ width: "100%" }} />
            <button onClick={() => alert("הוספת פוסט")}>פרסם</button>
          </section>

          {/* פיד */}
          <section style={{ marginTop: "2rem" }}>
            <h2>פיד פוסטים</h2>
            {posts.map((post, index) => (
              <div key={index} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p><strong>{post.author}</strong> – {post.time}</p>
                <p>{post.content}</p>
              </div>
            ))}
          </section>
        </main>
      </div>

      <footer style={{ marginTop: "auto", textAlign: "center", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <p>עזרה והגדרות | תנאי שימוש | מדיניות פרטיות</p>
      </footer>
    </div>
  );
}

export default SocialNetwork;
