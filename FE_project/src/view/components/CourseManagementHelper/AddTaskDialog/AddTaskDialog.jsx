import React, { useState } from "react";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddTaskDialog.css";
import { useDatePicker, formatDateForDisplay, months } from "../calender";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess, projects = [] }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("נמוכה");
  const [status, setStatus] = useState("ממתין");
  const [projectId, setProjectId] = useState("");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  

  const priorityOptions = ["גבוהה", "בינונית", "נמוכה"];
  const statusOptions = ["ממתין", "בתהליך", "הושלם"];

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);
    setIsPriorityOpen(false);
  };

    const handleStatusSelect = (selectedPriority) => {
    setStatus(selectedPriority);
    setIsStatusOpen(false);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !dueDate || !priority || !status) return;

    const selectedProject = projectId ? projects.find(p => p.id.toString() === projectId) : null;

    const newTask = {
      id: Date.now(), // Temporary ID for demonstration
      name: taskName,
      description,
      dueDate,
      priority,
      status,
      projectId: projectId || null,
      projectName: selectedProject ? selectedProject.name : null
    };

    onAddSuccess(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");
    setProjectId("");
    setIsDatePickerOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={handleCancel}
      title="הוספת משימה חדשה"
    >
      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>כותרת המשימה *</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onFocus={() => setIsDatePickerOpen(false)}
            placeholder="הזן כותרת למשימה"
            autoFocus
            required={true}/>
        </div>

        <div className="form-field">
          <label>תיאור המשימה *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setIsDatePickerOpen(false)}
            placeholder="הזן תיאור מפורט למשימה"
            rows="3"
            required={true}/>
        </div>

        <div className="form-field">
          <label className="required">תאריך יעד</label>
          <div className="custom-date-picker" ref={datePickerRef}>
            <div 
              className="date-input-header"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
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
        </div>

        <label>
          רמת עדיפות:
          <div className="custom-select">
            <div 
              className="select-header" 
              onClick={() => {
                setIsPriorityOpen(!isPriorityOpen);
                setIsDatePickerOpen(false);
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
            {isPriorityOpen && (
              <div className="select-options">
                {priorityOptions.map((option) => (
                  <div
                    key={option}
                    className={`select-option ${option === status ? 'selected' : ''}`}
                    onClick={() => handlePrioritySelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>

        <label>
          סטטוס:
          <div className="custom-select">
            <div 
              className="select-header" 
              onClick={() => {
                setStatus(!isStatusOpen);
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

        {projects.length > 0 && (
          <div className="form-field">
            <label>שייך לפרויקט</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              onFocus={() => setIsDatePickerOpen(false)}
            >
              <option value="">לא משויך לפרויקט</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="dialog-actions">
          <button type="button" className="button button-secondary" onClick={handleCancel}>
            ביטול
          </button>
          <button type="submit" className="button button-primary">
            שמור משימה
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddTaskDialog;