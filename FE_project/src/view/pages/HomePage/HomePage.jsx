import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles.module.css"; 
import AdminBadge from "../AdminManagement/AdminBadge"

const HomePage = () => {
  return (
    <div style={{ minHeight: "100vh", direction: "rtl", display: "flex", flexDirection: "column" }}>
    <header style={{
      backgroundColor: "#fff",
      borderBottom: "1px solid #ccc",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <AdminBadge />
        <span style={{ fontWeight: "bold", fontSize: "1.2rem"}}>
        סטודנט חכם
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link to="/dashboard">
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", backgroundColor: "#fff" }}>
            לוח מחוונים
          </button>
        </Link>
        <Link to="/login">
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", backgroundColor: "#fff" }}>
            כניסה / הרשמה
          </button>
        </Link>
      </div>
    </header>

    <section style={{
      padding: "2rem 1rem",
      textAlign: "center",
      borderBottom: "1px solid #eee"
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>סטודנט חכם</h1>
      <p style={{ marginBottom: "0.5rem" }}>
        נהל את הלימודים שלך בצורה חכמה - גישה מהירה לסיכומים, משימות ולוח זמנים מותאם אישית
      </p>
      <p>
        המערכת עוזרת לך לארגן את הלימודים שלך, לשתף סיכומים, לעקוב אחרי משימות והגשות לוח זמנים מותאם לסיכומים והחומרים האישיים שלך.
      </p>
    </section>

    <section style={{ padding: "2rem 1rem", backgroundColor: "#fafafa" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {[
          { title: "ניהול לוח זמנים", desc: "סדר את לוח הזמנים שלך עם כל מה שמרכיב את היום שלך וצור את לוח הזמנים החכם", to: "/TimeManagement" },
          { title: "ספריית סיכומים", desc: "גישה מהירה לספריית הסיכומים שלך, למידה משותפת וסיכומים מאורגנים", to: "/SummaryLibrary" },
          { title: "ניהול משימות ופרויקטים", desc: "עקוב אחרי משימות, הבנת מה יש לסיים ופרויקטים עם צ׳אט קבוצתי והתראות", to: "/CourseManagement" },
          { title: "כלי לכתיבה אקדמית", desc: "כתיבת עבודות וסיכומים עם ציטוטים אקדמיים מובנים", to: "/AcademicWriting" },
          { title: "רשת חברתית לסטודנטים", desc: "התחברי לפי קורסים ותחומי לימודים וקבלי סיכומים", to: "/SocialNetwork" },
        ].map((item, index) => (
          <div key={index} style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#fff",
            padding: "1rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem" }}>{item.desc}</p>
            </div>
            <Link to={item.to} style={{ marginTop: "1rem" }}>
              <button style={{ padding: "0.4rem 0.8rem", border: "1px solid #ccc", backgroundColor: "#fff", width: "100%" }}>
                למעבר
              </button>
            </Link>
          </div>
        ))}
      </div>
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
};

export default HomePage;
