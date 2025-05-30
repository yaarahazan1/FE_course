import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import "./CoursesTab.css";

const CoursesTab = ({ courses = [] }) => {
  const [coursesWithTasks, setCoursesWithTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  // פונקציה לקבלת צבע הסטטוס
  const getStatusColor = (status) => {
    switch (status) {
      case "הושלם":
        return "#4CAF50"; // ירוק
      case "בתהליך":
        return "#FF9800"; // כתום
      case "לא הוחל":
        return "#757575"; // אפור
      case "נדחה":
        return "#F44336"; // אדום
      case "ממתין לבדיקה":
        return "#2196F3"; // כחול
      default:
        return "#757575";
    }
  };

  // פונקציה לטעינת המשימות לכל קורס
  const loadTasksForCourses = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      
      // שליפת כל המשימות של המשתמש
      const tasksRef = collection(db, "tasks");
      const tasksQuery = query(tasksRef, where("userId", "==", userId));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const allTasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // חיבור המשימות לקורסים
      const updatedCourses = courses.map(course => {
        // מציאת משימות שמתייחסות לקורס זה
        const courseTasks = allTasks.filter(task => 
          task.courseId === course.id || 
          task.courseName === course.name
        );

        return {
          ...course,
          assignments: courseTasks
        };
      });

      setCoursesWithTasks(updatedCourses);
    } catch (error) {
      console.error("שגיאה בטעינת משימות:", error);
      setCoursesWithTasks(courses);
    } finally {
      setLoading(false);
    }
  };

  // טעינת המשימות כאשר הקורסים משתנים
  useEffect(() => {
    if (courses.length > 0) {
      loadTasksForCourses();
    } else {
      setCoursesWithTasks([]);
      setLoading(false);
    }
  }, [courses]);

  // פונקציה לפורמט תאריך
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL');
    } catch (error) {
      return error;
    }
  };

  // פונקציה לקבלת רמת דחיפות בעברית
  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "גבוהה";
      case "medium":
        return "בינונית";
      case "low":
        return "נמוכה";
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="courses-tab">
        <div className="courses-header">
          <h2>רשימת קורסים</h2>
        </div>
        <div className="loading-message">
          <p>טוען משימות קורס...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-tab">
      <div className="courses-header">
        <h2>רשימת קורסים</h2>
      </div>

      {coursesWithTasks.length === 0 ? (
        <div className="courses-empty-message">
          <p>אין קורסים זמינים כרגע. לחץ על כפתור "הוסף קורס" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="courses-list">
          {coursesWithTasks.map((course) => (
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
                  {course.courseCode && (
                    <div className="course-info-item">
                      <span className="info-label">קוד קורס:</span>
                      <span className="info-value">{course.courseCode}</span>
                    </div>
                  )}
                </div>

                <div className="course-stats">
                  <div className="course-stat-item">
                    <span className="stat-value">{course.assignments ? course.assignments.length : 0}</span>
                    <span className="stat-label">משימות</span>
                  </div>
                  <div className="course-stat-item">
                    <span className="stat-value">
                      {course.assignments ? course.assignments.filter(task => task.status === "הושלם").length : 0}
                    </span>
                    <span className="stat-label">הושלמו</span>
                  </div>
                  <div className="course-stat-item">
                    <span className="stat-value">
                      {course.assignments ? course.assignments.filter(task => task.status === "בתהליך").length : 0}
                    </span>
                    <span className="stat-label">בתהליך</span>
                  </div>
                                    <div className="course-stat-item">
                    <span className="stat-value">
                      {course.assignments ? course.assignments.filter(task => task.status === "נדחה").length : 0}
                    </span>
                    <span className="stat-label">נדחה</span>
                  </div>
                </div>

                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}

                {course.assignments && course.assignments.length > 0 && (
                  <div className="course-assignments">
                    <h4>משימות קורס:</h4>
                    <div className="assignments-list">
                      {course.assignments.map((assignment) => (
                        <div key={assignment.id} className="assignment-card">
                          <div className="assignment-header">
                            <span className="assignment-title">{assignment.title}</span>
                            <span 
                              className="assignment-status"
                              style={{ 
                                color: getStatusColor(assignment.status),
                                backgroundColor: `${getStatusColor(assignment.status)}15`,
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "500",
                                border: `1px solid ${getStatusColor(assignment.status)}30`
                              }}
                            >
                              {assignment.status}
                            </span>
                          </div>
                          
                          {assignment.description && (
                            <p className="assignment-description">{assignment.description}</p>
                          )}
                          
                          <div className="assignment-details">
                            {assignment.dueDate && (
                              <div className="assignment-detail-item">
                                <span className="detail-label">לתאריך:</span>
                                <span className="detail-value">{formatDate(assignment.dueDate)}</span>
                              </div>
                            )}
                            {assignment.priority && (
                              <div className="assignment-detail-item">
                                <span className="detail-label">דחיפות:</span>
                                <span className={`detail-value priority-${assignment.priority}`}>
                                  {getPriorityText(assignment.priority)}
                                </span>
                              </div>
                            )}
                            {assignment.estimatedHours && (
                              <div className="assignment-detail-item">
                                <span className="detail-label">שעות משוערות:</span>
                                <span className="detail-value">{assignment.estimatedHours}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!course.assignments || course.assignments.length === 0) && (
                  <div className="no-assignments">
                    <p>אין משימות קשורות לקורס זה</p>
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