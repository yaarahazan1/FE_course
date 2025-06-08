import React from "react";
import { format, isSameMonth } from "date-fns";
import "./MonthView.css";

const MonthView = ({ date, daysInMonth, filteredTasks }) => {
  const weekDays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

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
    <table className="calendar-table">
      <thead>
        <tr>
          {weekDays.map((day, index) => (
            <th key={`weekday-${index}`} className="weekday-header">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Convert array to rows of 7 days */}
        {Array(Math.ceil(daysInMonth.length / 7))
          .fill()
          .map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {daysInMonth
                .slice(rowIndex * 7, rowIndex * 7 + 7)
                .map((day, dayIndex) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isCurrentMonth = isSameMonth(day, date);
                  
                  // סינון משימות לפי יום - בדיקה אם קיים deadline ושהוא תקין
                  const tasksForDay = filteredTasks
                    ? filteredTasks.filter((task) => {
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
                      })
                    : [];

                  return (
                    <td
                      key={`day-${rowIndex}-${dayIndex}`}
                      className={`calendar-day ${
                        isToday ? "today" : ""
                      } ${!isCurrentMonth ? "other-month" : ""}`}
                    >
                      <div className="day-number">{format(day, "d")}</div>

                      {tasksForDay && tasksForDay.length > 0 && (
                        <div className="tasks-container-calender">
                          {tasksForDay.slice(0, 3).map((task, taskIndex) => (
                            <div
                              key={`task-${task.id || dayIndex}-${taskIndex}`}
                              className={`task-item ${
                                task.type === "לימודים"
                                  ? getPriorityColor(task.priority)
                                  : getTypeColor(task.type)
                              }`}
                              title={`${task.title}${task.description ? ` - ${task.description}` : ''}`}
                            >
                              <div className="task-title-calendare">
                                {task.title && task.title.length > 20 
                                  ? task.title.substring(0, 20) + '...' 
                                  : task.title}
                              </div>
                              {task.description && (
                                <div className="task-course-calendare">
                                  {task.description.length > 15 
                                    ? task.description.substring(0, 15) + '...' 
                                    : task.description}
                                </div>
                              )}
                            </div>
                          ))}
                          {tasksForDay.length > 3 && (
                            <div className="more-tasks">
                              +{tasksForDay.length - 3} נוספות
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default MonthView;