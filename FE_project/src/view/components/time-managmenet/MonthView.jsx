import React from "react";
import { format, isSameMonth } from "date-fns";
import { getPriorityColor, getTypeColor } from "./timeManagementUtils";
import "./MonthView.css";

const MonthView = ({ date, daysInMonth, filteredTasks }) => {
  return (
    <>
      <div className="month-header">
        <div className="day-name">א</div>
        <div className="day-name">ב</div>
        <div className="day-name">ג</div>
        <div className="day-name">ד</div>
        <div className="day-name">ה</div>
        <div className="day-name">ו</div>
        <div className="day-name">ש</div>
      </div>
      <div className="days-grid">
        {daysInMonth.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const isCurrentMonth = isSameMonth(day, date);
          const tasksForDay = filteredTasks.filter(task => 
            task.deadline.toDateString() === day.toDateString()
          );

          return (
            <div 
              key={i} 
              className={`day-cell ${isToday ? "today" : ""} ${!isCurrentMonth ? "other-month" : ""}`}
            >
              <div className="day-number">{format(day, "d")}</div>
              {tasksForDay.length > 0 && (
                <div className="day-tasks">
                  {tasksForDay.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className="task-indicator"
                      style={{ backgroundColor: task.type === "לימודים" ? getPriorityColor(task.priority) : getTypeColor(task.type) }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDay.length > 3 && (
                    <div className="more-tasks">
                      +{tasksForDay.length - 3} עוד
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MonthView;