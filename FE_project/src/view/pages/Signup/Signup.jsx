import { useState } from "react";
import { Eye, EyeOff, Book } from "lucide-react";
import "./Signup.css";

const Signup = () => {
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
    console.log({ fullName, email, password, confirmPassword, studyField, institution, agreeTerms });
  };

  return (
    <div className="signup-page">
      <header className="page-header">
        <div className="brand-section">
          <a href="/" className="brand-name">סטודנט חכם</a>
        </div>
      </header>

      <div className="content-wrapper">
        <div className="registration-section">
          <div className="signup-form-card">
            <div className="form-wrapper">
              <div className="title-section">
                <h1>הרשמה למערכת לניהול לימודים שיתופית</h1>
                <p>צור חשבון חדש לגישה מלאה לאפליקציה</p>
              </div>
              
              <form onSubmit={handleSignup} className="registration-form">
                <div className="input-group">
                  <label htmlFor="fullName">שם מלא</label>
                  <input
                    id="fullName"
                    type="text"
                    dir="rtl"
                    placeholder="הזן את שמך המלא"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="text-field"
                  />
                </div>

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
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">אימות סיסמה</label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    placeholder="הזן את אותה הסיסמה שוב"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="text-field"
                  />
                </div>


                <div className="input-group">
                  <label htmlFor="study-field">תחום לימוד</label>
                  <select 
                    id="study-field"
                    value={studyField} 
                    onChange={(e) => setStudyField(e.target.value)}
                    className="dropdown-field"
                    dir="rtl"
                    required
                  >
                    <option value="">בחר תחום לימוד</option>
                    <option value="computer-science">מדעי המחשב</option>
                    <option value="engineering">הנדסה</option>
                    <option value="medicine">רפואה</option>
                    <option value="law">משפטים</option>
                    <option value="psychology">פסיכולוגיה</option>
                    <option value="business">מנהל עסקים</option>
                    <option value="social-sciences">מדעי החברה</option>
                    <option value="humanities">מדעי הרוח</option>
                    <option value="education">חינוך</option>
                    <option value="arts">אמנויות</option>
                    <option value="other">אחר</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="institution">מוסד לימודים</label>
                  <select 
                    id="institution"
                    value={institution} 
                    onChange={(e) => setInstitution(e.target.value)}
                    className="dropdown-field"
                    dir="rtl"
                    required
                  >
                    <option value="">בחר מוסד לימודים</option>
                    <option value="tel-aviv-university">אוניברסיטת תל אביב</option>
                    <option value="hebrew-university">האוניברסיטה העברית</option>
                    <option value="haifa-university">אוניברסיטת חיפה</option>
                    <option value="technion">הטכניון</option>
                    <option value="ben-gurion-university">אוניברסיטת בן גוריון</option>
                    <option value="bar-ilan-university">אוניברסיטת בר אילן</option>
                    <option value="reichman-university">אוניברסיטת רייכמן</option>
                    <option value="open-university">האוניברסיטה הפתוחה</option>
                    <option value="seminar-hakibbutzim">סמינר הקיבוצים</option>
                    <option value="levinsky-college">מכללת לוינסקי</option>
                    <option value="shenkar">שנקר</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
                
                <div className="terms-agreement">
                  <input 
                    id="agree-terms" 
                    type="checkbox"
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="agreement-checkbox"
                  />
                  <label htmlFor="agree-terms" className="agreement-text">
                    אני מסכים/ה ל<a href="/terms" className="policy-link">תנאי השימוש</a> ו<a href="/privacy" className="policy-link">מדיניות הפרטיות</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="register-button" 
                  disabled={!agreeTerms}
                >
                  הרשמה
                </button>
                
                <div className="email-notice">
                  ההרשמה מעידה על הסכמתך לקבלת דוא״ל בנושאים מלימודיים.
                </div>

                <div className="login-redirect">
                  <a href="/Login">
                    יש לך כבר חשבון? היכנס כאן
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="promotional-section">
          <div className="promo-content">
            <div className="promo-icon">
              <Book size={80} />
            </div>
            <div className="promo-message">
              <h2>הצטרף למאות סטודנטים</h2>
              <p>
                הצטרף לקהילה של סטודנטים ותיהנה מגישה לסיכומים, חומרי לימוד, וכלים שיעזרו לך להצליח בלימודים.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;