import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddCourseDialog.css";

const AddCourseDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [courseName, setCourseName] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [credits, setCredits] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName.trim() || !lecturer.trim() || !credits) return;
    
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      const newCourse = {
        name: courseName.trim(),
        lecturer: lecturer.trim(),
        credits: Number(credits),
        userId,
        semester: "סמסטר ב'",
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // הוספה ל-Firebase
      const docRef = await addDoc(collection(db, "courses"), newCourse);
      console.log("קורס נוסף בהצלחה עם ID:", docRef.id);
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
      if (onAddSuccess) {
        onAddSuccess(newCourse);
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("שגיאה בהוספת קורס:", error);
      alert("שגיאה בהוספת הקורס. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
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
          <label>שם הקורס *</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="הכנס שם קורס"
            required={true}
            autoFocus
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>שם המרצה *</label>
          <input
            type="text"
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
            placeholder="הכנס שם מרצה"
            required={true}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>נקודות זכות *</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="מספר נקודות זכות"
            required={true}
            disabled={isLoading}
          />
        </div>
        
        <div className="dialog-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="button button-secondary"
            disabled={isLoading}
          >
            ביטול
          </button>
          <button 
            type="submit" 
            className="button button-primary"
            disabled={isLoading || !courseName.trim() || !lecturer.trim() || !credits}
          >
            {isLoading ? "מוסיף..." : "הוסף קורס"}
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddCourseDialog;