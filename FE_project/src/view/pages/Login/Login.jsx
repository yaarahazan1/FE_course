import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Facebook } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { collection, addDoc, doc, updateDoc, getDoc, setDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // פונקציות קריפטוגרפיה מתקדמות יותר
  const encryptData = (data) => {
    const key = "smartStudent2024"; // בפרודקשן כדאי להשתמש במפתח דינמי
    const jsonString = JSON.stringify(data);
    let encrypted = "";
    
    for (let i = 0; i < jsonString.length; i++) {
      const keyChar = key[i % key.length];
      const encryptedChar = String.fromCharCode(jsonString.charCodeAt(i) ^ keyChar.charCodeAt(0));
      encrypted += encryptedChar;
    }
    
    return btoa(encrypted);
  };

  const decryptData = (encryptedData) => {
    try {
      const key = "smartStudent2024";
      const encrypted = atob(encryptedData);
      let decrypted = "";
      
      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = key[i % key.length];
        const decryptedChar = String.fromCharCode(encrypted.charCodeAt(i) ^ keyChar.charCodeAt(0));
        decrypted += decryptedChar;
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("שגיאה בפענוח נתונים:", error);
      return null;
    }
  };

  // יצירת מזהה ייחודי ויציב למכשיר ללא localStorage
  // גירסה פשוטה יותר עם sessionStorage (נמחק רק כשסוגרים דפדפן)
  const getDeviceId = () => {
    let deviceId = sessionStorage.getItem('deviceId');
    if (!deviceId) {
      // שימוש בfinger printing פשוט
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset()
      ].join('|');
      
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      deviceId = 'device_' + Math.abs(hash).toString(16);
      sessionStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  // שמירת נתוני "זכור אותי" ב-Firebase
  const saveRememberDataToFirebase = async (userEmail, userPassword) => {
    if (!rememberMe) return;

    try {
      const deviceId = getDeviceId();
      const credentials = {
        email: userEmail,
        password: userPassword
      };
      
      const encryptedCredentials = encryptData(credentials);
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10); // 10 דקות מהיום

      await setDoc(doc(db, 'rememberedCredentials', deviceId), {
        deviceId: deviceId,
        encryptedData: encryptedCredentials,
        createdAt: new Date(),
        expiresAt: expirationTime,
        userAgent: navigator.userAgent // לזיהוי נוסף של המכשיר
      });

      console.log("נתוני זכור אותי נשמרו ב-Firebase");
    } catch (error) {
      console.error("שגיאה בשמירת נתוני זכור אותי:", error);
    }
  };

  // טעינת נתוני "זכור אותי" מ-Firebase
  const loadRememberDataFromFirebase = async () => {
    try {
      const deviceId = getDeviceId();
      const credentialsDoc = await getDoc(doc(db, 'rememberedCredentials', deviceId));
      
      if (credentialsDoc.exists()) {
        const data = credentialsDoc.data();
        const currentTime = new Date();
        const expirationTime = data.expiresAt.toDate();
        
        // בדיקה אם הנתונים עדיין תקפים
        if (currentTime < expirationTime) {
          const credentials = decryptData(data.encryptedData);
          if (credentials) {
            setEmail(credentials.email);
            setPassword(credentials.password);
            setRememberMe(true);
            console.log("נתוני זכור אותי נטענו מ-Firebase");
            return true;
          }
        } else {
          // אם הנתונים פגו תוקף, נמחק אותם
          await clearRememberDataFromFirebase();
          console.log("נתוני זכור אותי פגו תוקף ונמחקו");
        }
      }
      return false;
    } catch (error) {
      console.error("שגיאה בטעינת נתוני זכור אותי:", error);
      return false;
    }
  };

  // מחיקת נתוני "זכור אותי" מ-Firebase
  const clearRememberDataFromFirebase = async () => {
    try {
      const deviceId = getDeviceId();
      await deleteDoc(doc(db, 'rememberedCredentials', deviceId));
      console.log("נתוני זכור אותי נמחקו מ-Firebase");
    } catch (error) {
      console.error("שגיאה במחיקת נתוני זכור אותי:", error);
    }
  };

  // ניקוי נתונים פגי תוקף (פונקציה עזר לתחזוקה)
  const cleanupExpiredCredentials = async () => {
    try {
      const q = query(
        collection(db, 'rememberedCredentials'),
        where('expiresAt', '<', new Date())
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`נמחקו ${querySnapshot.docs.length} רשומות של נתוני זכור אותי שפגו תוקף`);
    } catch (error) {
      console.error("שגיאה בניקוי נתונים פגי תוקף:", error);
    }
  };

  // טעינת נתונים שמורים בטעינת הקומפוננטה
  useEffect(() => {
    const loadSavedCredentials = async () => {
      await loadRememberDataFromFirebase();
      // ניקוי נתונים פגי תוקף בטעינה
      await cleanupExpiredCredentials();
    };

    loadSavedCredentials();
  }, []);

  // פונקציה לרישום כניסה למערכת (ללא שינוי)
  const recordLogin = async (user, loginMethod = 'email') => {
    try {
      await addDoc(collection(db, 'logins'), {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || 'משתמש אלמוני',
        loginTime: new Date(),
        loginMethod: loginMethod,
        createdAt: new Date(),
        connected: true
      });

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          lastActive: new Date(),
          email: user.email,
          displayName: user.displayName || userDoc.data().displayName || 'משתמש אלמוני',
          connected: true
        });
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'משתמש אלמוני',
          createdAt: new Date(),
          lastActive: new Date(),
          connected: true
        });
      }

      console.log("כניסה נרשמה בהצלחה");
    } catch (error) {
      console.error("שגיאה ברישום הכניסה:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // רישום הכניסה במסד הנתונים
      await recordLogin(user, 'email');
      
      // שמירת נתוני "זכור אותי" ב-Firebase
      await saveRememberDataToFirebase(user.email, password);
      
      console.log("התחברות מוצלחת:", user);
      navigate("/");
      
    } catch (error) {
      console.error("שגיאה בהתחברות:", error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError("משתמש לא קיים במערכת");
          break;
        case 'auth/wrong-password':
          setError("סיסמה שגויה");
          break;
        case 'auth/invalid-email':
          setError("כתובת דוא״ל לא תקינה");
          break;
        case 'auth/too-many-requests':
          setError("יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר");
          break;
        case 'auth/invalid-credential':
          setError("פרטי ההתחברות שגויים");
          break;
        default:
          setError("שגיאה בהתחברות. בדק את הפרטים ונסה שוב");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await recordLogin(user, 'google');
      
      // עבור כניסה חברתית נמחק נתוני זכור אותי (אין סיסמה)
      if (rememberMe) {
        setRememberMe(false);
        await clearRememberDataFromFirebase();
      }
      
      console.log("התחברות עם Google מוצלחת:", user);
      navigate("/");
    } catch (error) {
      console.error("שגיאה בהתחברות Google:", error);
      setError("שגיאה בהתחברות עם Google");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      
      await recordLogin(user, 'facebook');
      
      if (rememberMe) {
        setRememberMe(false);
        await clearRememberDataFromFirebase();
      }
      
      console.log("התחברות עם Facebook מוצלחת:", user);
      navigate("/");
    } catch (error) {
      console.error("שגיאה בהתחברות Facebook:", error);
      setError("שגיאה בהתחברות עם Facebook");
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לטיפול בשינוי מצב "זכור אותי"
  const handleRememberMeChange = async (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    
    // אם המשתמש ביטל את "זכור אותי", נמחק את הנתונים השמורים
    if (!isChecked) {
      await clearRememberDataFromFirebase();
    }
  };

  // בדיקת זמן התפוגה בזמן אמת
  useEffect(() => {
    const checkExpiration = async () => {
      if (rememberMe) {
        const isStillValid = await loadRememberDataFromFirebase();
        if (!isStillValid) {
          setEmail("");
          setPassword("");
          setRememberMe(false);
        }
      }
    };

    // בדיקה כל דקה
    const interval = setInterval(checkExpiration, 60000);
    return () => clearInterval(interval);
  }, [rememberMe]);

  return (
    <div className="login-container">
      <header className="header-login">
        <div className="header-content-login">
          <a href="/" className="logo">סטודנט חכם</a>
        </div>
      </header>

      <div className="main-content-login">
        <div className="form-section-login">
          <div className="login-card">
            <div className="card-content-login">
              <div className="form-header-login">
                <h1>כניסה</h1>
                <p>ברוך שובך! נא להזין את פרטי הכניסה</p>
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
                      onChange={(e) => setPassword(e.target.value)}
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <a href="/ForgotPassword">שכחת סיסמה?</a>
                </div>
                
                <div className="form-options">
                  <div className="remember-me">
                    <input 
                      id="remember-me" 
                      type="checkbox"
                      checked={rememberMe} 
                      onChange={handleRememberMeChange}
                      className="checkbox"
                      disabled={loading}
                    />
                    <label htmlFor="remember-me">זכור אותי (10 דקות)</label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? "מתחבר..." : "כניסה"}
                </button>
                
                <div className="divider">
                  <span>או כניסה עם</span>
                  <div className="line-under-text"></div>
                </div>
                
                <div className="social-buttons">
                  <button type="button" className="social-button" disabled={loading}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="social-button"
                    onClick={handleFacebookLogin}
                    disabled={loading}
                  >
                    <Facebook size={20} />
                  </button>
                  <button 
                    type="button" 
                    className="social-button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
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