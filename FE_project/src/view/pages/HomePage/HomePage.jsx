import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import AdminBadge from "../AdminBadge/AdminBadge";
import "../../../styles/styles.css";

const HomePage = () => {
  return (
    <div className="pageWrapper">
      <header className="header">
        <div className="logoContainer">
          <AdminBadge />
          <span className="logoText">סטודנט חכם</span>
        </div>
        <div className="navButtons">
          <Link to="/dashboard">
            <button className="navButton">לוח מחוונים</button>
          </Link>
          <Link to="/login">
            <button className="navButton">כניסה</button>
          </Link>
        </div>
      </header>

      <section className="introSection">
        <h1 className="mainTitle">סטודנט חכם</h1>
        <p className="info" style={{ marginBottom: "1rem"}}>נהל את הלימודים שלך בצורה חכמה - גישה מהירה לסיכומים, משימות ולוח זמנים מותאם אישית</p>
        <p className="info">המערכת עוזרת לך לארגן את הלימודים שלך, לשתף סיכומים, לעקוב אחרי משימות והגשות לוח זמנים מותאם לסיכומים והחומרים האישיים שלך.</p>
      </section>

      <section className="cardsSection">
        <div className="cardsGrid">
          {[
            { title: "ניהול לוח זמנים", desc: "סדר את לוח הזמנים שלך עם כל מה שמרכיב את היום שלך וצור את לוח הזמנים החכם", to: "/TimeManagement" },
            { title: "ספריית סיכומים", desc: "גישה מהירה לספריית הסיכומים שלך, למידה משותפת וסיכומים מאורגנים", to: "/SummaryLibrary" },
            { title: "ניהול משימות ופרויקטים", desc: "עקוב אחרי משימות, הבנת מה יש לסיים ופרויקטים עם צ׳אט קבוצתי והתראות", to: "/CourseManagement" },
            { title: "כלי לכתיבה אקדמית", desc: "כתיבת עבודות וסיכומים עם ציטוטים אקדמיים מובנים", to: "/AcademicWriting" },
            { title: "רשת חברתית לסטודנטים", desc: "התחברי לפי קורסים ותחומי לימודים וקבלי סיכומים", to: "/SocialNetwork" },
          ].map((item, index) => (
            <div key={index} className="card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <Link to={item.to} style={{ marginTop: "1rem" }}>
                <button className="cardButton">למעבר</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
