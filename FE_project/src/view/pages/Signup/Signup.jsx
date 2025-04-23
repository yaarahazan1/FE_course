import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

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
    <div className="signup-container">
      <header className="signup-header">
        <Link to="/" className="logo">סטודנט חכם</Link>
      </header>

      <div className="signup-body">
        <div className="signup-form-section">
          <form className="signup-form" onSubmit={handleSignup}>
            <h1>הרשמה</h1>
            <p>נא למלא את הפרטים ליצירת חשבון</p>

            <label>שם מלא:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

            <label>דוא"ל:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>סיסמה:</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? "הסתר" : "הצג"}
              </span>
            </div>

            <label>אימות סיסמה:</label>
            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <label>תחום לימוד:</label>
            <select value={studyField} onChange={(e) => setStudyField(e.target.value)} required>
              <option value="">בחר תחום לימוד</option>
              <option value="cs">מדעי המחשב</option>
              <option value="eng">הנדסה</option>
              <option value="med">רפואה</option>
              <option value="law">משפטים</option>
            </select>

            <label>מוסד לימודים:</label>
            <select value={institution} onChange={(e) => setInstitution(e.target.value)} required>
              <option value="">בחר מוסד</option>
              <option value="hebrew">האוניברסיטה העברית</option>
              <option value="ta">אוניברסיטת תל אביב</option>
              <option value="tech">הטכניון</option>
            </select>

            <div className="terms">
              <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
              <label>אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות</label>
            </div>

            <button type="submit" disabled={!agreeTerms}>הרשמה</button>

            <div className="login-link">
              <Link to="/login">כבר יש לך חשבון? התחבר כאן</Link>
            </div>
          </form>
        </div>

        <div className="signup-side">
          <div className="side-content">
            <div className="side-image"></div>
            <h2>הצטרפו למאות סטודנטים</h2>
            <p>ניהול לימודים, סיכומים, וחיבור עם סטודנטים אחרים.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
