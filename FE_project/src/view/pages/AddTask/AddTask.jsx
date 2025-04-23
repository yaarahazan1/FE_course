import React from "react";
import "./AddTask.css";

const AddTask = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="add-task-overlay">
      <div className="add-task-modal">
        <h2 className="add-task-title">הוספת משימה חדשה</h2>
        <form className="add-task-form">
          <div>
            <label htmlFor="task-name">שם המשימה</label>
            <input type="text" id="task-name" placeholder="לדוגמה: הכנת מצגת" />
          </div>

          <div>
            <label htmlFor="description">תיאור</label>
            <textarea id="description" placeholder="הוסף תיאור למשימה"></textarea>
          </div>

          <div>
            <label htmlFor="due-date">תאריך יעד</label>
            <input type="date" id="due-date" />
          </div>

          <div>
            <label htmlFor="priority">עדיפות</label>
            <select id="priority">
              <option value="">בחר עדיפות</option>
              <option value="high">גבוהה</option>
              <option value="medium">בינונית</option>
              <option value="low">נמוכה</option>
            </select>
          </div>

          <div>
            <label htmlFor="status">סטטוס</label>
            <select id="status">
              <option value="">בחר סטטוס</option>
              <option value="todo">ממתין לביצוע</option>
              <option value="in-progress">בתהליך</option>
              <option value="completed">הושלם</option>
            </select>
          </div>

          <div className="add-task-buttons">
            <button type="button" onClick={onClose}>ביטול</button>
            <button type="submit">📅 הוסף משימה</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
