// TasksList.jsx
import React from "react";
import "./TasksList.css";

const TasksList = () => {
  // Mock data for tasks
  const tasks = [
    {
      id: 1,
      title: "עבודת מחקרית לפסיכולוגיה",
      professor: "דר. פטריק גינזבורג",
      dueDate: "תאריך יעד: 15 במרץ 2025",
      status: "בתהליך",
      studentsCount: 3
    },
    {
      id: 2,
      title: "פרויקט שנת אחרונה",
      professor: "פרופ. אלישע",
      dueDate: "תאריך יעד: 30 במאי 2025",
      status: "בבדיקה",
      studentsCount: 2
    },
    {
      id: 3,
      title: "סיכום הרצאות 1-5 בשיטות מחקר",
      professor: "דר. רונית כהן",
      dueDate: "תאריך יעד: 30 באוקטובר 2025"
    }
  ];

  return (
    <div className="tasks-list-container">
      <div className="tasks-header">
        <button className="add-task-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>הוספת טבלה</span>
        </button>
        <h2 className="tasks-title">המשימות שלי</h2>
      </div>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`task-card ${task.id === 3 ? 'task-green' : 'task-yellow'}`}
          >
            <div className="task-content">
              <div className="task-header">
                <div className="task-info">
                  {task.id === 3 ? (
                    <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg className="file-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  )}
                  <div className="task-details">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-date">{task.dueDate}</p>
                  </div>
                </div>
                
                {task.status && (
                  <div className={`task-status ${task.status === 'בתהליך' ? 'status-in-progress' : 'status-reviewing'}`}>
                    {task.status}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="group-tasks-container">
        <div className="group-tasks-header">
          <div className="group-name">חברי הקבוצה</div>
          <div className="project-name">SnackMatch - אפליקציה שמתאימה חטיפים לפי מצב הרוח שלך</div>
        </div>

        <p className="group-tasks-description">כאן ניתן לראות משימות שנוצרו במצב</p>

        <div className="group-task-item">
          <p>בניית אפיון מערכת חברתית (שם, עיצוב, רקע פרסומי וכו׳)</p>
        </div>

        <div className="group-task-item">
          <p>יצירת אלגוריתם להתאמת חטיפים לפי בחירת המשתמש</p>
        </div>
      </div>
    </div>
  );
};

export default TasksList;