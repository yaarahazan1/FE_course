import React, { useState } from "react";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddProjectDialog.css";
import { useDatePicker, formatDateForDisplay, months } from "../calender"
const AddProjectDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("פעיל");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  
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
  
  const statusOptions = ["פעיל", "בתהליך", "הושלם", "מופסק"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onAddSuccess({ 
      name: projectName, 
      description,
      dueDate,
      status
    });
    resetForm();
    onClose();
  };

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setIsStatusOpen(false);
  };

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDueDate("");
    setStatus("פעיל");
    setIsDatePickerOpen(false);
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
            />
          </label>
        </div>
        
        <div className="form-field">
          <label>
            סטטוס הפרויקט:
            <div className="custom-select">
              <div 
                className="select-header" 
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsDatePickerOpen(false);
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
              {isStatusOpen && (
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
                  setIsDatePickerOpen(!isDatePickerOpen);
                  setIsStatusOpen(false);
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
              
              {isDatePickerOpen && (
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
          <button type="button" onClick={handleCancel} className="cancel-button">
            ביטול
          </button>
          <button type="submit" className="confirm-button">
            הוסף פרויקט
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddProjectDialog;