import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div style={{ minHeight: "100vh", direction: "rtl", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none" }}>
          סטודנט חכם
        </Link>
      </header>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        {/* Form section */}
        <div style={{ flex: "1 1 400px", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "400px", border: "1px solid #ccc", padding: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>היכנס</h1>
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>נא להזין את פרטי הכניסה</p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email">דוא״ל:</label>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="password">סיסמה:</label>
                  <Link to="/forgot-password" style={{ fontSize: "0.9rem" }}>שכחת סיסמה?</Link>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן סיסמה"
                  required
                  style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                />
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" style={{ marginRight: "0.5rem" }}>זכור אותי</label>
                </div>
              </div>

              <button type="submit" style={{ width: "100%", padding: "0.75rem", marginTop: "1rem" }}>
                כניסה
              </button>

              <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                <span>או כניסה עם</span>
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
                <button type="button">Apple</button>
                <button type="button">Facebook</button>
                <button type="button">Google</button>
              </div>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Link to="/Signup">אין לך חשבון? הירשם כאן</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Informational side (optional on wide screens) */}
        <div style={{ flex: "1 1 400px", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#eee", margin: "0 auto 1.5rem" }}>
              {/* מקום לאייקון */}
            </div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>ברוכים הבאים לסטודנט חכם</h2>
            <p>
              פלטפורמה לניהול לימודים, שיתוף סיכומים וחיבור עם סטודנטים אחרים.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "2rem 1rem", borderTop: "1px solid #ccc" }}>
        <Link to="/help-settings" style={{ margin: "0 1rem" }}>עזרה והגדרות</Link>
        <span style={{ margin: "0 1rem" }}>תנאי שימוש</span>
        <span style={{ margin: "0 1rem" }}>מדיניות פרטיות</span>
      </footer>
    </div>
  );
};

export default Login;
