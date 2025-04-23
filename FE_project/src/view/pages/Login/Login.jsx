import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <Link to="/" className="login-brand">סטודנט חכם</Link>
      </header>

      <div className="login-main">
        <div className="login-form-wrapper">
          <div className="login-form-box">
            <h1 className="login-title">היכנס</h1>
            <p className="login-subtitle">נא להזין את פרטי הכניסה</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">דוא״ל:</label>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">סיסמה:</label>
                  <Link to="/forgot-password" className="forgot-link">שכחת סיסמה?</Link>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  dir="rtl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן סיסמה"
                  required
                />
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">זכור אותי</label>
                </div>
              </div>

              <button type="submit" className="login-btn">כניסה</button>

              <div className="login-divider">או כניסה עם</div>

              <div className="social-buttons">
                <button type="button">Apple</button>
                <button type="button">Facebook</button>
                <button type="button">Google</button>
              </div>

              <div className="signup-link">
                <Link to="/Signup">אין לך חשבון? הירשם כאן</Link>
              </div>
            </form>
          </div>
        </div>

        <div className="login-sidebox">
          <div className="login-side-content">
            <div className="avatar-placeholder"></div>
            <h2 className="side-title">ברוכים הבאים לסטודנט חכם</h2>
            <p>פלטפורמה לניהול לימודים, שיתוף סיכומים וחיבור עם סטודנטים אחרים.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
