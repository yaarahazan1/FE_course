import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // שימוש בhook של לוח השנה
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

  // פונקציה לקבלת ID המשתמש הנוכחי
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
        teamMembers: [],
        owner: userId,
        collaborators: [],
        
        // תכנים קשורים
        tasks: [],
        milestones: [],
        documents: [],
        messages: [],
        attachments: [],
        
        // סטטיסטיקות
        totalTasks: 0,
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
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
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

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDueDate("");
    setStatus("פעיל");
    setCategory("אישי");
    setPriority("בינונית");
    setEstimatedHours("");
    setBudget("");
    setIsDatePickerOpen(false);
    setIsStatusOpen(false);
    setIsCategoryOpen(false);
    setIsPriorityOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
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
              onFocus={() => setIsDatePickerOpen(false)}
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
              onFocus={() => setIsDatePickerOpen(false)}
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
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
                    setIsCategoryOpen(false);
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
                    setIsDatePickerOpen(false);
                    setIsCategoryOpen(false);
                    setIsPriorityOpen(false);
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
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsStatusOpen(false);
                    setIsCategoryOpen(false);
                    setIsPriorityOpen(false);
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