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
      
      // הסרת כפילויות על סמך ID (למקרה שיש כפילות)
      const uniqueTasks = tasksData.filter((task, index, self) => 
        index === self.findIndex(t => t.id === task.id)
      );
      
      setTasks(uniqueTasks);
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
      case "נדחה":
        return "status-deferred";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "לא הוגדר";
      const date = new Date(dateString);
      return date.toLocaleDateString("he-IL");
    } catch (e) {
      return e.message || "תאריך לא תקין";
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
            <div key={task.id} className="task-card-tab">
              <div className="task-tab-header">
                <span title={task.title}>{task.title || "ללא כותרת"}</span>
              </div>
              <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                חשיבות: {task.priority || "לא הוגדר"}
              </span>
              <span className="task-description" title={task.description}>
                {task.description || "אין תיאור"}
              </span>
              <div className="task-info">
                <div className="task-info-item">
                  <span>תאריך יעד:</span>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
                <div className="task-info-item">
                  <span>סוג משימה:</span>
                  <span title={task.category || "לא משויך"}>
                    {task.category || "לא משויך"}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    סטטוס: {task.status || "לא הוגדר"}
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