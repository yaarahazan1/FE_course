import { useState } from "react";
import { Eye, EyeOff, Book } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // ולידציה של סיסמה
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "הסיסמה חייבת להכיל לפחות 8 תווים";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) {
      return "הסיסמה חייבת להכיל אות גדולה, אות קטנה ומספר";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  console.log("=== התחלת תהליך הרשמה ===");
  console.log("Firebase auth object:", auth);
  console.log("Firebase db object:", db);

  // בדיקות ולידציה
  if (password !== confirmPassword) {
    setError("הסיסמאות אינן תואמות");
    setLoading(false);
    return;
  }

  const passError = validatePassword(password);
  if (passError) {
    setPasswordError(passError);
    setLoading(false);
    return;
  }

  console.log("נתוני הרשמה:");
  console.log("- דואל:", email);
  console.log("- שם מלא:", fullName);
  console.log("- תחום לימוד:", studyField);
  console.log("- מוסד:", institution);
  console.log("- אורך סיסמה:", password.length);

  try {
    console.log("🔥 מתחיל יצירת משתמש ב-Firebase Auth...");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("✅ משתמש נוצר בהצלחה!");
    console.log("- UID:", user.uid);
    console.log("- Email:", user.email);

    console.log("📝 מעדכן פרופיל...");
    await updateProfile(user, {
      displayName: fullName
    });
    console.log("✅ פרופיל עודכן בהצלחה!");

    console.log("💾 שומר נתונים ב-Firestore...");
    // הכנת האובייקט לשמירה
    const userData = {
      uid: user.uid,
      fullName: fullName,
      email: email,
      password: password,
      studyField: studyField,
      institution: institution,
      createdAt: serverTimestamp(),
      profileCompleted: true,
      isActive: true,
      isAdmin: false 
    };
    
    console.log("נתונים לשמירה:", userData);
    
    const userDocRef = doc(db, "users", user.uid);
    console.log("Document reference:", userDocRef);
    
    await setDoc(userDocRef, userData);
    console.log("✅ נתונים נשמרו בהצלחה ב-Firestore!");

    console.log("🎉 הרשמה הושלמה בהצלחה!");
    
    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (error) {
    console.error("❌ שגיאה בתהליך ההרשמה:");
    console.error("סוג השגיאה:", typeof error);
    console.error("שגיאה מלאה:", error);
    console.error("קוד שגיאה:", error.code);
    console.error("הודעת שגיאה:", error.message);
    
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    
    // הודעות שגיאה מפורטות
    let errorMessage = "";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "כתובת הדוא״ל כבר רשומה במערכת";
        break;
      case 'auth/invalid-email':
        errorMessage = "כתובת דוא״ל לא תקינה";
        break;
      case 'auth/weak-password':
        errorMessage = "הסיסמה חלשה מדי (נדרשים לפחות 6 תווים)";
        break;
      case 'auth/operation-not-allowed':
        errorMessage = "הרשמה עם דוא״ל וסיסמה לא מופעלת בקונסול Firebase";
        break;
      case 'auth/network-request-failed':
        errorMessage = "בעיית רשת - בדוק את החיבור לאינטרנט";
        break;
      case 'permission-denied':
        errorMessage = "אין הרשאה לשמור נתונים - בדוק הגדרות Firestore";
        break;
      case 'auth/invalid-api-key':
        errorMessage = "API Key לא תקין";
        break;
      case 'auth/app-deleted':
        errorMessage = "הפרויקט נמחק או לא קיים";
        break;
      default:
        errorMessage = `שגיאה לא מזוהה: ${error.code || 'לא ידוע'} - ${error.message}`;
    }
    
    console.error("הודעת שגיאה לתצוגה:", errorMessage);
    setError(errorMessage);
    
  } finally {
    setLoading(false);
    console.log("=== סיום תהליך הרשמה ===");
  }
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
              
              {error && (
                <div className="error-message" style={{
                  color: '#dc3545',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
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
                    disabled={loading}
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
                    disabled={loading}
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
                      onChange={handlePasswordChange}
                      required
                      className="text-field password-input"
                      disabled={loading}
                    />
                    <button 
                      type="button"
                      className="visibility-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {passwordError && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px'
                    }}>
                      {passwordError}
                    </div>
                  )}
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
                    disabled={loading}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px'
                    }}>
                      הסיסמאות אינן תואמות
                    </div>
                  )}
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
                    disabled={loading}
                  >
                    <option value="">בחר תחום לימוד</option>
                    <option value="מדעי המחשב">מדעי המחשב</option>
                    <option value="הנדסה">הנדסה</option>
                    <option value="רפואה">רפואה</option>
                    <option value="משפטים">משפטים</option>
                    <option value="פסיכולוגיה">פסיכולוגיה</option>
                    <option value="מנהל עסקים">מנהל עסקים</option>
                    <option value="מדעי החברה">מדעי החברה</option>
                    <option value="מדעי הרוח">מדעי הרוח</option>
                    <option value="חינוך">חינוך</option>
                    <option value="אמנויות">אמנויות</option>
                    <option value="אחר">אחר</option>
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
                    disabled={loading}
                  >
                    <option value="">בחר מוסד לימודים</option>
                    <option value="אוניברסיטת תל אביב">אוניברסיטת תל אביב</option>
                    <option value="האוניברסיטה העברית">האוניברסיטה העברית</option>
                    <option value="אוניברסיטת חיפה">אוניברסיטת חיפה</option>
                    <option value="הטכניון">הטכניון</option>
                    <option value="מכללת אונו">מכללת אונו</option>
                    <option value="אוניברסיטת בן גוריון">אוניברסיטת בן גוריון</option>
                    <option value="אוניברסיטת בר אילן">אוניברסיטת בר אילן</option>
                    <option value="אוניברסיטת רייכמן">אוניברסיטת רייכמן</option>
                    <option value="האוניברסיטה הפתוחה">האוניברסיטה הפתוחה</option>
                    <option value="סמינר הקיבוצים">סמינר הקיבוצים</option>
                    <option value="מכללת לוינסקי">מכללת לוינסקי</option>
                    <option value="שנקר">שנקר</option>
                    <option value="אפקה">אפקה</option>
                    <option value="אחר">אחר</option>
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
                    disabled={loading}
                  />
                  <label htmlFor="agree-terms" className="agreement-text">
                    אני מסכים/ה ל<a href="/terms" className="policy-link">תנאי השימוש</a> ו<a href="/privacy" className="policy-link">מדיניות הפרטיות</a>
                  </label>
                </div>
                
                <div className="email-notice">
                  ההרשמה מעידה על הסכמתך לקבלת דוא״ל בנושאים מלימודיים.
                </div>

                <button 
                  type="submit" 
                  className="register-button" 
                  disabled={!agreeTerms || loading || passwordError}
                  style={{
                    opacity: (!agreeTerms || loading || passwordError) ? 0.7 : 1,
                    cursor: (!agreeTerms || loading || passwordError) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? "נרשם..." : "הרשמה"}
                </button>
              
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