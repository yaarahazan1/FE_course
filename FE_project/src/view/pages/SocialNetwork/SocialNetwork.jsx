import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SocialNetwork.css";
import "../../../styles/styles.css";
import PageHeader from "../PageHeader";

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
      attachment: { name: "סיכום.pdf", size: "2.3 מגהבייט" },
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
    <div className="social-container">
      <PageHeader/>
      <header>
        <h2>רשת חברתית לסטודנטים</h2>
      </header>

      <div className="social-search">
        <input
          type="text"
          placeholder="חיפוש..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="social-layout">
        <aside className="social-sidebar">
          <div className="profile-card">
            <div className="avatar">ש"כ</div>
            <h3>שירה כהן</h3>
            <p>מדעי המחשב</p>
            <p className="label">סטודנטית שנה ג'</p>
            <hr />
            <div className="links">
              <div>פרופיל</div>
              <div>חברים</div>
              <div>הודעות</div>
              <div>התראות</div>
              <div>קבוצות לימוד</div>
            </div>
          </div>

          <div className="events-card">
            <h3>אירועים קרובים</h3>
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong><br />
                  {event.date} {event.time && `- ${event.time}`}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="social-main">
          <section className="post-creator">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="מה חדש אצלך?"
            />
            <div className="post-options">
              <label>
                📎 העלאת קובץ
                <input type="file" onChange={handleFileChange} hidden />
              </label>
              <button>תמונה</button>
              <button>אירוע</button>
              <button>פרסם</button>
            </div>
            {selectedFile && (
              <div className="file-info">
                נבחר: {selectedFile.name}
                <button onClick={removeSelectedFile}>❌ הסר</button>
              </div>
            )}
          </section>

          {posts
            .filter((p) => p.author.includes(searchTerm) || p.content.includes(searchTerm))
            .map((post) => (
              <div key={post.id} className="post-card">
                <p><strong>{post.author}</strong> • {post.role}</p>
                <p>{post.content}</p>
                {post.attachment && (
                  <div>📄 {post.attachment.name} ({post.attachment.size})</div>
                )}
                <div className="post-footer">
                  <span>❤️ {post.likes} | 💬 {post.comments}</span>
                  <button>🔗 שתף</button>
                </div>
              </div>
            ))}
        </main>
      </div>

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
};

export default SocialNetwork;
