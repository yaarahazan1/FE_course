import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
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
  
  // State for dropdowns
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  useEffect(() => {
    if (isOpen) {
      loadAvailableTasksAndCourses();
    }
  }, [isOpen]);

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
        ...doc.data()
      }));
      setAvailableCourses(courses);
      
    } catch (error) {
      console.error("שגיאה בטעינת משימות וקורסים:", error);
    }
  };

  // פונקציה לקבלת ID המשתמש הנוכحי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim()) return;
    
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      const newProject = {
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
          role: "member",
          addedAt: new Date(),
          permissions: ["view", "edit"]
        })),
        
        // חיבור למשימות וקורס
        relatedTasks: selectedTasks,
        relatedCourse: selectedCourse || null,
        
        // תכנים קשורים
        tasks: [],
        milestones: [],
        documents: [],
        messages: [],
        attachments: [],
        
        // סטטיסטיקות
        totalTasks: selectedTasks.length,
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
          details: "Project created"
        }],
        
        // תאריכים מערכת
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // הוספה ל-Firebase
      const docRef = await addDoc(collection(db, "projects"), newProject);
      console.log("פרויקט נוסף בהצלחה עם ID:", docRef.id);
      
      // עדכון המשימות הקשורות
      await updateRelatedTasks(selectedTasks, docRef.id);
      
      // קריאה לפונקציה מהקומפונטה האב אם נדרש
      if (onAddSuccess) {
        onAddSuccess({ ...newProject, id: docRef.id });
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("שגיאה בהוספת פרויקט:", error);
      alert("שגיאה בהוספת הפרויקט. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // עדכון המשימות הקשורות
  const updateRelatedTasks = async () => {
    try {
      // for (const taskId of taskIds) {
      //   // כאן תוכל לעדכן את המשימות בFirebase שיהיו קשורות לפרויקט
      //   // זה דורש עדכון של המסמכים במאגר המידע
      // }
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
    if (!newMemberName.trim()) return;
    
    const newMember = {
      id: Date.now().toString(), // ID זמני
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || null,
      role: "member",
      addedAt: new Date()
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setIsAddingMember(false);
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
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsPriorityOpen(false);
    setIsTasksOpen(false);
    setIsCoursesOpen(false);
    setIsAddingMember(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const closeAllDropdowns = () => {
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsPriorityOpen(false);
    setIsTasksOpen(false);
    setIsCoursesOpen(false);
  };

  if (!isOpen) return null;

  return (
    <DialogComponent 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="הוספת פרויקט חדש"
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-field">
          <label>
            שם הפרויקט: *
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onFocus={closeAllDropdowns}
              required={true}
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תיאור הפרויקט: *
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={closeAllDropdowns}
              rows="3"
              required={true}
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            קטגוריה:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading) {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
                    setIsPriorityOpen(false);
                    setIsTasksOpen(false);
                    setIsCoursesOpen(false);
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
              {isCategoryOpen && !isLoading && (
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
                  if (!isLoading) {
                    setIsPriorityOpen(!isPriorityOpen);
                    closeAllDropdowns();
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
              {isPriorityOpen && !isLoading && (
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
                  if (!isLoading) {
                    setIsStatusOpen(!isStatusOpen);
                    closeAllDropdowns();
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
              {isStatusOpen && !isLoading && (
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
                  if (!isLoading) {
                    setIsTasksOpen(!isTasksOpen);
                    closeAllDropdowns();
                    setIsTasksOpen(true);
                  }
                }}
              >
                <span>
                  {selectedTasks.length > 0 
                    ? `נבחרו ${selectedTasks.length} משימות`
                    : "בחר משימות"}
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
              {isTasksOpen && !isLoading && (
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

        {/* חיבור לקורס */}
        <div className="form-field">
          <label>
            קורס קשור:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading) {
                    setIsCoursesOpen(!isCoursesOpen);
                    closeAllDropdowns();
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
              {isCoursesOpen && !isLoading && (
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
                      {course.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
        </div>

        {/* חברי צוות */}
        <div className="form-field">
          <label>
            חברי צוות:
            <div className="team-members-container">
              {teamMembers.length > 0 && (
                <div className="team-members-list">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="team-member-item">
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        {member.email && (
                          <span className="member-email">{member.email}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="remove-member-btn"
                        onClick={() => removeTeamMember(member.id)}
                        disabled={isLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {isAddingMember ? (
                <div className="add-member-form">
                  <div className="member-inputs">
                    <input
                      type="text"
                      placeholder="שם חבר הצוות"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      onFocus={closeAllDropdowns}
                      disabled={isLoading}
                    />
                    <input
                      type="email"
                      placeholder="אימייל (אופציונלי)"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      onFocus={closeAllDropdowns}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="member-actions">
                    <button
                      type="button"
                      className="add-member-confirm-btn"
                      onClick={addTeamMember}
                      disabled={isLoading || !newMemberName.trim()}
                    >
                      הוסף
                    </button>
                    <button
                      type="button"
                      className="add-member-cancel-btn"
                      onClick={() => {
                        setIsAddingMember(false);
                        setNewMemberName("");
                        setNewMemberEmail("");
                      }}
                      disabled={isLoading}
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-member-btn"
                  onClick={() => {
                    setIsAddingMember(true);
                    closeAllDropdowns();
                  }}
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  הוסף חבר צוות
                </button>
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
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              onFocus={closeAllDropdowns}
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
              onFocus={closeAllDropdowns}
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
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsStatusOpen(false);
                    setIsCategoryOpen(false);
                    setIsPriorityOpen(false);
                    setIsTasksOpen(false);
                    setIsCoursesOpen(false);
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