import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { HelpCircle, Settings, BarChart } from "lucide-react";
import "./HelpSettings.css";

const HelpSettings = () => {
  return (
    <div className="help-container">
      {/* Header/Navbar */}
      <header className="help-header">
        <div className="header-left">
          <span className="header-title">סטודנט חכם - עזרה והגדרות</span>
        </div>
        <div className="header-right">
          <Link to="/">
            <Button variant="outline" className="home-button">
              <BarChart className="icon-chart" />
              חזרה לדף הבית
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Help and Settings Content */}
      <section className="help-section">
        <h1 className="help-title">עזרה והגדרות</h1>
        <p className="help-description">
          מרכז התמיכה והגדרות חשבון למערכת סטודנט חכם
        </p>
        
        <div className="help-panel">
          {/* Help Card */}
          <div className="help-card">
            <div className="help-card-header">
              <HelpCircle className="help-icon" />
              <h3 className="help-card-title">עזרה ותמיכה</h3>
            </div>
            <div className="help-card-content">
              <ul className="help-list">
                <li className="help-list-item">שאלות נפוצות</li>
                <li className="help-list-item">מדריכי שימוש</li>
                <li className="help-list-item">יצירת קשר עם התמיכה</li>
                <li className="help-list-item">דיווח על תקלה</li>
              </ul>
              <div className="help-actions">
                <Button variant="outline" size="sm" className="help-button">
                  מעבר לעזרה
                </Button>
              </div>
            </div>
          </div>
          
          {/* Settings Card */}
          <div className="help-card">
            <div className="help-card-header">
              <Settings className="help-icon" />
              <h3 className="help-card-title">הגדרות חשבון</h3>
            </div>
            <div className="help-card-content">
              <ul className="help-list">
                <li className="help-list-item">פרטי חשבון</li>
                <li className="help-list-item">הגדרות פרטיות</li>
                <li className="help-list-item">התראות והודעות</li>
                <li className="help-list-item">החלפת סיסמה</li>
              </ul>
              <div className="help-actions">
                <Button variant="outline" size="sm" className="help-button">
                  עריכת הגדרות
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="help-footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/" className="footer-link">
              דף הבית
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

export default HelpSettings;