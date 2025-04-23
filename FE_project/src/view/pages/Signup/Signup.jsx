import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studyField, setStudyField] = useState("");
  const [institution, setInstitution] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    console.log({
      fullName,
      email,
      password,
      confirmPassword,
      studyField,
      institution,
      agreeTerms,
    });
  };

  return (
    <div style={{ minHeight: "100vh", direction: "rtl", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none" }}>
          סטודנט חכם
        </Link>
      </header>

      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "400px", border: "1px solid #ccc", padding: "2rem" }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>הרשמה</h1>
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>נא למלא את הפרטים ליצירת חשבון</p>

            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="fullName">שם מלא:</label>
                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="email">דוא"ל:</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="password">סיסמה:</label>
                <div style={{ position: "relative" }}>
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem", cursor: "pointer", color: "#555" }}>
                    {showPassword ? "הסתר" : "הצג"}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="confirmPassword">אימות סיסמה:</label>
                <input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }} />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="studyField">תחום לימוד:</label>
                <select id="studyField" value={studyField} onChange={(e) => setStudyField(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                  <option value="">בחר תחום לימוד</option>
                  <option value="cs">מדעי המחשב</option>
                  <option value="eng">הנדסה</option>
                  <option value="med">רפואה</option>
                  <option value="law">משפטים</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="institution">מוסד לימודים:</label>
                <select id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} required style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}>
                  <option value="">בחר מוסד</option>
                  <option value="hebrew">האוניברסיטה העברית</option>
                  <option value="ta">אוניברסיטת תל אביב</option>
                  <option value="tech">הטכניון</option>
                </select>
              </div>

              <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
                <label htmlFor="agreeTerms" style={{ marginRight: "0.5rem" }}>אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות</label>
              </div>

              <button type="submit" style={{ width: "100%", padding: "0.75rem", marginTop: "1.5rem" }} disabled={!agreeTerms}>
                הרשמה
              </button>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Link to="/login">כבר יש לך חשבון? התחבר כאן</Link>
              </div>
            </form>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#eee", margin: "0 auto 1.5rem" }}></div>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>הצטרפו למאות סטודנטים</h2>
            <p>ניהול לימודים, סיכומים, וחיבור עם סטודנטים אחרים.</p>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "2rem 1rem", borderTop: "1px solid #ccc" }}>
        <Link to="/help-settings" style={{ margin: "0 1rem" }}>עזרה והגדרות</Link>
        <span style={{ margin: "0 1rem" }}>תנאי שימוש</span>
        <span style={{ margin: "0 1rem" }}>מדיניות פרטיות</span>
      </footer>
    </div>
  );
}

export default Signup;
