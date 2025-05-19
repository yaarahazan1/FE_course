import React, { useState } from "react";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddCourseDialog.css";

const AddCourseDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [courseName, setCourseName] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [credits, setCredits] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    
    const newCourse = {
      name: courseName,
      lecturer,
      credits: credits ? Number(credits) : null
    };
    
    onAddSuccess(newCourse);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCourseName("");
    setLecturer("");
    setCredits("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <DialogComponent 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="הוספת קורס חדש"
    >
      <form onSubmit={handleSubmit} className="dialog-form">
        <div className="form-field">
          <label className="required">שם הקורס</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="הכנס שם קורס"
            required
            autoFocus
          />
        </div>
        
        <div className="form-field">
          <label>שם המרצה</label>
          <input
            type="text"
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
            placeholder="הכנס שם מרצה"
          />
        </div>
        
        <div className="form-field">
          <label>נקודות זכות</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="מספר נקודות זכות"
          />
        </div>
        
        <div className="dialog-actions">
          <button type="button" onClick={handleCancel} className="button button-secondary">
            ביטול
          </button>
          <button type="submit" className="button button-primary">
            הוסף קורס
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddCourseDialog;