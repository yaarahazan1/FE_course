import React from "react";
import "./TasksSidebar.css";

// תחליפים לאייקונים
const CalendarIcon = () => <span role="img" aria-label="calendar">📅</span>;
const ClockIcon = () => <span role="img" aria-label="clock">⏰</span>;
const BookIcon = () => <span role="img" aria-label="book">📖</span>;
const WorkIcon = () => <span role="img" aria-label="work">💼</span>;
const PersonIcon = () => <span role="img" aria-label="personal">👤</span>;
const ProjectIcon = () => <span role="img" aria-label="project">📋</span>;
const BrainIcon = () => <span role="img" aria-label="brain">🧠</span>;

const TasksSidebar = ({ tasks }) => {
  const smartSuggestions = generateSmartSuggestions(tasks);
  
  return (
    <div className="tasks-sidebar">
      <button className="calendar-button">
        <CalendarIcon />
        לוח זמנים שלי
      </button>
      
      <div className="scroll-area">
        {smartSuggestions.length > 0 ? (
          <div className="suggestions-list">
            {smartSuggestions.map((sugg, index) => (
              <div key={index} className="suggestion-box">
                <div className="suggestion-icon">
                  {getTaskIcon(sugg.type)}
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-title">{sugg.title}</div>
                  <div className="suggestion-time">{sugg.optimalTime}</div>
                  <div className="suggestion-reason">{sugg.reason}</div>
                  {sugg.course && (
                    <div className="suggestion-row">
                      <BookIcon />
                      <span className="suggestion-label">{sugg.course}</span>
                    </div>
                  )}
                  <div className="suggestion-priority-badge">
                    {sugg.urgencyLevel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <BrainIcon />
            <p>אין משימות לניתוח</p>
            <p className="empty-hint">הוסף משימות כדי לקבל הצעות חכמות</p>
          </div>
        )}
      </div>
    </div>
  );
};

function getTaskIcon(type) {
  switch(type) {
    case "לימודים":
      return <BookIcon />;
    case "עבודה":
      return <WorkIcon />;
    case "אישי":
      return <PersonIcon />;
    case "פרויקט":
      return <ProjectIcon />;
    default:
      return <ClockIcon />;
  }
}

function generateSmartSuggestions(tasks) {
  if (!tasks || tasks.length === 0) return [];
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // ניתוח חכם של המשימות
  const analyzedTasks = tasks.map(task => {
    const deadline = new Date(task.deadline || task.dueDate);
    const daysUntilDeadline = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));
    
    // חישוב דחיפות
    let urgencyScore = 0;
    let urgencyLevel = "";
    let reason = "";
    let optimalTime = "";
    
    // ניתוח לפי זמן עד הדדליין
    if (daysUntilDeadline <= 0) {
      urgencyScore = 100;
      urgencyLevel = "דחוף מאוד!";
      reason = "הדדליין עבר או היום!";
      optimalTime = "עכשיו - מיידי";
    } else if (daysUntilDeadline <= 1) {
      urgencyScore = 90;
      urgencyLevel = "דחוף";
      reason = "נותר פחות מיום";
      optimalTime = "היום, 14:00-18:00";
    } else if (daysUntilDeadline <= 3) {
      urgencyScore = 70;
      urgencyLevel = "חשוב";
      reason = "דדליין קרוב";
      optimalTime = "מחר, 10:00-12:00";
    } else if (daysUntilDeadline <= 7) {
      urgencyScore = 50;
      urgencyLevel = "בינוני";
      reason = "שבוע עד הדדליין";
      optimalTime = "השבוע, 16:00-18:00";
    } else {
      urgencyScore = 30;
      urgencyLevel = "לא דחוף";
      reason = "יש זמן לתכנון";
      optimalTime = "השבוע הבא";
    }
    
    // התאמה לפי סוג המשימה
    switch(task.type) {
      case "לימודים":
        if (daysUntilDeadline > 7) {
          optimalTime = "בוקר, 9:00-11:00 (ריכוז גבוה)";
          reason += " - למידה דורשת ריכוז";
        } else if (daysUntilDeadline > 3) {
          optimalTime = "אחה״צ, 14:00-16:00";
          reason += " - זמן לחזרה";
        }
        break;
        
      case "עבודה":
        if (daysUntilDeadline > 5) {
          optimalTime = "ימי חול, 9:00-17:00";
          reason += " - שעות עבודה אופטימליות";
        } else {
          optimalTime = "בהקדם, שעות פיק";
          reason += " - דורש תיאום עם אחרים";
        }
        break;
        
      case "פרויקט":
        if (daysUntilDeadline > 10) {
          optimalTime = "סופ״ש, 10:00-14:00";
          reason += " - זמן להתמקד בפרויקט";
        } else {
          optimalTime = "יומי, 2-3 שעות";
          reason += " - פיצול למשימות קטנות";
        }
        break;
        
      case "אישי":
        if (task.priority === "דחוף מאוד" || task.priority === "דחוף") {
          optimalTime = "היום, זמן פנוי";
          reason += " - משימה אישית דחופה";
        } else {
          optimalTime = "סופ״ש או ערב";
          reason += " - זמן אישי רגוע";
        }
        break;
    }
    
    // התאמה לפי עדיפות
    const priorityBonus = {
      "דחוף מאוד": 20,
      "דחוף": 15,
      "חשוב": 10,
      "בינונית": 5,
      "פחות דחוف": 0
    };
    
    urgencyScore += priorityBonus[task.priority] || 0;
    
    return {
      ...task,
      urgencyScore,
      urgencyLevel,
      reason,
      optimalTime,
      daysUntilDeadline
    };
  });
  
  // מיון לפי דחיפות וחכמה
  const sortedTasks = analyzedTasks.sort((a, b) => {
    // קודם לפי דחיפות
    if (b.urgencyScore !== a.urgencyScore) {
      return b.urgencyScore - a.urgencyScore;
    }
    
    // אחר כך לפי תאריך דדליין
    const dateA = new Date(a.deadline || a.dueDate);
    const dateB = new Date(b.deadline || b.dueDate);
    return dateA - dateB;
  });
  
  // יצירת הצעות חכמות
  return sortedTasks.slice(0, 5).map(task => {
    let title;
    switch(task.type) {
      case "לימודים":
        title = `📚 ${task.title}`;
        break;
      case "עבודה":
        title = `💼 ${task.title}`;
        break;
      case "אישי":
        title = `👤 ${task.title}`;
        break;
      case "פרויקט":
        title = `📋 ${task.title}`;
        break;
      default:
        title = task.title;
    }
    
    return {
      title,
      optimalTime: task.optimalTime,
      reason: task.reason,
      description: task.description,
      type: task.type,
      urgencyLevel: task.urgencyLevel,
      daysUntilDeadline: task.daysUntilDeadline
    };
  });
}

export default TasksSidebar;