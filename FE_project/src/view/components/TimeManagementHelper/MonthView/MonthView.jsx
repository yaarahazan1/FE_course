import React from "react";
import { format, isSameMonth } from "date-fns";
import "./MonthView.css";

const MonthView = ({ date, daysInMonth, filteredTasks }) => {
  const weekDays = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

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
                  const tasksForDay = filteredTasks
                    ? filteredTasks.filter(
                        (task) => task?.deadline?.toDateString() === day.toDateString()
                      )
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
                        <div className="tasks-container">
                          {tasksForDay.map((task, taskIndex) => (
                            <div
                              key={`task-${dayIndex}-${taskIndex}`}
                              className={`task-item ${
                                task.type === "לימודים"
                                  ? getPriorityColor(task.priority)
                                  : getTypeColor(task.type)
                              }`}
                              style={{
                                backgroundColor: getTypeColor(task.type),
                              }}
                            >
                              <div className="task-title">{task.title}</div>
                              {task.course && (
                                <div className="task-course">{task.course}</div>
                              )}
                            </div>
                          ))}
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
