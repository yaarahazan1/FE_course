// AddTaskDialog.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import "./AddTaskDialog.css";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    dueDate: null,
    description: "",
    priority: "בינונית"
  });
  const [errors, setErrors] = useState({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.length < 2) {
      newErrors.title = "כותרת חייבת להכיל לפחות 2 תווים";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "תאריך יעד הוא שדה חובה";
    }
    
    if (!["נמוכה", "בינונית", "גבוהה", "גבוהה מאוד"].includes(formData.priority)) {
      newErrors.priority = "יש לבחור רמת עדיפות";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateSelect = (date) => {
    setFormData({
      ...formData,
      dueDate: date
    });
    setIsDatePickerOpen(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would typically save the task to your backend or state management
      console.log("Task data:", formData);
      
      // Show success message (using a simple alert instead of toast library)
      alert("המשימה נוספה בהצלחה!");
      
      // Reset form and close dialog
      setFormData({
        title: "",
        dueDate: null,
        description: "",
        priority: "בינונית"
      });
      onAddSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">הוספת משימה חדשה</h2>
          <p className="dialog-description">
            מלא את הפרטים הבאים כדי ליצור משימה חדשה
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-field">
            <label className="form-label">כותרת המשימה</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="הזן כותרת למשימה" 
              className="form-input" 
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>
          
          <div className="form-field">
            <label className="form-label">תאריך יעד</label>
            <div className="date-picker-container">
              <button
                type="button"
                className="date-picker-trigger"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                {formData.dueDate ? (
                  format(formData.dueDate, "dd/MM/yyyy")
                ) : (
                  <span>בחר תאריך</span>
                )}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </button>
              
              {isDatePickerOpen && (
                <div className="calendar-dropdown">
                  {/* Simple calendar implementation - in a real app, you would use a proper calendar component */}
                  <div className="simple-calendar">
                    <div className="calendar-header">
                      <button type="button" onClick={() => {
                        const today = new Date();
                        handleDateSelect(today);
                      }}>היום</button>
                    </div>
                    <div className="calendar-days">
                      {[...Array(30)].map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        return (
                          <button 
                            key={i}
                            type="button"
                            className="calendar-day"
                            onClick={() => handleDateSelect(date)}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
          </div>
          
          <div className="form-field">
            <label className="form-label">תיאור המשימה</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="הזן תיאור מפורט למשימה" 
              className="form-textarea" 
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
          
          <div className="form-field">
            <label className="form-label">רמת עדיפות</label>
            <div className="select-container">
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="נמוכה">נמוכה</option>
                <option value="בינונית">בינונית</option>
                <option value="גבוהה">גבוהה</option>
                <option value="גבוהה מאוד">גבוהה מאוד</option>
              </select>
            </div>
            {errors.priority && <div className="form-error">{errors.priority}</div>}
          </div>
          
          <div className="dialog-footer">
            <button type="submit" className="submit-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              שמור משימה
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskDialog;