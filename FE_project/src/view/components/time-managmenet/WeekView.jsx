import React from "react";
import { format } from "date-fns";
import { getPriorityColor, getTypeColor } from "./timeManagementUtils";
import "./WeekView.css";

const WeekView = ({ currentWeekDays, filteredTasks }) => {
  return (
    <div className="week-view">
      <div className="week-header">
        {currentWeekDays.map((day, i) => (
          <div key={i} className="day-header">
            <div className="day-name">{["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"][i]}</div>
            <div className={`day-number ${day.toDateString() === new Date().toDateString() ? "today" : ""}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      
      <div className="week-grid">
        {currentWeekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const tasksForDay = filteredTasks.filter(task => 
            task.deadline.toDateString() === day.toDateString()
          );

          return (
            <div 
              key={i} 
              className={`day-column ${isToday ? "today-column" : ""}`}
            >
              <div className="tasks-container">
                {tasksForDay.map(task => (
                  <div 
                    key={task.id} 
                    className="task-item"
                    style={{ backgroundColor: task.type === "לימודים" ? getPriorityColor(task.priority) : getTypeColor(task.type) }}
                  >
                    <div className="task-title">{task.title}</div>
                    {task.course && <div className="task-course">{task.course}</div>}
                  </div>
                ))}
                {tasksForDay.length === 0 && (
                  <div className="no-events">
                    אין אירועים
                  </div>
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