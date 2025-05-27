import React from "react";
import "./AddTask.css";

const AddTask = ({ isOpen, onClose }) => {
  // פונקציה לטיפול בלחיצה על הרקע
  const handleOverlayClick = (e) => {
    // בדיקה שהלחיצה היא על הרקע ולא על תוכן הדיאלוג
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-task-overlay" onClick={handleOverlayClick}>
      <div className="add-task-modal">
        <h2 className="add-task-title">הוספת משימה חדשה</h2>
        <p className="add-task-p">מלא את הפרטים הבאים כדי ליצור משימה חדשה</p>
        <form className="add-task-form">
          <div className="form-field-add-task">
            <label htmlFor="task-name">שם המשימה</label>
            <input
              type="text"
              id="task-name"
              placeholder="לדוגמה: הכנת מצגת"
              className="input-field"
            />
          </div>

          <div className="form-field-add-task">
            <label htmlFor="description">תיאור</label>
            <textarea
              id="description"
              placeholder="הוסף תיאור למשימה"
              className="input-field textarea-field"
            ></textarea>
          </div>

          <div className="form-field-add-task">
            <label htmlFor="due-date">תאריך יעד</label>
            <input type="date" id="due-date" className="input-field" />
          </div>

          <div className="form-field-add-task">
            <label htmlFor="priority">עדיפות</label>
            <select id="priority" className="input-field">
              <option value="">בחר עדיפות</option>
              <option value="high">גבוהה</option>
              <option value="medium">בינונית</option>
              <option value="low">נמוכה</option>
            </select>
          </div>

          <div className="form-field-add-task">
            <label htmlFor="status">סטטוס</label>
            <select id="status" className="input-field">
              <option value="">בחר סטטוס</option>
              <option value="todo">ממתין לביצוע</option>
              <option value="in-progress">בתהליך</option>
              <option value="completed">הושלם</option>
            </select>
          </div>

          <div className="add-task-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="confirm-button">
              📅 הוסף משימה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;