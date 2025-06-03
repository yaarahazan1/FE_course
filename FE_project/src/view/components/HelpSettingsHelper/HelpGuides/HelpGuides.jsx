import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Book, Video, MessageCircle, Phone, Bookmark, Check } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./HelpGuides.css";

const HelpGuides = ({ user }) => {
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [completedGuides, setCompletedGuides] = useState([]);
  const [bookmarkedGuides, setBookmarkedGuides] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

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

  // טעינת נתוני משתמש מ-Firebase
  useEffect(() => {
    const loadUserHelpData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const userHelpRef = doc(db, "userHelpProgress", user.uid);
        const helpSnapshot = await getDoc(userHelpRef);
        
        if (helpSnapshot.exists()) {
          const helpData = helpSnapshot.data();
          setCompletedGuides(helpData.completedGuides || []);
          setBookmarkedGuides(helpData.bookmarkedGuides || []);
          setUserProgress(helpData.progress || {});
        }
      } catch (error) {
        console.error("Error loading user help data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserHelpData();
  }, [user]);

  // שמירת נתוני התקדמות ב-Firebase
  const saveHelpDataToFirebase = async (dataToSave) => {
    if (!user?.uid) return;

    try {
      const userHelpRef = doc(db, "userHelpProgress", user.uid);
      await setDoc(userHelpRef, {
        userId: user.uid,
        userEmail: user.email,
        ...dataToSave,
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving help data:", error);
    }
  };

  const toggleGuide = (guideId) => {
    setExpandedGuide(expandedGuide === guideId ? null : guideId);
    
    // עדכון התקדמות - אם המדריך נפתח, סמן שהמשתמש צפה בו
    if (expandedGuide !== guideId) {
      const newProgress = {
        ...userProgress,
        [guideId]: {
          ...userProgress[guideId],
          viewed: true,
          lastViewed: new Date().toISOString()
        }
      };
      setUserProgress(newProgress);
      saveHelpDataToFirebase({
        completedGuides,
        bookmarkedGuides,
        progress: newProgress
      });
    }
  };

  const toggleBookmark = async (guideId, event) => {
    event.stopPropagation();
    
    let newBookmarkedGuides;
    if (bookmarkedGuides.includes(guideId)) {
      newBookmarkedGuides = bookmarkedGuides.filter(id => id !== guideId);
    } else {
      newBookmarkedGuides = [...bookmarkedGuides, guideId];
    }
    
    setBookmarkedGuides(newBookmarkedGuides);
    await saveHelpDataToFirebase({
      completedGuides,
      bookmarkedGuides: newBookmarkedGuides,
      progress: userProgress
    });
  };

  const markAsCompleted = async (guideId, event) => {
    event.stopPropagation();
    
    let newCompletedGuides;
    if (completedGuides.includes(guideId)) {
      newCompletedGuides = completedGuides.filter(id => id !== guideId);
    } else {
      newCompletedGuides = [...completedGuides, guideId];
    }
    
    setCompletedGuides(newCompletedGuides);
    
    // עדכון התקדמות
    const newProgress = {
      ...userProgress,
      [guideId]: {
        ...userProgress[guideId],
        completed: !completedGuides.includes(guideId),
        completedAt: !completedGuides.includes(guideId) ? new Date().toISOString() : null
      }
    };
    setUserProgress(newProgress);
    
    await saveHelpDataToFirebase({
      completedGuides: newCompletedGuides,
      bookmarkedGuides,
      progress: newProgress
    });
  };

  // מסך טעינה
  if (isLoading) {
    return (
      <div className="help-guides-container">
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '18px'
        }}>
          טוען מדריכים...
        </div>
      </div>
    );
  }

  return (
    <div className="help-guides-container">
      <div className="guides-header">
        <h2 className="guides-title">מדריכי משתמש</h2>
        <p className="guides-subtitle">
          מדריכים מפורטים לעזור לך להפיק את המירב מהמערכת
        </p>
        {user && (
          <div className="progress-summary" style={{
            display: 'flex',
            gap: '20px',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <span>מדריכים שהושלמו: {completedGuides.length}/{guides.length}</span>
            <span>מדריכים במועדפים: {bookmarkedGuides.length}</span>
          </div>
        )}
      </div>

      <div className="guides-list">
        {guides.map((guide) => (
          <div key={guide.id} className={`guide-item ${completedGuides.includes(guide.id) ? 'completed' : ''}`}>
            <div 
              className="guide-header"
              onClick={() => toggleGuide(guide.id)}
            >
              <div className="guide-info">
                <div className="guide-icon-container">
                  {guide.icon}
                  {completedGuides.includes(guide.id) && (
                    <div className="completion-badge">
                      <Check size={12} />
                    </div>
                  )}
                </div>
                <div className="guide-text">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-description">{guide.description}</p>
                  {userProgress[guide.id]?.viewed && (
                    <span className="viewed-indicator" style={{
                      fontSize: '12px',
                      color: '#28a745',
                      fontWeight: '500'
                    }}>
                      נצפה ב-{new Date(userProgress[guide.id].lastViewed).toLocaleDateString('he-IL')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="guide-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user && (
                  <>
                    <button 
                      className={`bookmark-btn ${bookmarkedGuides.includes(guide.id) ? 'bookmarked' : ''}`}
                      onClick={(e) => toggleBookmark(guide.id, e)}
                      title={bookmarkedGuides.includes(guide.id) ? 'הסר ממועדפים' : 'הוסף למועדפים'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: bookmarkedGuides.includes(guide.id) ? '#ffa500' : '#666'
                      }}
                    >
                      <Bookmark size={16} fill={bookmarkedGuides.includes(guide.id) ? 'currentColor' : 'none'} />
                    </button>
                    
                    <button 
                      className={`complete-btn ${completedGuides.includes(guide.id) ? 'completed' : ''}`}
                      onClick={(e) => markAsCompleted(guide.id, e)}
                      title={completedGuides.includes(guide.id) ? 'סמן כלא הושלם' : 'סמן כהושלם'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: completedGuides.includes(guide.id) ? '#28a745' : '#666'
                      }}
                    >
                      <Check size={16} />
                    </button>
                  </>
                )}
                
                <div className="expand-icon">
                  {expandedGuide === guide.id ? (
                    <ChevronUp className="chevron" />
                  ) : (
                    <ChevronDown className="chevron" />
                  )}
                </div>
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
                <div className="guide-content-actions" style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  <button className="learn-more-btn">
                    למד עוד
                  </button>
                  {user && !completedGuides.includes(guide.id) && (
                    <button 
                      className="mark-complete-btn"
                      onClick={(e) => markAsCompleted(guide.id, e)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      סמן כהושלם
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* סעיף מדריכים מועדפים */}
      {user && bookmarkedGuides.length > 0 && (
        <div className="bookmarked-guides" style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#856404' }}>המדריכים המועדפים שלך</h3>
          <div className="bookmarked-list">
            {bookmarkedGuides.map(guideId => {
              const guide = guides.find(g => g.id === guideId);
              return guide ? (
                <div key={guideId} className="bookmarked-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  {guide.icon}
                  <span style={{ flex: 1 }}>{guide.title}</span>
                  <button 
                    onClick={() => toggleGuide(guide.id)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    פתח
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

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