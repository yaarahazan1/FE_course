import React from "react";
import "./TasksSidebar.css";

// תחליפים לאייקונים
const CalendarIcon = () => <span role="img" aria-label="calendar">📅</span>;
const ClockIcon = () => <span role="img" aria-label="clock">⏰</span>;
const BookIcon = () => <span role="img" aria-label="book">📖</span>;
const GraduationIcon = () => <span role="img" aria-label="graduate" className="graduation-icon">🎓</span>;

const TasksSidebar = ({ tasks }) => {
  const studySuggestions = generateStudySuggestions(tasks);

  return (
    <div className="tasks-sidebar">
      <button className="calendar-button">
        <CalendarIcon />
        לוח זמנים שלי
      </button>

      <div className="scroll-area">
        {studySuggestions.length > 0 ? (
          <div className="suggestions-list">
            {studySuggestions.map((sugg, index) => (
              <div key={index} className="suggestion-box">
                <div className="suggestion-icon">
                  <ClockIcon />
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-title">{sugg.title}</div>
                  <div className="suggestion-time">{sugg.timeSlot}</div>

                  {sugg.course && (
                    <div className="suggestion-row">
                      <BookIcon />
                      <span className="suggestion-label">{sugg.course}</span>
                    </div>
                  )}

                  {sugg.priority && (
                    <div className="suggestion-priority">{sugg.priority}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <GraduationIcon />
            <p>אין משימות קרובות</p>
            <p className="empty-hint">הוסף משימות כדי לקבל הצעות למידה</p>
          </div>
        )}
      </div>
    </div>
  );
};

function generateStudySuggestions(tasks) {
  if (!tasks || tasks.length === 0) return [];

  const sortedTasks = [...tasks]
    .sort((a, b) => {
      const deadlineDiff = new Date(a.deadline) - new Date(b.deadline);
      if (deadlineDiff === 0) {
        const priorityOrder = {
          "דחוף מאוד": 1,
          "דחוף": 2,
          "חשוב": 3,
          "פחות דחוף": 4
        };
        return (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
      }
      return deadlineDiff;
    })
    .filter(task => task.type === "לימודים");

  const today = new Date();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

  return sortedTasks.slice(0, 4).map((task, i) => {
    const daysUntilDeadline = Math.floor((new Date(task.deadline) - today) / (1000 * 60 * 60 * 24));
    let timeSlot = "יום " + days[i % days.length] + ", 17:00-19:00";

    if (daysUntilDeadline <= 1) timeSlot = "היום, 18:00-20:00";
    else if (daysUntilDeadline <= 3) timeSlot = "מחר, 16:00-18:00";

    return {
      title: `למידה ל${task.title}`,
      timeSlot,
      course: task.course,
      priority: task.priority
    };
  });
}

export default TasksSidebar;
