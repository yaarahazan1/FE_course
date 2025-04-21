import React from "react";
import { BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";
import "./TasksSidebar.css";

const TasksSidebar = ({ tasks }) => {
  // Generate smart study suggestions based on upcoming tasks
  const studySuggestions = generateStudySuggestions(tasks);

  return (
    <div className="sidebar-container">
      <button className="schedule-button">
        <Calendar className="icon-medium" />
        לוח זמנים שלי
      </button>
      
      <div className="suggestions-scroll-area">
        {studySuggestions.length > 0 ? (
          <div className="suggestions-list">
            {studySuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <div className="suggestion-icon">
                  <Clock className="icon-clock" />
                </div>
                <div className="suggestion-content">
                  <p className="suggestion-title">{suggestion.title}</p>
                  <p className="suggestion-time">{suggestion.timeSlot}</p>
                  {suggestion.course && (
                    <div className="suggestion-course">
                      <BookOpen className="icon-small" />
                      <span className="course-name">{suggestion.course}</span>
                    </div>
                  )}
                  {suggestion.priority && (
                    <div className="suggestion-priority">
                      <span className="priority-badge">
                        {suggestion.priority}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks-container">
            <GraduationCap className="grad-icon" />
            <p className="no-tasks-text">אין משימות קרובות</p>
            <p className="no-tasks-subtext">הוסף משימות כדי לקבל הצעות למידה</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate smart study suggestions based on tasks
function generateStudySuggestions(tasks) {
  if (!tasks.length) return [];
  
  // Sort tasks by priority and deadline
  const sortedTasks = [...tasks]
    .sort((a, b) => {
      // First sort by deadline
      const deadlineDiff = a.deadline.getTime() - b.deadline.getTime();
      
      // If deadlines are the same, sort by priority
      if (deadlineDiff === 0) {
        const priorityOrder = {
          "דחוף מאוד": 1,
          "דחוף": 2,
          "חשוב": 3,
          "פחות דחוף": 4
        };
        
        const aPriority = priorityOrder[a.priority] || 5;
        const bPriority = priorityOrder[b.priority] || 5;
        
        return aPriority - bPriority;
      }
      
      return deadlineDiff;
    })
    .filter(task => task.type === "לימודים"); // Filter to academic tasks only
  
  // Generate time suggestions for the highest priority tasks
  const today = new Date();
  const suggestions = sortedTasks.slice(0, 4).map((task, index) => {
    // Create suggestion times based on task deadline and priority
    const daysUntilDeadline = Math.floor((task.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Different suggestion strategies based on days remaining
    let timeSlot;
    if (daysUntilDeadline <= 1) {
      timeSlot = "היום, 18:00-20:00";
    } else if (daysUntilDeadline <= 3) {
      timeSlot = "מחר, 16:00-18:00";
    } else {
      // Suggest different days for different tasks
      const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
      const dayIndex = index % days.length;
      timeSlot = `יום ${days[dayIndex]}, 17:00-19:00`;
    }
    
    return {
      title: `למידה ל${task.title}`,
      timeSlot: timeSlot,
      course: task.course,
      priority: task.priority
    };
  });
  
  return suggestions;
}

export default TasksSidebar;