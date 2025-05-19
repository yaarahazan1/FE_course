import React, { useState } from "react";
import "./AddCourseDialog.css";

const AddCourseDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [courseName, setCourseName] = useState("");
  const [lecturer, setLecturer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    // ניתן להרחיב כאן לפעולה ממשית
    onAddSuccess({ name: courseName, lecturer });
    setCourseName("");
    setLecturer("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">הוסף קורס חדש</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            שם הקורס:
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </label>
          <label>
            שם המרצה:
            <input
              type="text"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              ביטול
            </button>
            <button type="submit" className="confirm-button">
              הוסף קורס
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseDialog;
