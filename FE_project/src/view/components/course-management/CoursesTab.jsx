import React from "react";
import "./CoursesTab.css";

const CoursesTab = ({ onAddCourse }) => {
  return (
    <div className="courses-container">
      <div className="courses-header">
        <button 
          onClick={onAddCourse} 
          className="add-button"
        >
          הוספת קורס
        </button>
        <h2 className="courses-title">הקורסים שלי</h2>
      </div>
      
      <div className="course-card">
        <h3 className="course-name">פסיכולוגיה חברתית</h3>
        <p className="course-professor">דר. פטריק גינזבורג</p>
        <div className="course-meta">
          <span className="course-semester">סמסטר ב'</span>
          <div className="course-stats">2 מטלות | 3 נקודות זכות</div>
        </div>
      </div>
      
      <div className="course-card">
        <h3 className="course-name">שיטות מחקר מתקדמות</h3>
        <p className="course-professor">פרופ. אלישע</p>
        <div className="course-meta">
          <span className="course-semester">סמסטר ב'</span>
          <div className="course-stats">3 מטלות | 4 נקודות זכות</div>
        </div>
      </div>
      
      <div className="course-card">
        <h3 className="course-name">סטטיסטיקה יישומית</h3>
        <p className="course-professor">דר. רונית כהן</p>
        <div className="course-meta">
          <span className="course-semester">סמסטר ב'</span>
          <div className="course-stats">4 מטלות | 3 נקודות זכות</div>
        </div>
      </div>
    </div>
  );
};

export default CoursesTab;