import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./TasksTab.css";

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

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

  const deleteTask = async (taskId) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המשימה?")) {
      return;
    }

    setDeletingTaskId(taskId);
    
    try {
      // מחיקה מה-Firebase
      await deleteDoc(doc(db, "tasks", taskId));
      
      // עדכון המצב המקומי - הסרת המשימה מהרשימה
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      console.log("המשימה נמחקה בהצלחה");
    } catch (error) {
      console.error("שגיאה במחיקת המשימה:", error);
      alert("אירעה שגיאה במחיקת המשימה. נסה שוב.");
    } finally {
      setDeletingTaskId(null);
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
      <div className="tab-header">
        <h2>רשימת משימות</h2>
      </div>
      
      {loading ? (
        <div className="loading">טוען משימות...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>אין משימות כרגע. לחץ על כפתור "הוסף משימה" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3 className="task-title">{task.title || "ללא כותרת"}</h3>
                <div className="task-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    disabled={deletingTaskId === task.id}
                    title="מחק משימה"
                  >
                    {deletingTaskId === task.id ? "מוחק..." : "🗑️"}
                  </button>
                </div>
              </div>
              
              <div className="task-meta">
                <span className={`priority ${getPriorityClass(task.priority)}`}>
                  חשיבות: {task.priority || "לא הוגדר"}
                </span>
              </div>
              
              <p className="task-description">
                {task.description || "אין תיאור"}
              </p>
              
              <div className="task-details">
                <div className="detail-item">
                  <span className="detail-label">תאריך יעד:</span>
                  <span className="detail-value">{formatDate(task.dueDate)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">סוג משימה:</span>
                  <span className={`category ${task.category ? 'has-category' : ''}`}>
                    {task.category || "לא משויך"}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className={`status ${getStatusClass(task.status)}`}>
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