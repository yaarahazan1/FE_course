import { useState, useEffect } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  
  const navigate = useNavigate();

  // האזנה לשינויים באימות המשתמש
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && emailSent) {
        console.log("משתמש התחבר אחרי איפוס סיסמה:", user.email);
        
        // כאן אנחנו יודעים שהמשתמש רק עכשיו איפס את הסיסמה
        // אבל אנחנו לא יכולים לדעת מה הסיסמה החדשה
        // לכן נעדכן רק מטאדטה
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            passwordResetCompletedAt: new Date(),
            lastLogin: new Date(),
            lastPasswordResetEmail: emailSent,
            // הסרנו את עדכון השדה password כי אין לנו גישה לסיסמה החדשה
            passwordLastChanged: new Date() // שדה חדש לעקוב אחרי מתי הסיסמה שונתה
          });
          console.log("מידע המשתמש עודכן אחרי איפוס סיסמה");
        } catch (error) {
          console.error("שגיאה בעדכון מטאדטה של המשתמש:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [emailSent]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // הגדרות מתקדמות לאימייל איפוס הסיסמה
      const actionCodeSettings = {
        // URL שאליו המשתמש יוכוון אחרי איפוס הסיסמה
        url: window.location.origin + '/Login?passwordReset=true',
        handleCodeInApp: false,
      };

      // שליחת אימייל איפוס סיסמה
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setSuccess(true);
      setEmailSent(email);
      console.log("אימייל איפוס סיסמה נשלח בהצלחה לכתובת:", email);
      
      // שמירת מידע על בקשת איפוס הסיסמה
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            passwordResetRequestedAt: new Date(),
            passwordResetEmail: email,
            passwordResetStatus: "email-sent"
          });
          console.log("בקשת איפוס סיסמה נרשמה בבסיס הנתונים");
        }
      } catch (dbError) {
        console.error("שגיאה בעדכון בסיס הנתונים:", dbError);
      }
      
    } catch (error) {
      console.error("שגיאה בשליחת אימייל איפוס סיסמה:", error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError("כתובת דוא״ל זו לא רשומה במערכת");
          break;
        case 'auth/invalid-email':
          setError("כתובת דוא״ל לא תקינה");
          break;
        case 'auth/too-many-requests':
          setError("יותר מדי בקשות. נסה שוב מאוחר יותר");
          break;
        case 'auth/network-request-failed':
          setError("בעיית רשת. בדוק את החיבור לאינטרנט");
          break;
        default:
          setError("שגיאה בשליחת האימייל. נסה שוב מאוחר יותר");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/Login");
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError("");
    
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/Login?passwordReset=true',
        handleCodeInApp: false,
      };
      
      await sendPasswordResetEmail(auth, emailSent, actionCodeSettings);
      console.log("אימייל איפוס סיסמה נשלח שוב לכתובת:", emailSent);
      
      // עדכון זמן שליחה חוזרת
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", emailSent));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            passwordResetResentAt: new Date(),
            passwordResetStatus: "email-resent"
          });
        }
      } catch (dbError) {
        console.error("שגיאה בעדכון מידע שליחה חוזרת:", dbError);
      }
      
    } catch (error) {
      console.error("שגיאה בשליחה חוזרת של אימייל:", error);
      setError("שגיאה בשליחת האימייל. נסה שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <header className="header-forgot-password">
          <div className="header-content-forgot-password">
            <a href="/" className="logo">סטודנט חכם</a>
          </div>
        </header>

        <div className="main-content-forgot-pass">
          <div className="form-section">
            <div className="forgot-password-card">
              <div className="card-content">
                <div className="success-icon">
                  <CheckCircle size={64} color="#28a745" />
                </div>
                
                <div className="form-header">
                  <h1>אימייל נשלח בהצלחה!</h1>
                  <p>
                    שלחנו לך אימייל עם הוראות לאיפוס הסיסמה לכתובת:
                  </p>
                  <div className="email-sent">
                    <strong>{emailSent}</strong>
                  </div>
                </div>

                <div className="instructions-forgot-pass">
                  <h3>מה עליך לעשות עכשיו:</h3>
                  <ol className="steps-list">
                    <li>בדוק את תיבת הדוא״ל שלך (כולל תיקיית הספאם)</li>
                    <li>לחץ על הקישור באימייל</li>
                    <li>בחר סיסמה חדשה בדף של Firebase</li>
                    <li>חזור לעמוד הכניסה והתחבר עם הסיסמה החדשה</li>
                  </ol>
                  
                  <div className="info-note">
                    <p><strong>הערה חשובה:</strong> הסיסמה החדשה תישמר אוטומטית במערכת Firebase Authentication. השדה password בפרופיל שלך יעודכן רק כשתתחבר למערכת עם הסיסמה החדשה.</p>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <div className="action-buttons-forgot-pass">
                  <button 
                    type="button"
                    onClick={handleResendEmail}
                    className="resend-button"
                    disabled={loading}
                  >
                    {loading ? "שולח..." : "שלח שוב את האימייל"}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleBackToLogin}
                    className="back-button"
                  >
                    <ArrowRight size={18} />
                    חזור לעמוד הכניסה
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="decorative-section-forgot-pass">
            <div className="welcome-content">
              <div className="welcome-icon">
                <Mail size={80} />
              </div>
              <div className="welcome-text">
                <h2>איפוס סיסמה</h2>
                <p>
                  בעוד כמה דקות תקבל אימייל עם הוראות פשוטות לאיפוס הסיסמה שלך.
                  Firebase יטפל בכל השאר ויעדכן את הסיסמה החדשה במערכת.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <header className="header-forgot-password">
        <div className="header-content-forgot-password">
          <a href="/" className="logo">סטודנט חכם</a>
        </div>
      </header>

      <div className="main-content-forgot-pass">
        <div className="form-section">
          <div className="forgot-password-card">
            <div className="card-content">
              <div className="form-header">
                <h1>שכחת סיסמה?</h1>
                <p>הזן את כתובת הדוא״ל שלך ואנו נשלח לך קישור לאיפוס הסיסמה</p>
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleResetPassword} className="forgot-password-form">
                <div className="input-group-forgot-pass">
                  <label htmlFor="email">דוא״ל</label>
                  <div className="email-input-wrapper">
                    <Mail size={18} className="email-icon" />
                    <input
                      id="email"
                      type="email"
                      dir="ltr"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-field-forgot-pass email-input"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="reset-button-forgot-pass"
                  disabled={loading || !email.trim()}
                >
                  {loading ? "שולח..." : "שלח קישור לאיפוס סיסמה"}
                </button>
                
                <div className="back-to-login">
                  <button 
                    type="button"
                    onClick={handleBackToLogin}
                    className="back-link-forgot-pass"
                    disabled={loading}
                  >
                    <ArrowRight size={16} />
                    חזור לעמוד הכניסה
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="decorative-section-forgot-pass">
          <div className="welcome-content">
            <div className="welcome-icon">
              <Mail size={80} />
            </div>
            <div className="welcome-text">
              <h2>איפוס סיסמה</h2>
              <p>
                נשלח לך אימייל עם הוראות פשוטות לאיפוס הסיסמה שלך. 
                התהליך בטוח ומהיר, ו-Firebase יטפל בהצפנה.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;