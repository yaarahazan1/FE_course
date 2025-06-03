import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc} from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddProjectDialog.css";
import { useDatePicker, formatDateForDisplay, months } from "../calender";

const AddProjectDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("פעיל");
  const [category, setCategory] = useState("אישי");
  const [priority, setPriority] = useState("בינונית");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [availableTasks, setAvailableTasks] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("מנהל פרויקט");
  
  // State for dropdowns
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // הגנה משופרת מפני הגשות כפולות
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
  
  const statusOptions = ["פעיל", "בתהליך", "הושלם", "מופסק", "ממתין לאישור"];
  const categoryOptions = ["אישי", "אקדמי", "עבודה", "משפחתי", "בריאות"];
  const priorityOptions = ["נמוכה", "בינונית", "גבוהה", "דחופה"];
  const roleOptions = ["מנהל פרויקט", "מפתח תוכנה", "מוביל טכנולוגי", "מנהל מוצר", "מהנדס בדיקות", "מעצב UX/UI", "מהנדס DevOps", "אנליסט נתונים", "מפתח מובייל", "צופה"]; 
  
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  useEffect(() => {
    if (isOpen) {
      loadAvailableTasksAndCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadAvailableTasksAndCourses = async () => {
    try {
      const userId = getCurrentUserId();
      
      // טעינת משימות זמינות
      const tasksQuery = query(
        collection(db, "tasks"), 
        where("userId", "==", userId),
        where("status", "!=", "הושלם")
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableTasks(tasks);

      // טעינת קורסים זמינים
      const coursesQuery = query(
        collection(db, "courses"), 
        where("userId", "==", userId)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const courses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        courseCode: doc.data().courseCode
      }));
      setAvailableCourses(courses);
      
    } catch (error) {
      console.error("שגיאה בטעינת משימות וקורסים:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // בדיקות בסיסיות מוקדמות
    if (!projectName.trim() || !description.trim()) {
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
    
    // ביטול בקשה קודמת אם קיימת
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // יצירת controller חדש לביטול
    abortControllerRef.current = new AbortController();
    
    // סימון תחילת הגשה
    isSubmittingRef.current = true;
    lastSubmitTimeRef.current = now;
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      
      // בדיקת כפילויות - חיפוש פרויקטים דומים
      const duplicateCheckQuery = query(
        collection(db, "projects"),
        where("userId", "==", userId),
        where("name", "==", projectName.trim()),
        where("createdAt", ">", new Date(now - 10000)) // בדיקה של 10 שניות אחורה
      );
      
      const duplicateSnapshot = await getDocs(duplicateCheckQuery);
      if (!duplicateSnapshot.empty) {
        console.log("פרויקט דומה כבר קיים");
        alert("פרויקט עם שם דומה נוסף לאחרונה. אנא המתן מעט ונסה שוב.");
        return;
      }
      
      // יצירת ID ייחודי חזק יותר לפרויקט
      const uniqueId = `project_${userId}_${now}_${submitCountRef.current}_${Math.random().toString(36).substr(2, 12)}`;
      
      // מציאת פרטי הקורס הנבחר
      const selectedCourseData = availableCourses.find(course => course.id === selectedCourse);
      const courseName = selectedCourseData ? selectedCourseData.name : "";
      
      const newProject = {
        // מזהה ייחודי חזק למניעת כפילויות
        uniqueId,
        
        // חותמת זמן נוספת לזיהוי
        creationTimestamp: now,
        submissionAttempt: submitCountRef.current,
        
        // שדות בסיסיים
        name: projectName.trim(),
        description: description.trim(),
        category,
        status,
        priority,
        
        // תאריכים
        dueDate: dueDate || null,
        startDate: new Date(),
        completedDate: null,
        
        // מטאדטה
        userId,
        isArchived: false,
        isPublic: false,
        isDeleted: false,
        
        // משאבים
        estimatedHours: estimatedHours ? Number(estimatedHours) : null,
        actualHours: 0,
        budget: budget ? Number(budget) : null,
        spentBudget: 0,
        
        // צוות ושיתוף
        teamMembers: teamMembers,
        owner: userId,
        collaborators: teamMembers.map(member => ({
          ...member,
          addedAt: new Date(),
          permissions: ["view", "edit"]
        })),
        
        // חיבור למשימות וקורס
        relatedTasks: selectedTasks,
        relatedCourse: selectedCourse || null,
        courseId: selectedCourse || null,
        courseName: courseName || "",
        
        // תכנים קשורים
        tasks: [],
        milestones: [],
        documents: [],
        messages: [],
        attachments: [],
        
        // סטטיסטיקות
        totalTasks: selectedTasks.length || 0,
        completedTasks: 0,
        progressPercentage: 0,
        
        // הגדרות
        settings: {
          notifications: true,
          reminderDays: 1,
          autoArchive: false,
          requireApproval: false
        },
        
        // תגיות ומילות מפתח
        tags: [],
        keywords: [],
        
        // היסטוריה
        history: [{
          action: "created",
          timestamp: new Date(),
          userId,
          details: "Project created",
          uniqueId
        }],
        
        // תאריכים מערכת
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // הוספה ל-Firebase עם timeout ו-abort signal
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('Request timeout')), 15000);
        
        // ביטול הtimeout אם הבקשה בוטלה
        abortControllerRef.current.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error('Request aborted'));
        });
      });
      
      const addProjectPromise = addDoc(collection(db, "projects"), newProject);
      console.log("addProjectPromise:", addProjectPromise);
      const docRef = await Promise.race([addProjectPromise, timeoutPromise]);
      
      // בדיקה שהבקשה לא בוטלה
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Request was aborted');
      }
      
      console.log("פרויקט נוסף בהצלחה עם ID:", docRef.id, "UniqueId:", uniqueId);
      
      // בדיקה נוספת לוודא שהפרויקט באמת נוסף ולא קיים כפל
      const verificationQuery = query(
        collection(db, "projects"),
        where("uniqueId", "==", uniqueId)
      );
      const verificationSnapshot = await getDocs(verificationQuery);
      
      if (verificationSnapshot.size > 1) {
        console.error("זוהה כפל של פרויקט!", uniqueId);
      }
      
      // עדכון המשימות הקשורות
      await updateRelatedTasks(selectedTasks, docRef.id);
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
      if (onAddSuccess && !abortControllerRef.current?.signal.aborted) {
        onAddSuccess({ ...newProject, id: docRef.id });
      }
      
      // איפוס הטופס וסגירה רק אחרי הצלחה מלאה
      if (!abortControllerRef.current?.signal.aborted) {
        resetForm();
        onClose();
      }
      
    } catch (error) {
      // אל תציג שגיאות של ביטול בקשות
      if (error.message === 'Request was aborted') {
        console.log("בקשה בוטלה");
        return;
      }
      
      console.error("שגיאה בהוספת פרויקט:", error);
      
      // הצגת הודעת שגיאה ספציפית
      if (error.message === 'Request timeout') {
        alert("הבקשה לקחה יותר מדי זמן. אנא בדוק את החיבור לאינטרנט ונסה שוב.");
      } else if (error.code === 'permission-denied') {
        alert("אין לך הרשאה להוסיף פרויקטים. אנא התחבר מחדש.");
      } else {
        alert("שגיאה בהוספת הפרויקט. אנא נסה שוב.");
      }
      
    } finally {
      // איפוס דגלי ההגשה תמיד
      isSubmittingRef.current = false;
      setIsLoading(false);
      abortControllerRef.current = null;
      
      // איפוס מונה ההגשות אחרי זמן
      setTimeout(() => {
        submitCountRef.current = 0;
      }, 30000);
    }
  };

  // עדכון המשימות הקשורות
  const updateRelatedTasks = async (taskIds, projectId) => {
    try {
      if (!taskIds || taskIds.length === 0) return;
      
      for (const taskId of taskIds) {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
          relatedProject: projectId,
          projectId: projectId,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("שגיאה בעדכון משימות קשורות:", error);
    }
  };

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setIsStatusOpen(false);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsCategoryOpen(false);
  };

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);
    setIsPriorityOpen(false);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setIsCoursesOpen(false);
  };

  const addTeamMember = () => {
    if (!newMemberName.trim()) {
      alert("יש להזין שם לחבר הצוות");
      return;
    }
    
    const existingMember = teamMembers.find(member => 
      member.name.toLowerCase() === newMemberName.trim().toLowerCase() ||
      (member.email && newMemberEmail.trim() && member.email.toLowerCase() === newMemberEmail.trim().toLowerCase())
    );
    
    if (existingMember) {
      alert("חבר צוות עם השם או האימייל הזה כבר קיים");
      return;
    }
    
    const newMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || null,
      role: newMemberRole,
      addedAt: new Date(),
      status: "active"
    };
    
    setTeamMembers(prevMembers => [...prevMembers, newMember]);
    
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("מנהל פרויקט");
    
    console.log("חבר צוות נוסף:", newMember);
  };

  const removeTeamMember = (memberId) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDueDate("");
    setStatus("פעיל");
    setCategory("אישי");
    setPriority("בינונית");
    setEstimatedHours("");
    setBudget("");
    setSelectedTasks([]);
    setSelectedCourse("");
    setTeamMembers([]);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("בלר תפקיד");
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsPriorityOpen(false);
    setIsTasksOpen(false);
    setIsCoursesOpen(false);
    
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
      
      if (e.target.tagName.toLowerCase() !== 'textarea') {
        e.preventDefault();
      }
    }
  };

  // פונקציה לסגירת הדרופדאונים הראשיים בלבד
  const closeMainDropdowns = () => {
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsPriorityOpen(false);
    setIsTasksOpen(false);
    setIsCoursesOpen(false);
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      manager: "מנהל פרויקט",
      developer: "מפתח תוכנה",
      techLead: "מוביל טכנולוגי",
      productManager: "מנהל מוצר",
      qaEngineer: "מהנדס בדיקות",
      uxDesigner: "מעצב UX/UI",
      devOps: "מהנדס DevOps",
      dataAnalyst: "אנליסט נתונים",
      mobileDeveloper: "מפתח מובייל",
      viewer: "צופה"
    };
    return roleNames[role] || role;
  };

  if (!isOpen) return null;

  return (
    <DialogComponent 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="הוספת פרויקט חדש"
    >
      <form onSubmit={handleSubmit} className="modal-form" onKeyDown={handleKeyDown}>
        <div className="form-field">
          <label>
            שם הפרויקט: *
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="הכנס שם פרויקט"
              required={true}
              autoFocus
              disabled={isLoading}
              maxLength={100}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תיאור הפרויקט: *
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תאר את הפרויקט בפירוט"
              rows="3"
              required={true}
              disabled={isLoading}
              maxLength={500}
            />
          </label>
        </div>

        {/* חיבור לקורס */}
        <div className="form-field">
          <label>
            קורס קשור:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsCoursesOpen(!isCoursesOpen);
                    closeMainDropdowns();
                    setIsCoursesOpen(true);
                  }
                }}
              >
                <span>
                  {selectedCourse 
                    ? availableCourses.find(c => c.id === selectedCourse)?.name || "קורס לא נמצא"
                    : "בחר קורס (אופציונלי)"}
                </span>
                <svg 
                  className={`select-arrow ${isCoursesOpen ? 'open' : ''}`}
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
              {isCoursesOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options">
                  <div
                    className={`select-option ${!selectedCourse ? 'selected' : ''}`}
                    onClick={() => handleCourseSelect("")}
                  >
                    ללא קורס
                  </div>
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`select-option ${course.id === selectedCourse ? 'selected' : ''}`}
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
                    closeMainDropdowns();
                    setIsCategoryOpen(true);
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
                    closeMainDropdowns();
                    setIsPriorityOpen(true);
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
            סטטוס הפרויקט:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsStatusOpen(!isStatusOpen);
                    closeMainDropdowns();
                    setIsStatusOpen(true);
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

        {/* חיבור למשימות */}
        <div className="form-field">
          <label>
            משימות קשורות:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading && !isSubmittingRef.current) {
                    setIsTasksOpen(!isTasksOpen);
                    closeMainDropdowns();
                    setIsTasksOpen(true);
                  }
                }}
              >
                <span>
                  {selectedTasks.length > 0 
                    ? `נבחרו ${selectedTasks.length} משימות`
                    : `בחר משימות (${selectedTasks.length})`}
                </span>
                <svg 
                  className={`select-arrow ${isTasksOpen ? 'open' : ''}`}
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
              {isTasksOpen && !isLoading && !isSubmittingRef.current && (
                <div className="select-options multi-select">
                  {availableTasks.length === 0 ? (
                    <div className="no-options">אין משימות זמינות</div>
                  ) : (
                    availableTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`select-option ${selectedTasks.includes(task.id) ? 'selected' : ''}`}
                        onClick={() => handleTaskSelect(task.id)}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedTasks.includes(task.id)}
                          readOnly
                        />
                        <span>{task.title || task.name}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="form-field">
          <label>
            חברי צוות:
            <div className="team-members-container">
              {teamMembers.length > 0 && (
                <div className="existing-members">
                  <div className="members-title">חברי צוות נוכחיים:</div>
                  <div className="team-members-list">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="team-member-card">
                        <div className="member-details">
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{getRoleDisplayName(member.role)}</div>
                          {member.email && (
                            <div className="member-email">{member.email}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="remove-member-btn"
                          onClick={() => removeTeamMember(member.id)}
                          disabled={isLoading}
                          title="הסר חבר צוות"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* טופס הוספת חבר צוות חדש */}
              <div className="add-member-section">
                <div className="add-member-title">הוסף חבר צוות חדש:</div>
                
                <div className="add-member-form">
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">שם מלא *</label>
                      <input
                        type="text"
                        placeholder="הזן שם מלא"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        disabled={isLoading}
                        className="member-input"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">אימייל</label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        disabled={isLoading}
                        className="member-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">תפקיד</label>
                      <select 
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        disabled={isLoading}
                        className="member-role-select-simple"
                      >
                        {roleOptions.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {getRoleDisplayName(roleOption)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <div className="add-member-actions">
                        <button
                          type="button"
                          className="add-member-btn"
                          onClick={addTeamMember}
                          disabled={isLoading || !newMemberName.trim()}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14m-7-7h14"/>
                          </svg>
                          הוסף חבר
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
        
        <div className="form-field">
          <label>
            שעות משוערות:
            <input
              type="number"
              min="0"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="מספר שעות"
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תקציב (₪):
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="תקציב בשקלים"
              disabled={isLoading}
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
                  if (!isLoading) {
                    const wasOpen = isDatePickerOpen;
                    // סוגר את כל הדרופדאונים הראשיים
                    setIsStatusOpen(false);
                    setIsCategoryOpen(false);
                    setIsPriorityOpen(false);
                    setIsTasksOpen(false);
                    setIsCoursesOpen(false);
                    // פותח/סוגר את date picker
                    setIsDatePickerOpen(!wasOpen);
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
              
              {isDatePickerOpen && !isLoading && (
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
            disabled={isLoading || !projectName.trim() || !description.trim()}
          >
            {isLoading ? "מוסיף..." : "הוסף פרויקט"}
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddProjectDialog;