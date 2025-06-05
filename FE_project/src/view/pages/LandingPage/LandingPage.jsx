import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      title: "ניהול לוח זמנים",
      description: "תכנן את יומך ושבועך בצורה מיטבית",
      icon: "📅"
    },
    {
      title: "ספריית סיכומים",
      description: "צור ושתף סיכומים עם חברים ללימודים",
      icon: "📚"
    },
    {
      title: "ניהול משימות",
      description: "עקוב אחרי משימות והגשות עם התראות",
      icon: "✅"
    },
    {
      title: "כתיבה אקדמית",
      description: "כתוב עבודות עם תמיכה בציטוטים",
      icon: "✍️"
    },
    {
      title: "רשת חברתית",
      description: "התחבר עם סטודנטים מהתחום שלך",
      icon: "👥"
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">סטודנט חכם</h1>
          <p className="hero-subtitle">
            הפלטפורמה המקיפה לניהול הלימודים שלך
          </p>
          <p className="hero-description">
            נהל סיכומים, משימות ולוח זמנים במקום אחד. התחבר עם סטודנטים אחרים ושפר את הציונים שלך
          </p>
          <div className="hero-buttons">
            <Link to="/Signup" className="btn btn-primary">
              הרשמה חינם
            </Link>
            <Link to="/Login" className="btn btn-secondary">
              כניסה למערכת
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            🎓
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">מה מציעה המערכת?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">למה לבחור בסטודנט חכם?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🚀</div>
              <h3>קל לשימוש</h3>
              <p>ממשק פשוט ואינטואיטיבי</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3>בטוח ומאובטח</h3>
              <p>המידע שלך מוגן ברמה גבוהה</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📱</div>
              <h3>נגיש מכל מכשיר</h3>
              <p>עובד על מחשב, טאבלט וסמארטפון</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💡</div>
              <h3>כלים חכמים</h3>
              <p>טכנולוגיה מתקדמת ללמידה יעילה</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">מוכן להתחיל?</h2>
          <p className="cta-description">
            הצטרף אלינו היום והתחל לנהל את הלימודים שלך בצורה חכמה
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;