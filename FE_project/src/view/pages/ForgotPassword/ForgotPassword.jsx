import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");
  
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmailSent(email);
      console.log("אימייל איפוס סיסמה נשלח בהצלחה לכתובת:", email);
      
    } catch (error) {
      console.error("שגיאה בשליחת אימייל איפוס סיסמה:", error);
      
      // הודעות שגיאה בעברית
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
      await sendPasswordResetEmail(auth, emailSent);
      console.log("אימייל איפוס סיסמה נשלח שוב לכתובת:", emailSent);
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
                    <li>בחר סיסמה חדשה</li>
                    <li>חזור לעמוד הכניסה והתחבר עם הסיסמה החדשה</li>
                  </ol>
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
                  disabled={loading || !email}
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
                נשלח לך אימייל עם הוראות פשוטות לאיפוס הסיסמה שלך. התהליך בטוח ומהיר.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;