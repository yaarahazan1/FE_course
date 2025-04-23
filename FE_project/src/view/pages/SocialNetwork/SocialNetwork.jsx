import React, { useState } from "react";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles.module.css";
import { Heart, MessageSquare, Share, Paperclip, ImageIcon, Calendar } from "lucide-react";

const SocialNetwork = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");

  const events = [
    { id: 1, title: "בחינת אמצע בפיזיקה", date: "היום", time: "14:00" },
    { id: 2, title: "הגשת עבודה במתמטיקה", date: "15 ביוני, 2025", time: "" },
  ];

  const posts = [
    {
      id: 1,
      author: "רחל לוי",
      role: "לפני שעתיים",
      content: "שיתפתי את סיכומי השיעור האחרון בנושא דיפרנציאליים...",
      likes: 24,
      comments: 8,
      attachment: {
        name: "סיכום_מבוא_מתמטי_שיעור_12_רביעי.pdf",
        size: "2.3 מגהבייט",
      },
    },
    {
      id: 2,
      author: "יואב שמעון",
      role: "לפני 5 שעות",
      content: "מישהו משתתף בסדנת לימוד לקראת המבחן באלגוריתמים?",
      likes: 15,
      comments: 12,
      attachment: null,
    },
  ];

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem", direction: "rtl" }}>
      <PageHeader />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>רשת חברתית לסטודנטים</h1>
        <input
          type="text"
          placeholder="חיפוש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
        <div style={{ flex: "1", maxWidth: "300px" }}>
          <div style={{ border: "1px solid #ccc", padding: "1.5rem", marginBottom: "1rem", textAlign: "center", borderRadius: "8px" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              margin: "0 auto 1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.25rem"
            }}>
              ש"כ
            </div>
            <h3 style={{ margin: "0", fontSize: "1.1rem" }}>שירה כהן</h3>
            <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#777" }}>מדעי המחשב</p>
            <div style={{
              display: "inline-block",
              backgroundColor: "#eee",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
              marginBottom: "1rem"
            }}>
              סטודנטית שנה ג'
            </div>
            <hr style={{ margin: "1rem 0" }} />
            <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
              <div style={{ marginBottom: "0.5rem", cursor: "pointer" }}>פרופיל</div>
              <div style={{ marginBottom: "0.5rem", cursor: "pointer" }}>חברים</div>
              <div style={{ marginBottom: "0.5rem", cursor: "pointer" }}>הודעות</div>
              <div style={{ marginBottom: "0.5rem", cursor: "pointer" }}>התראות</div>
              <div style={{ cursor: "pointer" }}>קבוצות לימוד</div>
            </div>
          </div>


          <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
            <h3>אירועים קרובים</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {events.map((event) => (
                <li key={event.id} style={{ marginBottom: "0.75rem" }}>
                  <strong>{event.title}</strong><br />
                  {event.date} {event.time && `- ${event.time}`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ flex: "3" }}>
          <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="מה חדש אצלך?"
                style={{ flex: 1, height: "80px", padding: "0.5rem" }}
              />
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "0.5rem",
              gap: "1rem"
            }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ cursor: "pointer" }}>
                  <Paperclip /> העלאת קובץ
                  <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
                </label>
                <button><ImageIcon /> הוספת תמונה</button>
                <button><Calendar /> הוספת אירוע</button>
              </div>

              <button style={{ height: "40px" }}>פרסם</button>
            </div>


            {selectedFile && (
              <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                נבחר: {selectedFile.name}{" "}
                <button onClick={removeSelectedFile} style={{ marginRight: "1rem" }}>❌ הסר</button>
              </div>
            )}
          </div>

          {posts
            .filter((p) => p.author.includes(searchTerm) || p.content.includes(searchTerm))
            .map((post) => (
              <div key={post.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p><strong>{post.author}</strong> • {post.role}</p>
                <p style={{ margin: "0.5rem 0" }}>{post.content}</p>
                {post.attachment && (
                  <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    📎 {post.attachment.name} ({post.attachment.size})
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginTop: "0.5rem", color: "#555" }}>
                  <span>❤️ {post.likes} לייקים | 💬 {post.comments} תגובות</span>
                  <button style={{ fontSize: "1rem" }}><Share/>שתף</button>
                </div>

              </div>
            ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>עזרה והגדרות</Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>תנאי שימוש</div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialNetwork;
