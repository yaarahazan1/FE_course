import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Home, AlertTriangle } from "lucide-react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      {/* Header/Navbar */}
      <header className="notfound-header">
        <div className="header-left">
          <span className="header-title">סטודנט חכם</span>
        </div>
      </header>
      
      {/* Not Found Content */}
      <section className="notfound-section">
        <div className="notfound-content">
          <AlertTriangle className="notfound-icon" />
          <h1 className="notfound-title">404</h1>
          <h2 className="notfound-subtitle">הדף לא נמצא</h2>
          <p className="notfound-description">
            מצטערים, הדף שחיפשת אינו קיים או שהוסר מהמערכת.
          </p>
          <Link to="/">
            <Button variant="outline" className="home-button">
              <Home className="icon-home" />
              חזרה לדף הבית
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="notfound-footer">
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

export default NotFound;