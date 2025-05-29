import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddTaskDialog.css";
import { useDatePicker, formatDateForDisplay, months } from "../calender";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("בינונית");
  const [status, setStatus] = useState("לא הוחל");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
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
  
  const priorityOptions = ["נמוכה", "בינונית", "גבוהה", "דחופה"];
  const statusOptions = ["לא הוחל", "בתהליך", "הושלם", "נדחה"];

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !description.trim()) return;
    
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      const newTask = {
        name: taskName.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        priority,
        status,
        userId,
        projectId: null, // ניתן לקשר לפרויקט ספציפי
        courseId: null,  // ניתן לקשר לקורס ספציפי
        assignedTo: [],
        completedAt: null,
        estimatedHours: null,
        actualHours: null,
        tags: [],
        attachments: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // הוספה ל-Firebase
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      console.log("משימה נוספה בהצלחה עם ID:", docRef.id);
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
      if (onAddSuccess) {
        onAddSuccess(newTask);
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
      alert("שגיאה בהוספת המשימה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
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

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("בינונית");
    setStatus("לא הוחל");
    setIsDatePickerOpen(false);
    setIsPriorityOpen(false);
    setIsStatusOpen(false);
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
      title="הוספת משימה חדשה"
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-field">
          <label>
            שם המשימה: *
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onFocus={() => setIsDatePickerOpen(false)}
              required={true}
              disabled={isLoading}
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            תיאור המשימה: *
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
            עדיפות:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading) {
                    setIsPriorityOpen(!isPriorityOpen);
                    setIsDatePickerOpen(false);
                    setIsStatusOpen(false);
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
            סטטוס:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  if (!isLoading) {
                    setIsStatusOpen(!isStatusOpen);
                    setIsDatePickerOpen(false);
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
            תאריך יעד:
            <div className="custom-date-picker" ref={datePickerRef}>
              <div 
                className="date-input-header"
                onClick={() => {
                  if (!isLoading) {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsStatusOpen(false);
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
            disabled={isLoading || !taskName.trim() || !description.trim()}
          >
            {isLoading ? "מוסיף..." : "הוסף משימה"}
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddTaskDialog;