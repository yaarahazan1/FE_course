import { useState } from "react";
import { Eye, EyeOff, User, Facebook } from "lucide-react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <header className="header-login">
        <div className="header-content-login">
          <a href="/" className="logo">סטודנט חכם</a>
        </div>
      </header>

      <div className="main-content">
        <div className="form-section">
          <div className="login-card">
            <div className="card-content">
              <div className="form-header">
                <h1>כניסה</h1>
                <p>ברוך שובך! נא להזין את פרטי הכניסה</p>
              </div>
              
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <label htmlFor="email">דוא״ל</label>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-field"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">סיסמה</label>
                  <div className="password-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      placeholder="הזן לפחות 8 תווים"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-field password-input"
                    />
                    <button 
                      type="button"
                      className="visibility-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-options">
                  <div className="remember-me">
                    <input 
                      id="remember-me" 
                      type="checkbox"
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox"
                    />
                    <label htmlFor="remember-me">זכור אותי</label>
                  </div>
                </div>
                
                <button type="submit" className="login-button">כניסה</button>
                
                <div className="divider">
                  <span>או כניסה עם</span>
                  <div className="line-under-text"></div>
                </div>
                
                <div className="social-buttons">
                  <button type="button" className="social-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button type="button" className="social-button">
                    <Facebook size={20} />
                  </button>
                  <button type="button" className="social-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                </div>
                
                <div className="signup-link">
                  <a href="/Signup">
                    אין לך חשבון? הירשם כאן
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="decorative-section">
          <div className="welcome-content">
            <div className="welcome-icon">
              <User size={80} />
            </div>
            <div className="welcome-text">
              <h2>ברוכים הבאים לסטודנט חכם</h2>
              <p>
                פלטפורמה חכמה המסייעת לך לנהל את הלימודים, ליצור ולשתף סיכומים, ולהתחבר עם סטודנטים אחרים למטרות למידה משותפת.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;