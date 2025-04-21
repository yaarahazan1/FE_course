import React, { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import "./AddCourseDialog.css";

const AddCourseDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const { toast } = useToast();
  const [courseName, setCourseName] = useState("");
  const [professor, setProfessor] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!courseName.trim() || !professor.trim() || !semester.trim()) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות החובה",
        variant: "destructive"
      });
      return;
    }

    // TODO: Handle actual course submission to backend
    toast({
      title: "קורס נוסף בהצלחה",
      description: `הקורס "${courseName}" נוסף לרשימת הקורסים`,
    });
    
    // Reset form
    setCourseName("");
    setProfessor("");
    setSemester("");
    setCredits("");
    
    // Call the success callback
    onAddSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">הוספת קורס חדש</h2>
        </div>
        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="courseName">שם הקורס *</label>
            <input 
              id="courseName" 
              value={courseName} 
              onChange={(e) => setCourseName(e.target.value)} 
              placeholder="הכנס שם קורס"
              dir="rtl"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="professor">שם המרצה *</label>
            <input 
              id="professor" 
              value={professor} 
              onChange={(e) => setProfessor(e.target.value)} 
              placeholder="הכנס שם מרצה"
              dir="rtl"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="semester">סמסטר *</label>
            <input 
              id="semester" 
              value={semester} 
              onChange={(e) => setSemester(e.target.value)}
              placeholder="סמסטר א׳/ב׳/קיץ"
              dir="rtl"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="credits">נקודות זכות</label>
            <input 
              id="credits" 
              type="number" 
              value={credits} 
              onChange={(e) => setCredits(e.target.value)}
              placeholder="מספר נקודות זכות"
              dir="rtl"
              className="form-input"
            />
          </div>
          <div className="dialog-footer">
            <button type="button" className="button button-outline" onClick={onClose}>ביטול</button>
            <button type="submit" className="button button-primary">הוסף קורס</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseDialog;