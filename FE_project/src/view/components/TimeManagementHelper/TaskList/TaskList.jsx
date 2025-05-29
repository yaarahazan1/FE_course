import React from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import './TaskList.css';

// Helper function to get color based on task type
const getTypeColor = (type) => {
  switch (type) {
    case "לימודים":
      return "blue";
    case "עבודה":
      return "green";
    case "אישי":
      return "purple";
    default:
      return "gray";
  }
};

// Helper function to get priority display
const getPriorityDisplay = (priority) => {
  switch (priority) {
    case "גבוהה":
    case "דחוף מאוד":
      return "דחוף מאוד";
    case "דחוף":
      return "דחוף";
    case "בינונית":
    case "חשוב":
      return "חשוב";
    case "נמוכה":
    case "פחות דחוף":
      return "פחות דחוף";
    default:
      return priority;
  }
};

// Helper function to calculate days until deadline
const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  
  try {
    const taskDate = deadline instanceof Date ? deadline : new Date(deadline);
    const today = new Date();
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.warn("שגיאה בחישוב ימים עד תאריך היעד:", error);
    return null;
  }
};

const TaskList = ({ filteredTasks, onAddTask }) => {
  // מיון משימות לפי תאריך יעד
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    
    try {
      const dateA = a.deadline instanceof Date ? a.deadline : new Date(a.deadline);
      const dateB = b.deadline instanceof Date ? b.deadline : new Date(b.deadline);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.warn("שגיאה במיון משימות:", error);
      return 0;
    }
  });

  return (
    <div className="task-list-container">
      <button className="add-task-button" onClick={onAddTask}>
        <PlusCircle className="plus-icon" />
        <span>הוספת משימה</span>
      </button>
      
      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="no-tasks-message">
            <p>אין משימות להצגה</p>
            <p className="no-tasks-hint">לחץ על "הוספת משימה" כדי להתחיל</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const daysUntil = getDaysUntilDeadline(task.deadline);
            
            return (
              <div className="task-card" key={task.id || `task-${task.title}`}>
                <div className="task-header">
                  <span className={`task-badge ${getTypeColor(task.type)}`}>
                    {task.type === "לימודים" ? getPriorityDisplay(task.priority) : task.type}
                  </span>
                  
                  {daysUntil !== null && (
                    <span className={`deadline-badge ${
                      daysUntil < 0 ? 'overdue' : 
                      daysUntil === 0 ? 'today' : 
                      daysUntil <= 3 ? 'urgent' : 'normal'
                    }`}>
                      {daysUntil < 0 ? `באיחור ${Math.abs(daysUntil)} ימים` :
                       daysUntil === 0 ? 'היום' :
                       daysUntil === 1 ? 'מחר' :
                       `עוד ${daysUntil} ימים`}
                    </span>
                  )}
                </div>
                
                <div className="task-content">
                  <h3 className="task-title">{task.name || 'משימה ללא כותרת'}</h3>
                  {task.course && <p className="task-course">{task.course}</p>}
                  
                  {task.deadline && (
                    <div className="task-deadline">
                      <span className="deadline-label">תאריך יעד: </span>
                      <span className="deadline-date">
                        {format(
                          task.deadline instanceof Date ? task.deadline : new Date(task.deadline), 
                          'dd/MM/yyyy'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskList;