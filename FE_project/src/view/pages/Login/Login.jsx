import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { User } from "lucide-react";
import "./Login.css";

const Login = () => {
  return (
    <div className="custom-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <Link to="/" className="header-title">סטודנט חכם</Link>
        </div>
      </header>
      
      {/* Login Section */}
      <section className="login-section">
        <div className="login-card">
          <div className="login-icon-container">
            <User className="login-icon" />
          </div>
          <h2 className="login-title">התחברות</h2>
          
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">דואר אלקטרוני</label>
              <input type="email" id="email" className="form-input" placeholder="הכנס את הדואר האלקטרוני שלך" />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">סיסמה</label>
              <input type="password" id="password" className="form-input" placeholder="הכנס את הסיסמה שלך" />
            </div>
            
            <div className="form-actions">
              <Button className="login-button">התחברות</Button>
            </div>
          </form>
          
          <div className="login-footer">
            <p className="signup-text">אין לך חשבון עדיין?</p>
            <Link to="/signup" className="signup-link">
              <Button variant="outline" className="signup-button">הרשמה</Button>
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

export default Login;