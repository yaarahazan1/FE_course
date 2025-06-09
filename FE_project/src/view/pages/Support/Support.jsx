import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { auth } from "../../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import "./Support.css";

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // מעקב אחר מצב ההתחברות של המשתמש
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // הדמיית שליחת פנייה
    setTimeout(() => {
      alert("הפנייה נשלחה בהצלחה! נחזור אליך בתוך 24 שעות.");
      setFormData({
        subject: "",
        category: "",
        message: "",
        priority: "normal"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  // FAQ Component
  const FAQSection = () => (
    <div className="support-section">
      <h3>שאלות נפוצות</h3>
      
      <div className="support-item">
        <h4>איך אני יכול לאפס את הסיסמה שלי?</h4>
        <p>כדי לאפס את הסיסמה, לחץ על "שכחתי סיסמה" בדף ההתחברות והזן את כתובת האימייל שלך. תקבל הוראות לאיפוס הסיסמה.</p>
      </div>
      
      <div className="support-item">
        <h4>איך אני מוסיף קורס חדש?</h4>
        <p>עבור לעמוד "ניהול קורסים", לחץ על "הוסף קורס חדש" ומלא את הפרטים הנדרשים כמו שם הקורס, מרצה ושעות.</p>
      </div>
      
      <div className="support-item">
        <h4>איך אני יכול לשתף סיכום עם חברים?</h4>
        <p>בספריית הסיכומים, לחץ על הסיכום הרצוי ובחר באפשרות "שתף". תוכל לבחור לשתף באמצעות לינק או להוסיף משתמשים ספציפיים.</p>
      </div>
      
      <div className="support-item">
        <h4>איך מגדירים התראות למטלות?</h4>
        <p>בעמוד ניהול הזמן, לחץ על המטלה ובחר "הגדרות התראה". תוכל לקבוע התראות לפני המועד הסופי.</p>
      </div>
      
      <div className="support-item">
        <h4>איך אני משנה את הגדרות הפרטיות?</h4>
        <p>עבור לעמוד "עזרה והגדרות", בחר בטאב "הגדרות פרטיות והתראות" ושם תוכל לנהל את כל הגדרות הפרטיות שלך.</p>
      </div>
    </div>
  );

  // Contact Component
  const ContactSection = () => (
    <div className="support-section">
      <h3>דרכי יצירת קשר</h3>
      
      <div className="support-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Mail size={20} color="#6B8DB5" />
          <h4>אימייל: support@studyplatform.com</h4>
          <span className="status-indicator status-online">
            <CheckCircle size={12} />
            זמין
          </span>
        </div>
        <p>זמן תגובה: עד 24 שעות</p>
      </div>
      
      <div className="support-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Phone size={20} color="#6B8DB5" />
          <h4>טלפון: 03-1234567</h4>
          <span className="status-indicator status-busy">
            <Clock size={12} />
            עמוס
          </span>
        </div>
        <p>זמינות:</p>
        <p>ימים: ראשון-חמישי, שעות: 9:00-17:00</p>
      </div>
      
      <div className="support-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <MessageCircle size={20} color="#6B8DB5" />
          <h4>צ'אט חי</h4>
          <span className="status-indicator status-offline">
            <AlertCircle size={12} />
            לא זמין
          </span>
        </div>
        <p>הצ'אט החי יהיה זמין בקרוב - בינתיים אנא השתמש באימייל או בטלפון</p>
      </div>
    </div>
  );

  // Support Form Component
  const SupportForm = () => (
    <div className="support-section">
      <h3>פנה אלינו</h3>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group-support">
          <label htmlFor="subject">נושא הפנייה</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            placeholder="הזן את נושא הפנייה"
          />
        </div>
        
        <div className="form-group-support">
          <label htmlFor="category">קטגוריה</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">בחר קטגוריה</option>
            <option value="technical">בעיה טכנית</option>
            <option value="account">בעיות חשבון</option>
            <option value="feature">בקשת תכונה חדשה</option>
            <option value="billing">חיוב ותשלומים</option>
            <option value="other">אחר</option>
          </select>
        </div>
        
        <div className="form-group-support">
          <label htmlFor="priority">רמת דחיפות</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">נמוכה</option>
            <option value="normal">רגילה</option>
            <option value="high">גבוהה</option>
            <option value="urgent">דחוף</option>
          </select>
        </div>
        
        <div className="form-group-support">
          <label htmlFor="message">תיאור הבעיה</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            placeholder="תאר את הבעיה או השאלה שלך בפירוט"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "שולח..." : "שלח פנייה"}
        </button>
      </form>
    </div>
  );

  // אם המשתמש לא מחובר, הפנה אותו לדף הכניסה
  if (!loading && !user) {
    return (
      <div className="support-container">
        <div className="support-content">
          <div className="back-navigation">
            <Link to="/" className="back-link">
              <ArrowLeft className="back-icon" />
              <span>חזרה לדף הבית</span>
            </Link>
          </div>
          
          <div className="auth-required-message" style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <h2>נדרשת התחברות</h2>
            <p>כדי לגשת למרכז התמיכה, עליך להתחבר למערכת</p>
            <Link to="/Login" style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              התחבר למערכת
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // מסך טעינה בזמן בדיקת סטטוס ההתחברות
  if (loading) {
    return (
      <div className="support-container">
        <div className="support-content">
          <div className="loading-spinner" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px'
          }}>
            טוען...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="support-container">
      <div className="support-content">
        <div className="back-navigation">
          <Link to="/" className="back-link">
            <ArrowLeft className="back-icon" />
            <span>חזרה לדף הבית</span>
          </Link>
        </div>
        
        {/* הצגת מידע על המשתמש המחובר */}
        <div className="user-info">
          מחובר כ: {user?.displayName || user?.email}
        </div>
        
        <h1 className="main-title-support">מרכז תמיכה ושירות</h1>
        
        <div className="tabs-container">
          <div className="tabs-list-support">
            <button 
              className={`tab-trigger ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              שאלות נפוצות
            </button>
            <button 
              className={`tab-trigger ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              יצירת קשר
            </button>
            <button 
              className={`tab-trigger ${activeTab === "form" ? "active" : ""}`}
              onClick={() => setActiveTab("form")}
            >
              פנה אלינו
            </button>
          </div>
          
          <div className="tab-content-support">
            {activeTab === "faq" && (
              <div className="content-card">
                <FAQSection />
              </div>
            )}
            
            {activeTab === "contact" && (
              <div className="content-card">
                <ContactSection />
              </div>
            )}
            
            {activeTab === "form" && (
              <div className="content-card">
                <SupportForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;