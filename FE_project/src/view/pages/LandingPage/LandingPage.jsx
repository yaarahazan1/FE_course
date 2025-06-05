import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: "📅",
      title: "ניהול זמנים חכם",
      description: "לוח זמנים אישי ואקדמי עם הצעות לימוד אוטומטיות ותזכורות מותאמות"
    },
    {
      icon: "👥",
      title: "עבודה קבוצתית",
      description: "ניהול פרויקטים, חלוקת משימות, צ'אט פנימי ומעקב אחר התקדמות"
    },
    {
      icon: "📚",
      title: "ספריית סיכומים",
      description: "גישה לסיכומי שיעורים ומטלות אקדמיות משותפות ומדורגות"
    },
    {
      icon: "✍️",
      title: "כלי כתיבה אקדמית",
      description: "עורך מתקדם לכתיבה מובנית בהתאם לכללי הכתיבה האקדמית"
    },
    {
      icon: "💬",
      title: "רשת חברתית לסטודנטים",
      description: "קהילה פעילה לשיתוף ידע, שאלות והמלצות אקדמיות"
    },
    {
      icon: "📊",
      title: "מעקב והתקדמות",
      description: "דשבורד אישי עם ניתוח ביצועים וסטטיסטיקות למידה"
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                📖
              </div>
              <h1 className="logo-text">סטודנט חכם</h1>
            </div>
            <div className="header-buttons">
              <button className="login-btn">התחבר</button>
              <button className="signup-btn">הרשם עכשיו</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">
              הפלטפורמה החכמה
              <br />
              <span className="gradient-text">לניהול לימודים</span>
            </h2>
            <p className="hero-description">
              מערכת מתקדמת המשלבת כלים חכמים לארגון, מעקב וביצוע משימות אקדמיות.
              <br />
              הכל במקום אחד - מניהול זמנים ועד עבודה שיתופית.
            </p>
            <div className="hero-buttons">
              <button className="cta-primary">התחל עכשיו בחינם</button>
              <button className="cta-secondary">למד עוד</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="card-content">
                <div className="mock-calendar">
                  <div className="calendar-header">📅 השבוע שלי</div>
                  <div className="calendar-items">
                    <div className="calendar-item blue">אלגוריתמים - הרצאה</div>
                    <div className="calendar-item green">פרויקט גמר - עבודה</div>
                    <div className="calendar-item purple">מטלה במתמטיקה</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">כל מה שאתה צריך להצלחה בלימודים</h3>
            <p className="section-subtitle">
              פתרון מקיף המאחד את כל הכלים הדרושים לסטודנט המודרני
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">סטודנטים פעילים</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">מוסדות לימוד</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">משימות הושלמו</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">שיפור בציונים</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h3 className="cta-title">מוכן להתחיל את המסע שלך?</h3>
            <p className="cta-description">
              הצטרף לאלפי סטודנטים שכבר משתמשים בפלטפורמה להצלחה בלימודים
            </p>
            <div className="cta-buttons">
              <button className="cta-primary">הרשם בחינם</button>
              <button className="cta-secondary">צפה בהדגמה</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">📖</div>
                <span className="logo-text">סטודנט חכם</span>
              </div>
              <p className="footer-description">
                הפלטפורמה המובילה לניהול לימודים אקדמיים בישראל
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">קישורים מהירים</h4>
              <ul className="footer-links">
                <li><a href="#features">תכונות</a></li>
                <li><a href="#pricing">מחירים</a></li>
                <li><a href="#about">אודות</a></li>
                <li><a href="#contact">צור קשר</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">תמיכה</h4>
              <ul className="footer-links">
                <li><a href="#help">מרכז עזרה</a></li>
                <li><a href="#faq">שאלות נפוצות</a></li>
                <li><a href="#privacy">פרטיות</a></li>
                <li><a href="#terms">תנאי שימוש</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 סטודנט חכם. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;