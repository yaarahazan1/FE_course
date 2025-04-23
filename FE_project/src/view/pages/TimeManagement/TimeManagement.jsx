import React, { useState } from "react";
import AddTask from "../AddTask/AddTask";
import { Link } from "react-router-dom";
import "./TimeManagement.css";
import "../../../styles/styles.css";
import PageHeader from "../PageHeader";


const sampleTasks = [
  { id: 1, title: "עבודה בפסיכולוגיה", due: "2025-05-01" },
  { id: 2, title: "להגיש פרויקט מחקר", due: "2025-05-04" },
  { id: 3, title: "קריאה למבחן במדעי המחשב", due: "2025-05-07" }
];

const TimeManagement = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <div className="time-wrapper">
      <PageHeader/>
      <header className="time-header">
        <h1>ניהול זמנים</h1>
        <p>נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים שלך בצורה חכמה ויעילה</p>
      </header>

      <div className="time-layout">
        <aside className="profile-panel">
          <div className="profile-box">
            <div className="profile-icon">י"כ</div>
            <h3>יעל כהן</h3>
            <p>מדעי ההתנהגות</p>
          </div>
          <div className="suggestions-box">
            <h3>הצעות למידה</h3>
            <ul>
              {sampleTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong><br />
                  עד {task.due}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="tasks-panel">
          <div className="calendar-box">
            <h3>לוח שנה</h3>
            <p>כאן יוצג לוח חודשי או שבועי בעתיד</p>
          </div>

          <div className="upcoming-tasks">
            <div className="tasks-header">
              <h3>משימות קרובות</h3>
              <button className="add-task" onClick={() => setIsAddTaskOpen(true)}>הוספת משימה</button>
            </div>
            {sampleTasks.map((task) => (
              <div key={task.id} className="task-card">
                <p><strong>{task.title}</strong></p>
                <p>עד {task.due}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <AddTask isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">עזרה והגדרות</Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">תנאי שימוש</div>
            <span className="footer-separator">|</span>
            <div className="footer-item">מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TimeManagement;
