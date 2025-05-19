import React from "react";
import "./TasksTab.css";

const TasksTab = ({ tasks = [] }) => {
  // Sample data for demonstration
  const sampleTasks = [
    {
      id: 1,
      name: "בניית טופס בחירת מצב רוח",
      description: "יצירת טופס אינטראקטיבי שמאפשר למשתמש לבחור את מצב הרוח הנוכחי שלו",
      dueDate: "2025-05-25",
      priority: "גבוהה",
      status: "בתהליך",
      projectName: "SnackMatch"
    },
    {
      id: 2,
      name: "ניתוח תוצאות הסקר",
      description: "ניתוח של תוצאות הסקר מקבוצת המיקוד והכנת מצגת עם התובנות העיקריות",
      dueDate: "2025-05-22",
      priority: "בינונית",
      status: "ממתין",
      projectName: "מחקר מגמות דיגיטליות"
    },
    {
      id: 3,
      name: "אפיון אלגוריתם התאמה",
      description: "פיתוח אלגוריתם שמתאים בין מצב רוח לסוגי חטיפים לפי העדפות המשתמש",
      dueDate: "2025-06-01",
      priority: "גבוהה",
      status: "ממתין",
      projectName: "SnackMatch"
    },
    {
      id: 4,
      name: "עיצוב דף הבית",
      description: "עיצוב ממשק משתמש אטרקטיבי עבור דף הבית של האפליקציה",
      dueDate: "2025-05-20",
      priority: "נמוכה",
      status: "הושלם",
      projectName: "SnackMatch"
    }
  ];

  // Use provided tasks or sample tasks if none provided
  const displayTasks = tasks.length > 0 ? tasks : sampleTasks;

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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("he-IL");
    } catch (e) {
      return e.message;
    }
  };

  return (
    <div className="tasks-tab">
      <div className="tasks-header">
        <h2>רשימת משימות</h2>
      </div>

      {displayTasks.length === 0 ? (
        <div className="tasks-empty-message">
          <p>אין משימות כרגע. הוסף משימה חדשה להתחלה!</p>
        </div>
      ) : (
        <div className="tasks-list">
          {displayTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <sapn title={task.name}>{task.name}</sapn>
              </div>
                <sapn className={`task-priority ${getPriorityClass(task.priority)}`}>
                  חשיבות: {task.priority}
                </sapn>
              <sapn className="task-description" title={task.description}>
                {task.description}
              </sapn>
              <div className="task-info">
                <div className="task-info-item">
                  <span>תאריך יעד:</span>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <div className="task-info-item">
                  <span>סוג משימה:</span>
                  <span title={task.projectName || "לא משויך"}>
                    {task.projectName || "לא משויך"}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className={`task-status ${getStatusClass(task.status)}`}>סטטוס: {task.status}</span>
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