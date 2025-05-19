import React, { useState } from "react";
import "./AddTaskDialog.css";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !dueDate || !priority || !status) return;

    const newTask = {
      name: taskName,
      description,
      dueDate,
      priority,
      status,
    };

    onAddSuccess(newTask);
    onClose();
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">הוספת משימה חדשה</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            שם המשימה:
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </label>

          <label>
            תיאור:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </label>

          <label>
            תאריך יעד:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>

          <label>
            עדיפות:
            <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
              <option value="">בחר עדיפות</option>
              <option value="גבוהה">גבוהה</option>
              <option value="בינונית">בינונית</option>
              <option value="נמוכה">נמוכה</option>
            </select>
          </label>

          <label>
            סטטוס:
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">בחר סטטוס</option>
              <option value="ממתין">ממתין</option>
              <option value="בתהליך">בתהליך</option>
              <option value="הושלם">הושלם</option>
            </select>
          </label>

          <div className="modal-actions">
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

export default AddTaskDialog;
