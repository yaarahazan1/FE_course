import React, { useState } from "react";
import PageHeader from "../PageHeader";
import AddTask from "../AddTask/AddTask";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles.module.css";

const sampleTasks = [
  { id: 1, title: "עבודה בפסיכולוגיה", due: "2025-05-01" },
  { id: 2, title: "להגיש פרויקט מחקר", due: "2025-05-04" },
  { id: 3, title: "קריאה למבחן במדעי המחשב", due: "2025-05-07" }
];

const TimeManagement = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>ניהול זמנים</h1>
      <p style={{ textAlign: "center", marginBottom: "2rem" }}>
        נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים שלך בצורה חכמה ויעילה
      </p>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* צד ימין - פרופיל והצעות */}
        <div style={{ flex: "1", maxWidth: "300px" }}>
          {/* פרופיל */}
          <div style={{ border: "1px solid #ccc", padding: "1.5rem", marginBottom: "1rem", textAlign: "center", borderRadius: "8px" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#e0e0e0",
              margin: "0 auto 1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.25rem"
            }}>
              י"כ
            </div>
            <h3 style={{ margin: "0", fontSize: "1.1rem" }}>יעל כהן</h3>
            <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#777" }}>מדעי ההתנהגות</p>
          </div>

          {/* הצעות למידה */}
          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>הצעות למידה</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {sampleTasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "0.75rem" }}>
                  <strong>{task.title}</strong><br />
                  עד {task.due}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* מרכז - לוח שנה ומשימות */}
        <div style={{ flex: "3" }}>
          <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "1rem" }}>לוח שנה</h3>
            <p>כאן יוצג לוח חודשי או שבועי בעתיד</p>
          </div>

          {/* משימות קרובות */}
          <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>משימות קרובות</h3>
              <button onClick={() => setIsAddTaskOpen(true)}>הוספת משימה</button>
            </div>
            {sampleTasks.map((task) => (
              <div key={task.id} style={{ border: "1px solid #eee", padding: "0.75rem", marginBottom: "0.5rem" }}>
                <p><strong>{task.title}</strong></p>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>עד {task.due}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddTask isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>עזרה והגדרות</Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>תנאי שימוש</div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TimeManagement;
