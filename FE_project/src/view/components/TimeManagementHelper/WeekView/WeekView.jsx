import React from "react";
import { format } from "date-fns";
import "./WeekView.css"; // קובץ CSS חיצוני

const WeekView = ({ currentWeekDays, filteredTasks }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "גבוהה":
        return "priority-high";
      case "בינונית":
        return "priority-medium";
      case "נמוכה":
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
          const tasksForDay = filteredTasks.filter(
            (task) => task.deadline.toDateString() === day.toDateString()
          );

          return (
            <div key={i} className={`weekview-column ${isToday ? "highlight" : ""}`}>
              <div className="weekview-tasks">
                {tasksForDay.map((task) => (
                  <div
                    key={task.id}
                    className={`task-item ${
                      task.type === "לימודים"
                        ? getPriorityColor(task.priority)
                        : getTypeColor(task.type)
                    }`}
                  >
                    <div className="task-title">{task.title}</div>
                    {task.course && (
                      <div className="task-course">{task.course}</div>
                    )}
                  </div>
                ))}
                {tasksForDay.length === 0 && (
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
