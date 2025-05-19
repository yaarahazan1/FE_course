import React from "react";
import "./CoursesTab.css";

const CoursesTab = ({ courses = []}) => {
  return (
    <div className="courses-tab">
      <div className="courses-header">
        <h2>רשימת קורסים</h2>
      </div>

      {courses.length === 0 ? (
        <div className="courses-empty-message">
          <p>אין קורסים זמינים כרגע. לחץ על כפתור "הוסף קורס" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="courses-list">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.name}</h3>
                <span className="course-semester">{course.semester || "סמסטר נוכחי"}</span>
              </div>
              <div className="course-details">
                <div className="course-info">
                  <div className="course-info-item">
                    <span className="info-label">מרצה:</span>
                    <span className="info-value">{course.lecturer}</span>
                  </div>
                  {course.credits && (
                    <div className="course-info-item">
                      <span className="info-label">נקודות זכות:</span>
                      <span className="info-value">{course.credits}</span>
                    </div>
                  )}
                  {course.schedule && (
                    <div className="course-info-item">
                      <span className="info-label">מועד:</span>
                      <span className="info-value">{course.schedule}</span>
                    </div>
                  )}
                </div>
                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}
                {course.assignments && course.assignments.length > 0 && (
                  <div className="course-assignments">
                    <h4>משימות קורס:</h4>
                    <ul>
                      {course.assignments.map((assignment, index) => (
                        <li key={index} className={`assignment ${assignment.isCompleted ? "completed" : ""}`}>
                          {assignment.name}
                          {assignment.dueDate && <span> - לתאריך {assignment.dueDate}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;