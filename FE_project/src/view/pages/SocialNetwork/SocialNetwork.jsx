import { Link } from "react-router-dom";
import "./SocialNetwork.css";

const SocialNetwork = () => {
  return (
    <div className="social-network-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <span className="header-title">סטודנט חכם</span>
        </div>
        <div className="header-right">
          <Link to="/" className="home-link">
            <button className="custom-button">
              דף הבית
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="social-network-content">
        <h1 className="page-title">רשת חברתית לסטודנטים</h1>
        
        <div className="search-section">
          <input type="text" className="search-input" placeholder="חפש סטודנטים או קורסים..." />
          <button className="search-button">חפש</button>
        </div>
        
        <div className="network-sections">
          <div className="network-section">
            <h2 className="section-title">קורסים פופולריים</h2>
            <div className="courses-list">
              <div className="course-card">
                <h3 className="course-title">מבוא למדעי המחשב</h3>
                <p className="course-members">124 סטודנטים</p>
                <button className="join-button">הצטרף</button>
              </div>
              <div className="course-card">
                <h3 className="course-title">סטטיסטיקה</h3>
                <p className="course-members">87 סטודנטים</p>
                <button className="join-button">הצטרף</button>
              </div>
              <div className="course-card">
                <h3 className="course-title">אלגברה לינארית</h3>
                <p className="course-members">105 סטודנטים</p>
                <button className="join-button">הצטרף</button>
              </div>
            </div>
          </div>
          
          <div className="network-section">
            <h2 className="section-title">קבוצות לימוד</h2>
            <div className="groups-list">
              <div className="group-card">
                <h3 className="group-title">קבוצת תכנות מתקדם</h3>
                <p className="group-description">לימוד משותף וחילופי ידע בתכנות</p>
                <div className="group-actions">
                  <button className="join-button">הצטרף לקבוצה</button>
                </div>
              </div>
              <div className="group-card">
                <h3 className="group-title">קבוצת הכנה למבחנים</h3>
                <p className="group-description">הכנה משותפת למבחנים וחילופי חומרי לימוד</p>
                <div className="group-actions">
                  <button className="join-button">הצטרף לקבוצה</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">
              עזרה והגדרות
            </Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">
              תנאי שימוש
            </div>
            <span className="footer-separator">|</span>
            <div className="footer-item">
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialNetwork;