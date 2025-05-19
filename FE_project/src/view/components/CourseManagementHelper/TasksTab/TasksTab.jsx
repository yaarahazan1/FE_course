import React from "react";
import "./TasksTab.css";

const TasksTab = ({ tasks = []}) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "גבוהה":
        return "priority-high";
      case "בינונית":
        return "priority-medium";
      case "נמוכה":
        return "priority-low";
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ממתין":
        return "status-pending";
      case "בתהליך":
        return "status-in-progress";
      case "הושלם":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>רשימת משימות</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="tasks-empty-message">
          <p>אין משימות כרגע. הוסף משימה חדשה להתחלה!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.name}</h3>
                <div className={`task-priority ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </div>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-info">
                <div className="task-info-item">
                  <span>תאריך יעד:</span>
                  <span>{new Date(task.dueDate).toLocaleDateString("he-IL")}</span>
                </div>
                <div className="task-info-item">
                  <span>שייך לפרויקט:</span>
                  <span>{task.projectName || "לא משויך"}</span>
                </div>
                <div className="task-info-item">
                  <span>סטטוס:</span>
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksTab;