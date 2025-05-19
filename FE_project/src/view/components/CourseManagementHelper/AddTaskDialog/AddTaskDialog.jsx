import React, { useState } from "react";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddTaskDialog.css";

const AddTaskDialog = ({ isOpen, onClose, onAddSuccess, projects = [] }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !dueDate || !priority || !status) return;

    const selectedProject = projectId ? projects.find(p => p.id.toString() === projectId) : null;

    const newTask = {
      id: Date.now(), // Temporary ID for demonstration
      name: taskName,
      description,
      dueDate,
      priority,
      status,
      projectId: projectId || null,
      projectName: selectedProject ? selectedProject.name : null
    };

    onAddSuccess(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("");
    setStatus("");
    setProjectId("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <DialogComponent
      isOpen={isOpen}
      onClose={handleCancel}
      title="הוספת משימה חדשה"
    >
      <form className="dialog-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="required">כותרת המשימה</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="הזן כותרת למשימה"
            required
            autoFocus
          />
        </div>

        <div className="form-field">
          <label>תיאור המשימה</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="הזן תיאור מפורט למשימה"
            rows="3"
          />
        </div>

        <div className="form-field">
          <label className="required">תאריך יעד</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label className="required">רמת עדיפות</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">בחר עדיפות</option>
            <option value="גבוהה">גבוהה</option>
            <option value="בינונית">בינונית</option>
            <option value="נמוכה">נמוכה</option>
          </select>
        </div>

        <div className="form-field">
          <label className="required">סטטוס</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">בחר סטטוס</option>
            <option value="ממתין">ממתין</option>
            <option value="בתהליך">בתהליך</option>
            <option value="הושלם">הושלם</option>
          </select>
        </div>

        {projects.length > 0 && (
          <div className="form-field">
            <label>שייך לפרויקט</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">לא משויך לפרויקט</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="dialog-actions">
          <button type="button" className="button button-secondary" onClick={handleCancel}>
            ביטול
          </button>
          <button type="submit" className="button button-primary">
            שמור משימה
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddTaskDialog;