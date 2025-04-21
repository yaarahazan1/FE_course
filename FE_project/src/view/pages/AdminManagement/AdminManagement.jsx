import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Users, BarChart } from "lucide-react";
import "./AdminManagement.css";

const AdminManagement = () => {
  return (
    <div className="admin-container">
      {/* Header/Navbar */}
      <header className="admin-header">
        <div className="header-left">
          <span className="header-title">סטודנט חכם - ניהול מנהלים</span>
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
      
      {/* Admin Management Content */}
      <section className="admin-section">
        <h1 className="admin-title">ניהול מנהלים</h1>
        <p className="admin-description">
          מערכת לניהול הרשאות וחשבונות מנהלים במערכת סטודנט חכם
        </p>
        
        <div className="admin-panel">
          <div className="admin-card">
            <div className="admin-card-header">
              <Users className="admin-icon" />
              <h3 className="admin-card-title">רשימת מנהלים</h3>
            </div>
            <div className="admin-card-content">
              <p className="admin-card-description">
                צפייה וניהול של חשבונות מנהלים קיימים במערכת
              </p>
              <div className="admin-actions">
                <Button variant="outline" size="sm" className="admin-button">
                  צפייה ברשימה
                </Button>
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <div className="admin-card-header">
              <Users className="admin-icon" />
              <h3 className="admin-card-title">הוספת מנהל חדש</h3>
            </div>
            <div className="admin-card-content">
              <p className="admin-card-description">
                יצירת חשבון מנהל חדש והגדרת הרשאות
              </p>
              <div className="admin-actions">
                <Button variant="outline" size="sm" className="admin-button">
                  הוספת מנהל
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="admin-footer">
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

export default AdminManagement;