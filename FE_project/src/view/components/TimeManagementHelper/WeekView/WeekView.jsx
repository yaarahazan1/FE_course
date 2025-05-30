import React from "react";
import { format } from "date-fns";
import "./WeekView.css";

const WeekView = ({ currentWeekDays, filteredTasks }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "גבוהה":
      case "דחוף מאוד":
      case "דחוף":
        return "priority-high";
      case "בינונית":
      case "חשוב":
        return "priority-medium";
      case "נמוכה":
      case "פחות דחוף":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "אישי":
        return "type-personal";
      case "לימודים":
        return "type-study";
      case "עבודה":
        return "type-work";
      default:
        return "type-default";
    }
  };

  return (
    <div className="weekview-container">
      <div className="weekview-header">
        {currentWeekDays.map((day, i) => (
          <div key={i} className="weekview-day-header">
            <div className="weekview-day-name">
              {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"][i]}
            </div>
            <div
              className={`weekview-day-number ${
                day.toDateString() === new Date().toDateString() ? "today" : ""
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="weekview-grid">
        {currentWeekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          
          // סינון משימות לפי יום עם בדיקות בטיחות
          const tasksForDay = filteredTasks.filter((task) => {
            if (!task || !task.deadline) return false;
            
            try {
              const taskDate = task.deadline instanceof Date 
                ? task.deadline 
                : new Date(task.deadline);
              
              return taskDate.toDateString() === day.toDateString();
            } catch (error) {
              console.error("שגיאה בפענוח תאריך משימה:", error);
              console.warn("שגיאה בפענוח תאריך משימה:", task);
              return false;
            }
          });

          return (
            <div key={i} className={`weekview-column ${isToday ? "highlight" : ""}`}>
              <div className="weekview-tasks">
                {tasksForDay.length > 0 ? (
                  tasksForDay.map((task) => (
                    <div
                      key={task.id || `task-${i}-${task.title}`}
                      className={`task-item ${
                        task.type === "לימודים"
                          ? getPriorityColor(task.priority)
                          : getTypeColor(task.type)
                      }`}
                      title={`${task.title}${task.description ? ` - ${task.description}` : ''}`}
                    >
                      <div className="task-title-calendare">
                        {task.title && task.title.length > 25 
                          ? task.title.substring(0, 25) + '...' 
                          : task.title}
                      </div>
                      {task.description && (
                        <div className="task-course-calendare">
                          {task.description.length > 20 
                            ? task.description.substring(0, 20) + '...' 
                            : task.description}
                        </div>
                      )}
                      {task.type === "לימודים" && task.priority && (
                        <div className="task-priority">
                          {task.priority}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-tasks">אין אירועים</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;