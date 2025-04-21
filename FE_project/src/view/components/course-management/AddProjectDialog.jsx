import React, { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import "./AddProjectDialog.css";

const AddProjectDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("פעיל");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!projectName.trim() || !description.trim()) {
      toast({
        title: "שגיאה",
        description: "נא למלא את שם הפרויקט והתיאור",
        variant: "destructive"
      });
      return;
    }

    // TODO: Handle actual project submission to backend
    toast({
      title: "פרויקט נוסף בהצלחה",
      description: `הפרויקט "${projectName}" נוסף לרשימת הפרויקטים`,
    });
    
    // Reset form
    setProjectName("");
    setDescription("");
    setStatus("פעיל");
    
    // Call the success callback
    onAddSuccess();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">הוספת פרויקט חדש</h2>
        </div>
        <form onSubmit={handleSubmit} className="dialog-form">
          <div className="form-group">
            <label htmlFor="projectName">שם הפרויקט</label>
            <input 
              id="projectName" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              placeholder="הכנס שם פרויקט"
              dir="rtl"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">תיאור הפרויקט</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="תיאור קצר של הפרויקט"
              dir="rtl"
              rows={3}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">סטטוס</label>
            <select 
              id="status"
              className="form-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              dir="rtl"
            >
              <option value="פעיל">פעיל</option>
              <option value="בתהליך">בתהליך</option>
              <option value="הושלם">הושלם</option>
              <option value="מופסק">מופסק</option>
            </select>
          </div>
          <div className="dialog-footer">
            <button type="button" className="button button-outline" onClick={onClose}>ביטול</button>
            <button type="submit" className="button button-primary">הוסף פרויקט</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectDialog;