import React, { useState } from "react";
import "./AddProjectDialog.css";

const AddProjectDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onAddSuccess({ 
      name: projectName, 
      description,
      dueDate
    });
    setProjectName("");
    setDescription("");
    setDueDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">הוסף פרויקט חדש</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            שם הפרויקט:
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </label>
          <label>
            תיאור הפרויקט:
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
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              ביטול
            </button>
            <button type="submit" className="confirm-button">
              הוסף פרויקט
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectDialog;