import React, { useState, useRef, useEffect } from "react";
import { collection, serverTimestamp, getDocs, query, where, runTransaction, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddTaskDialog.css";
import { useDatePicker, formatDateForDisplay, months } from "../calender";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("בינונית");
  const [status, setStatus] = useState("לא הוחל");
  const [category, setCategory] = useState("כללי");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [actualHours, setActualHours] = useState("");
  const [courseId, setCourseId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  
  const isSubmittingRef = useRef(false);
  const lastSubmitTimeRef = useRef(0);
  const submitCountRef = useRef(0); 
  const abortControllerRef = useRef(null); 
  
  const {
    isDatePickerOpen,
    setIsDatePickerOpen,
    currentMonth,
    currentYear,
    dueDate,
    setDueDate,
    datePickerRef,
    navigateMonth,
    clearDate,
    selectToday,
    renderCalendar
  } = useDatePicker();
  
  const priorityOptions = ["נמוכה", "בינונית", "גבוהה", "דחופה"];
  const statusOptions = ["לא הוחל", "בתהליך", "הושלם", "נדחה", "ממתין"];
  const categoryOptions = ["כללי", "אקדמי", "עבודה", "אישי", "פרויקט", "בחינה"];

  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = getCurrentUserId();
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        
        const courses = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          courseCode: doc.data().courseCode
        }));
        
        setAvailableCourses(courses);
      } catch (error) {
        console.error("שגיאה בטעינת קורסים:", error);
      }
    };

    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // בדיקות בסיסיות מוקדמות
    if (!taskName.trim() || !description.trim()) {
      console.log("חסרים שדות חובה");
      return;
    }
    
    // הגנה חזקה מפני הגשות כפולות
    if (isLoading || isSubmittingRef.current) {
      console.log("כבר בתהליך הגשה");
      return;
    }
    
    // הגנה מפני הגשות כפולות - הגדלתי ל-5 שניות
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 5000) {
      console.log("מניעת הגשה כפולה - זמן קצר מדי מההגשה הקודמת");
      return;
    }
    
    // הגנה מפני הגשות רבות ברצף
    submitCountRef.current += 1;
    if (submitCountRef.current > 3) {
      console.log("יותר מדי ניסיונות הגשה");
      alert("יותר מדי ניסיונות הגשה. אנא רענן את הדף.");
      return;
    }
    
    // סימון תחילת הגשה
    isSubmittingRef.current = true;
    lastSubmitTimeRef.current = now;
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      
      const taskHash = `${now}_${Math.random().toString(36).substr(2, 15)}`.substring(0, 20);
      
      const uniqueId = `task_${userId}_${now}_${taskHash}_${Math.random().toString(36).substr(2, 8)}`;
      
      const result = await runTransaction(db, async () => {        
        const uniqueQuery = query(
          collection(db, "tasks"),
          where("uniqueId", "==", uniqueId)
        );
        
        const uniqueSnapshot = await getDocs(uniqueQuery);
        
        if (!uniqueSnapshot.empty) {
          throw new Error("DUPLICATE_UNIQUE_ID");
        }

        const taskRef = doc(db, "tasks", uniqueId);
        
        const selectedCourse = availableCourses.find(course => course.id === courseId);
        const courseName = selectedCourse ? selectedCourse.name : "";
        
        const newTask = {
          uniqueId,
          taskHash,
          
          creationTimestamp: now,
          submissionAttempt: submitCountRef.current,
          
          title: taskName.trim(),
          description: description.trim(),
          category,
          priority,
          status,
          
          dueDate: dueDate || null,
          startDate: null,
          completedAt: null,
          reminderDate: null,
          
          userId,
          isCompleted: status === "הושלם",
          isArchived: false,
          isPublic: false,
          
          projectId: projectId.trim() || null,
          courseId: courseId || null,
          courseName: courseName || "",
          parentTaskId: null,
          
          estimatedHours: estimatedHours ? Number(estimatedHours) : null,
          actualHours: actualHours ? Number(actualHours) : 0,
          progressPercentage: status === "הושלם" ? 100 : (status === "בתהליך" ? 50 : 0),
          
          assignedTo: [],
          assignedBy: userId,
          collaborators: [],
          
          subtasks: [],
          comments: [],
          attachments: [],
          documents: [],
          links: [],
          
          tags: [],
          keywords: [],
          labels: [],
          
          notifications: {
            reminderEnabled: true,
            reminderDays: 1,
            emailNotification: false,
            pushNotification: true
          },
          
          location: "",
          notes: "",
          instructions: "",
          
          viewCount: 0,
          editCount: 0,
          completionRate: status === "הושלם" ? 100 : 0,
          
          history: [{
            action: "created",
            timestamp: new Date(),
            userId,
            details: "Task created",
            uniqueId
          }],
          
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastViewedAt: null,
          lastEditedAt: null
        };
                
        await setDoc(taskRef, newTask);
        
        return { id: taskRef.id, ...newTask };
      });
      
      console.log("משימה נוספה בהצלחה עם ID:", result.id, "UniqueId:", uniqueId);
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
      if (onAddSuccess) {
        onAddSuccess(result);
      }
      
      // איפוס הטופס וסגירה רק אחרי הצלחה מלאה
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
      
      // טיפול בשגיאות ספציפיות
      if (error.message === "DUPLICATE_TASK") {
        console.log("משימה כפולה נמנעה");
        alert("משימה דומה כבר קיימת. אנא בדוק את רשימת המשימות.");
      } else if (error.message === "DUPLICATE_UNIQUE_ID") {
        console.log("ID כפול נמנע");
        alert("שגיאה טכנית. אנא נסה שוב.");
      } else if (error.code === 'permission-denied') {
        alert("אין לך הרשאה להוסיף משימות. אנא התחבר מחדש.");
      } else {
        alert("שגיאה בהוספת המשימה. אנא נסה שוב.");
      }
      
    } finally {
      // איפוס דגלי ההגשה תמיד
      isSubmittingRef.current = false;
      setIsLoading(false);
      
      // איפוס מונה ההגשות אחרי זמן
      setTimeout(() => {
        submitCountRef.current = 0;
      }, 30000); // איפוס אחרי 30 שניות
    }
  };

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);
    setIsPriorityOpen(false);
  };

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setIsStatusOpen(false);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsCategoryOpen(false);
  };

  const handleCourseSelect = (selectedCourseId) => {
    setCourseId(selectedCourseId);
    setIsCourseOpen(false);
  };

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("בינונית");
    setStatus("לא הוחל");
    setCategory("כללי");
    setEstimatedHours("");
    setActualHours("");
    setCourseId("");
    setProjectId("");
    setIsDatePickerOpen(false);
    setIsPriorityOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsCourseOpen(false);
    
    // איפוס מלא של דגלי ההגשה
    isSubmittingRef.current = false;
    lastSubmitTimeRef.current = 0;
    submitCountRef.current = 0;
    
    // ביטול בקשות פעילות
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    // ביטול בקשות פעילות
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    resetForm();
    onClose();
  };

  // מניעת הגשה בלחיצה על Enter אם כבר בתהליך הגשה
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      if (isLoading || isSubmittingRef.current) {
        e.preventDefault();
        return;
      }
      
      // אם זה לא שדה טקסט רב-שורות, מנע שליחה באנטר
      if (e.target.tagName.toLowerCase() !== 'textarea') {
        e.preventDefault();
      }
    }
  };

  // סגירת כל הדרופדאונים
  const closeAllDropdowns = () => {
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsPriorityOpen(false);
    setIsCategoryOpen(false);
    setIsCourseOpen(false);
  };

  if (!isOpen) return null;

  return (
    <DialogComponent 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="הוספת משימה חדשה"
    >
      <form onSubmit={handleSubmit} className="modal-form" onKeyDown={handleKeyDown}>
        <div className="form-field">
          <label>
            שם המשימה: *
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onFocus={closeAllDropdowns}
              placeholder="הכנס שם משימה"
              required={true}
              autoFocus
              disabled={isLoading}
              maxLength={100}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תיאור המשימה: *
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={closeAllDropdowns}
              placeholder="תאר את המשימה בפירוט"
              rows="3"
              required={true}
              disabled={isLoading}
              maxLength={500}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            קורס קשור:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsCourseOpen(!isCourseOpen);
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
                    setIsPriorityOpen(false);
                    setIsCategoryOpen(false);
                  }
                }}
              >
                <span>
                  {courseId ? 
                    availableCourses.find(course => course.id === courseId)?.name || "בחר קורס" 
                    : "בחר קורס (אופציונלי)"}
                </span>
                <svg 
                  className={`select-arrow ${isCourseOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {isCourseOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options">
                  <div
                    className={`select-option ${!courseId ? 'selected' : ''}`}
                    onClick={() => handleCourseSelect("")}
                  >
                    ללא קורס
                  </div>
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`select-option ${course.id === courseId ? 'selected' : ''}`}
                      onClick={() => handleCourseSelect(course.id)}
                    >
                      {course.name} {course.courseCode && `(${course.courseCode})`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
        
        <div className="form-field">
          <label>
            קטגוריה:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
                    setIsPriorityOpen(false);
                    setIsCourseOpen(false);
                  }
                }}
              >
                <span>{category}</span>
                <svg 
                  className={`select-arrow ${isCategoryOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {isCategoryOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options">
                  {categoryOptions.map((option) => (
                    <div
                      key={option}
                      className={`select-option ${option === category ? 'selected' : ''}`}
                      onClick={() => handleCategorySelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
        
        <div className="form-field">
          <label>
            עדיפות:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsPriorityOpen(!isPriorityOpen);
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
                    setIsCategoryOpen(false);
                    setIsCourseOpen(false);
                  }
                }}
              >
                <span>{priority}</span>
                <svg 
                  className={`select-arrow ${isPriorityOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {isPriorityOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options">
                  {priorityOptions.map((option) => (
                    <div
                      key={option}
                      className={`select-option ${option === priority ? 'selected' : ''}`}
                      onClick={() => handlePrioritySelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="form-field">
          <label>
            סטטוס:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsStatusOpen(!isStatusOpen);
                    setIsDatePickerOpen(false);
                    setIsPriorityOpen(false);
                    setIsCategoryOpen(false);
                    setIsCourseOpen(false);
                  }
                }}
              >
                <span>{status}</span>
                <svg 
                  className={`select-arrow ${isStatusOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              {isStatusOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options">
                  {statusOptions.map((option) => (
                    <div
                      key={option}
                      className={`select-option ${option === status ? 'selected' : ''}`}
                      onClick={() => handleStatusSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>
        
        <div className="form-field">
          <label>
            שעות משוערות:
            <input
              type="number"
              min="0"
              max="1000"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="מספר שעות משוער"
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            שעות בפועל:
            <input
              type="number"
              min="0"
              max="1000"
              step="0.5"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              placeholder="מספר שעות בפועל"
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            קישור לפרויקט:
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="שם פרויקט (אופציונלי)"
              disabled={isLoading}
              maxLength={50}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תאריך יעד:
            <div className="custom-date-picker" ref={datePickerRef}>
              <div 
                className="date-input-header"
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsStatusOpen(false);
                    setIsPriorityOpen(false);
                    setIsCategoryOpen(false);
                    setIsCourseOpen(false);
                  }
                }}
              >
                <span>{formatDateForDisplay(dueDate)}</span>
                <svg 
                  className="calendar-icon"
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#666" 
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              
              {isDatePickerOpen && !isLoading && !isSubmittingRef.current && (
                <div className="calendar-dropdown">
                  <div className="calendar-header">
                    <button 
                      type="button"
                      className="nav-button-calender"
                      onClick={() => navigateMonth('prev')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/> 
                      </svg>
                    </button>
                    
                    <span className="month-year">
                      {months[currentMonth]} {currentYear}
                    </span>
                    
                    <button 
                      type="button"
                      className="nav-button-calender"
                      onClick={() => navigateMonth('next')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="calendar-weekdays">
                    <div className="weekday">Su</div>
                    <div className="weekday">Mo</div>
                    <div className="weekday">Tu</div>
                    <div className="weekday">We</div>
                    <div className="weekday">Th</div>
                    <div className="weekday">Fr</div>
                    <div className="weekday">Sa</div>
                  </div>
                  
                  <div className="calendar-grid">
                    {renderCalendar()}
                  </div>
                  
                  <div className="calendar-actions">
                    <button 
                      type="button" 
                      className="calendar-action-btn clear-btn"
                      onClick={clearDate}
                    >
                      Clear
                    </button>
                    <button 
                      type="button" 
                      className="calendar-action-btn today-btn"
                      onClick={selectToday}
                    >
                      Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
          
        <div className="modal-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="cancel-button"
            disabled={isLoading}
          >
            ביטול
          </button>
          <button 
            type="submit" 
            className="confirm-button"
            disabled={
              isLoading || 
              !taskName.trim() || 
              !description.trim() || 
              isSubmittingRef.current ||
              submitCountRef.current > 3
            }
          >
            {isLoading ? "מוסיף..." : "הוסף משימה"}
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddTaskDialog;