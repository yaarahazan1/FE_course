import React, { useState } from "react";
import { ChevronDown, ChevronUp, Book, Video, MessageCircle, Phone } from "lucide-react";
import "./HelpGuides.css";

const HelpGuides = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: "איך להתחיל",
      icon: <Book className="guide-icon" />,
      description: "מדריך מקיף לצעדים הראשונים במערכת",
      content: [
        "יצירת חשבון משתמש חדש",
        "התאמה אישית של הפרופיל האישי",
        "הגדרת העדפות ראשוניות",
        "ניווט בממשק המערכת",
        "שמירת נתונים ראשונים"
      ]
    },
    {
      id: 2,
      title: "ניהול החשבון",
      icon: <MessageCircle className="guide-icon" />,
      description: "הדרכה מפורטת לניהול פרטי החשבון",
      content: [
        "עדכון פרטים אישיים",
        "שינוי סיסמה וביטחון",
        "הגדרות התראות",
        "ניהול הרשאות גישה",
        "סינכרון עם מכשירים אחרים"
      ]
    },
    {
      id: 3,
      title: "פונקציות מתקדמות",
      icon: <Video className="guide-icon" />,
      description: "מדריך לשימוש בכלים מתקדמים במערכת",
      content: [
        "יצירת דוחות מותאמים אישית",
        "שימוש בכלי אנליזה",
        "ייבוא וייצוא נתונים",
        "אוטומציה של משימות",
        "שילוב עם מערכות חיצוניות"
      ]
    },
    {
      id: 4,
      title: "פתרון בעיות נפוצות",
      icon: <Phone className="guide-icon" />,
      description: "פתרונות לבעיות שכיחות ושאלות נפוצות",
      content: [
        "בעיות התחברות למערכת",
        "איך לאפס סיסמה שנשכחה",
        "טיפול בהודעות שגיאה",
        "בעיות ביצועים ואיטיות",
        "יצירת קשר עם תמיכה טכנית"
      ]
    }
  ];

  const toggleGuide = (guideId) => {
    setExpandedGuide(expandedGuide === guideId ? null : guideId);
  };

  return (
    <div className="help-guides-container">
      <div className="guides-header">
        <h2 className="guides-title">מדריכי משתמש</h2>
        <p className="guides-subtitle">
          מדריכים מפורטים לעזור לך להפיק את המירב מהמערכת
        </p>
      </div>

      <div className="guides-list">
        {guides.map((guide) => (
          <div key={guide.id} className="guide-item">
            <div 
              className="guide-header"
              onClick={() => toggleGuide(guide.id)}
            >
              <div className="guide-info">
                <div className="guide-icon-container">
                  {guide.icon}
                </div>
                <div className="guide-text">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-description">{guide.description}</p>
                </div>
              </div>
              <div className="expand-icon">
                {expandedGuide === guide.id ? (
                  <ChevronUp className="chevron" />
                ) : (
                  <ChevronDown className="chevron" />
                )}
              </div>
            </div>

            {expandedGuide === guide.id && (
              <div className="guide-content">
                <ul className="content-list">
                  {guide.content.map((item, index) => (
                    <li key={index} className="content-item">
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="learn-more-btn">
                  למד עוד
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="contact-support">
        <div className="support-content">
          <h3 className="support-title">צריך עזרה נוספת?</h3>
          <p className="support-text">
            אם לא מצאת את מה שחיפשת, צוות התמיכה שלנו כאן לעזור
          </p>
          <div className="support-buttons">
            <button className="support-btn primary">
              <MessageCircle className="btn-icon" />
              פתח צ'אט תמיכה
            </button>
            <button className="support-btn secondary">
              <Phone className="btn-icon" />
              התקשר אלינו
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuides;