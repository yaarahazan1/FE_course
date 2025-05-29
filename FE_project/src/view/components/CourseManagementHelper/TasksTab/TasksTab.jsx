import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./TasksTab.css";

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const tasksCol = collection(db, "tasks");
      const snapshot = await getDocs(tasksCol);
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    } catch (error) {
      console.error("שגיאה בעת שליפת משימות:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

      {loading ? (
        <p>טוען משימות...</p>
      ) : tasks.length === 0 ? (
        <div className="tasks-empty-message">
          <p>אין משימות כרגע. לחץ על כפתור "הוסף משימה" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <span title={task.title}>{task.title}</span>
              </div>
              <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                חשיבות: {task.priority}
              </span>
              <span className="task-description" title={task.description}>
                {task.description}
              </span>
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
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    סטטוס: {task.status}
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
