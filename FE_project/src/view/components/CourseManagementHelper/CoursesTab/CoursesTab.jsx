import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import "./CoursesTab.css";

const CoursesTab = ({ courses = [], onCourseDeleted }) => {
  const [coursesWithTasks, setCoursesWithTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  // פונקציה לטיפול בהרחבה/כיווץ של משימות קורס
  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // פונקציה לקבלת קלאס CSS של סטטוס
  const getStatusClass = (status) => {
    switch (status) {
      case "הושלם":
        return "assignment-status completed";
      case "בתהליך":
        return "assignment-status in-progress";
      case "לא הוחל":
        return "assignment-status not-started";
      case "נדחה":
        return "assignment-status postponed";
      case "ממתין לבדיקה":
        return "assignment-status pending-review";
      default:
        return "assignment-status not-started";
    }
  };

  // פונקציה למחיקת קורס
  const deleteCourse = async (courseId) => {
    if (!courseId) {
      console.error("לא ניתן למחוק קורס ללא ID");
      return;
    }
    const course = coursesWithTasks.find(c => c.id === courseId);
    const tasksCount = course?.assignments?.length || 0;
    
    let confirmMessage = "האם אתה בטוח שברצונך למחוק את הקורס?";
    if (tasksCount > 0) {
      confirmMessage += `\n\nשים לב: יימחקו גם ${tasksCount} משימות הקשורות לקורס זה.`;
    }
    confirmMessage += "\n\nפעולה זו לא ניתנת לביטול.";
    const confirmDelete = window.confirm(confirmMessage);
    
    if (!confirmDelete) {
      return;
    }
    try {
      setDeletingCourseId(courseId);
      
      // מחיקת כל המשימות הקשורות לקורס
      if (course?.assignments && course.assignments.length > 0) {
        const deleteTasksPromises = course.assignments.map(task => 
          deleteDoc(doc(db, "tasks", task.id))
        );
        await Promise.all(deleteTasksPromises);
        console.log(`נמחקו ${course.assignments.length} משימות של הקורס`);
      }
      
      // מחיקת הקורס מ-Firebase
      await deleteDoc(doc(db, "courses", courseId));
      
      // עדכון הסטייט המקומי
      setCoursesWithTasks(prevCourses => 
        prevCourses.filter(course => course.id !== courseId)
      );
      // הודעה להורה על המחיקה
      if (onCourseDeleted) {
        onCourseDeleted(courseId);
      }
      console.log("הקורס נמחק בהצלחה");
      
    } catch (error) {
      console.error("שגיאה במחיקת הקורס:", error);
      alert("אירעה שגיאה במחיקת הקורס. אנא נסה שוב.");
    } finally {
      setDeletingCourseId(null);
    }
  };

  // פונקציה למחיקת משימה
  const deleteTask = async (taskId, courseId) => {
    if (!taskId) {
      console.error("לא ניתן למחוק משימה ללא ID");
      return;
    }
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את המשימה? פעולה זו לא ניתנת לביטול.");
    
    if (!confirmDelete) {
      return;
    }
    try {
      setDeletingTaskId(taskId);
      
      await deleteDoc(doc(db, "tasks", taskId));
      
      setCoursesWithTasks(prevCourses => 
        prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              assignments: course.assignments ? course.assignments.filter(task => task.id !== taskId) : []
            };
          }
          return course;
        })
      );
      console.log("המשימה נמחקה בהצלחה");
      
    } catch (error) {
      console.error("שגיאה במחיקת המשימה:", error);
      alert("אירעה שגיאה במחיקת המשימה. אנא נסה שוב.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  // פונקציה לטעינת המשימות לכל קורס
  const loadTasksForCourses = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      
      const tasksRef = collection(db, "tasks");
      const tasksQuery = query(tasksRef, where("userId", "==", userId));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const allTasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const updatedCourses = courses.map(course => {
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
      case "גבוהה":
        return "priority-high";
      case "בינונית":
        return "priority-medium";
      case "נמוכה":
        return "priority-low";
      default:
        return "";
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
          {coursesWithTasks.map((course) => {
            const isExpanded = expandedCourses[course.id];
            const assignmentsToShow = course.assignments && course.assignments.length > 2 && !isExpanded 
              ? course.assignments.slice(0, 2) 
              : course.assignments;
            const hasMoreTasks = course.assignments && course.assignments.length > 2;

            return (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <div className="course-title-section">
                    <h3>{course.name}</h3>
                    <span className="course-semester">{course.semester || "סמסטר נוכחי"}</span>
                  </div>
                  <button
                    className="delete-course-btn"
                    onClick={() => deleteCourse(course.id)}
                    disabled={deletingCourseId === course.id}
                    title="מחק קורס"
                  >
                    {deletingCourseId === course.id ? "מוחק..." : "🗑️"}
                  </button>
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
                  {assignmentsToShow && assignmentsToShow.length > 0 && (
                    <div className="course-assignments">
                      <h4>משימות קורס:</h4>
                      <div className="assignments-list">
                        {assignmentsToShow.map((assignment) => (
                          <div key={assignment.id} className="assignment-card">
                            <div className="assignment-header">
                              <span className="assignment-title">{assignment.title}</span>
                              <div className="assignment-actions">
                                <span className={getStatusClass(assignment.status)}>
                                  {assignment.status}
                                </span>
                                <button
                                  className="delete-task-btn"
                                  onClick={() => deleteTask(assignment.id, course.id)}
                                  disabled={deletingTaskId === assignment.id}
                                  title="מחק משימה"
                                >
                                  {deletingTaskId === assignment.id ? "מוחק..." : "🗑️"}
                                </button>
                              </div>
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
                                  <span className={`detail-value ${getPriorityText(assignment.priority)}`}>
                                    {assignment.priority}
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
                      {hasMoreTasks && (
                        <button
                          onClick={() => toggleCourseExpansion(course.id)}
                          className="expand-tasks-btn"
                        >
                          {isExpanded 
                            ? `הצג פחות ↑` 
                            : `הצג עוד ${course.assignments.length - 2} משימות ↓`
                          }
                        </button>
                      )}
                    </div>
                  )}
                  {(!course.assignments || course.assignments.length === 0) && (
                    <div className="no-assignments">
                      <p>אין משימות קשורות לקורס זה</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;