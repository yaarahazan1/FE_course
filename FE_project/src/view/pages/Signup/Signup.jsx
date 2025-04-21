import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { UserPlus } from "lucide-react";
import "./Signup.css";

const Signup = () => {
  return (
    <div className="custom-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <Link to="/" className="header-title">סטודנט חכם</Link>
        </div>
      </header>
      
      {/* Signup Section */}
      <section className="signup-section">
        <div className="signup-card">
          <div className="signup-icon-container">
            <UserPlus className="signup-icon" />
          </div>
          <h2 className="signup-title">הרשמה</h2>
          
          <form className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">שם פרטי</label>
                <input type="text" id="firstName" className="form-input" placeholder="שם פרטי" />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">שם משפחה</label>
                <input type="text" id="lastName" className="form-input" placeholder="שם משפחה" />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">דואר אלקטרוני</label>
              <input type="email" id="email" className="form-input" placeholder="הכנס את הדואר האלקטרוני שלך" />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">סיסמה</label>
              <input type="password" id="password" className="form-input" placeholder="בחר סיסמה" />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">אימות סיסמה</label>
              <input type="password" id="confirmPassword" className="form-input" placeholder="אמת את הסיסמה שלך" />
            </div>
            
            <div className="form-actions">
              <Button className="signup-button">הרשמה</Button>
            </div>
          </form>
          
          <div className="signup-footer">
            <p className="login-text">כבר יש לך חשבון?</p>
            <Link to="/login" className="login-link">
              <Button variant="outline" className="login-button">התחברות</Button>
            </Link>
          </div>
        </div>
      </section>
      
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

export default Signup;