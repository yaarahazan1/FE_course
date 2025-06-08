import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./TasksTab.css";

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    status: "",
    dueDate: ""
  });

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

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "",
      category: task.category || "",
      status: task.status || "",
      dueDate: task.dueDate || ""
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({
      title: "",
      description: "",
      priority: "",
      category: "",
      status: "",
      dueDate: ""
    });
  };

  const saveEdit = async () => {
    try {
      const taskRef = doc(db, "tasks", editingTask);
      await updateDoc(taskRef, editForm);
      
      // עדכון המצב המקומי
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask 
            ? { ...task, ...editForm }
            : task
        )
      );
      
      setEditingTask(null);
      setEditForm({
        title: "",
        description: "",
        priority: "",
        category: "",
        status: "",
        dueDate: ""
      });
      
      console.log("המשימה עודכנה בהצלחה");
    } catch (error) {
      console.error("שגיאה בעדכון המשימה:", error);
      alert("אירעה שגיאה בעדכון המשימה. נסה שוב.");
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

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <h2>מבחן אמצע סמסטר</h2>
      </div>
      
      {loading ? (
        <div className="loading">טוען משימות...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>אין משימות כרגע. לחץ על כפתור "הוסף משימה" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              {editingTask === task.id ? (
                // מצב עריכה
                <div className="edit-form">
                  <div className="task-form-header">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="edit-title-input"
                      placeholder="כותרת המשימה"
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-btn">
                        ✓
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn-task-tab">
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="edit-field">
                    <label>חשיבות:</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="priority-select"
                    >
                      <option value="">בחר חשיבות</option>
                      <option value="גבוהה">גבוהה</option>
                      <option value="בינונית">בינונית</option>
                      <option value="נמוכה">נמוכה</option>
                    </select>
                  </div>

                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="edit-description-input"
                    placeholder="תיאור המשימה"
                    rows="3"
                  />
                  
                  <div className="edit-details">
                    <div className="edit-field">
                      <label>תאריך יעד:</label>
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="edit-date-input"
                      />
                    </div>
                    
                    <div className="edit-field">
                      <label>סוג משימה:</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="category-select"
                      >
                        <option value="">בחר משימה</option>
                        <option value="כללי">כללי</option>
                        <option value="אקדמי">אקדמי</option>
                        <option value="עבודה">עבודה</option>
                        <option value="אישי">אישי</option>
                        <option value="פרויקט">פרויקט</option>
                        <option value="בחינה">בחינה</option>
                      </select>
                    </div>
                    
                    <div className="edit-field">
                      <label>סטטוס:</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="status-select"
                      >
                        <option value="">בחר סטטוס</option>
                        <option value="ממתין">ממתין</option>
                        <option value="בתהליך">בתהליך</option>
                        <option value="הושלם">הושלם</option>
                        <option value="נדחה">נדחה</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                // מצב תצוגה רגיל
                <>
                  <div className="task-header">
                    <h3 className="task-title">{task.title || "ללא כותרת"}</h3>
                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(task)}
                        title="ערוך משימה"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn-task"
                        onClick={() => deleteTask(task.id)}
                        disabled={deletingTaskId === task.id}
                        title="מחק משימה"
                      >
                        {deletingTaskId === task.id ? "מוחק..." : "🗑️"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="task-task-priority-section">
                    <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                      חשיבות: {task.priority || "לא הוגדר"}
                    </span>
                  </div>
                  
                  <p className="task-description">
                    {task.description || "אין תיאור"}
                  </p>
                  
                  <div className="task-info">
                    <div className="task-info-item">
                      <span>תאריך יעד:</span>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                    
                    <div className="task-info-item">
                      <span>סוג משימה:</span>
                      <span className={`category ${task.category ? 'has-category' : ''}`}>
                        {task.category || "לא משויך"}
                      </span>
                    </div>
                    
                    <div className="task-info-item">
                      <span>סטטוס:</span>
                      <span className={`task-status ${getStatusClass(task.status)}`}>
                        {task.status || "לא הוגדר"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksTab;