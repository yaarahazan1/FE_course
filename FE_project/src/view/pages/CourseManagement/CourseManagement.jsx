import React, { useState } from "react";
import PageHeader from "../PageHeader";
import styles from "../../../styles/styles.module.css"; 
import { Link } from "react-router-dom";
import AddTask from "../AddTask/AddTask";

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const toggleProject = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const projects = [
    {
      id: 1,
      name: "SnackMatch",
      description: "אפליקציה שמתאימה חטיפים לפי מצב הרוח",
      status: "פעיל",
      tasks: 7,
      teamMembers: [
        { id: 1, name: "רונית כהן גולדמן", role: "מנהלת צוות" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות" },
        { id: 3, name: "יעל אבוטבול", role: "חברת צוות" }
      ],
      messages: [
        {
          id: 1,
          sender: "רונית",
          message: "בוקר טוב! זוכרים שהמשימה - 'בניית טופס מצב רוח' צריכה להיות מוגשת עד סוף השבוע",
          time: "09:30",
        }
      ]
    },
    {
      id: 2,
      name: "מחקר מגמות דיגיטליות",
      description: "ניתוח מגמות בשוק הדיגיטלי",
      status: "בתהליך",
      tasks: 4,
      teamMembers: [
        { id: 4, name: "שמחה ליאון סויסה", role: "מנהל צוות" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות" },
        { id: 5, name: "נועה ברק", role: "חברת צוות" }
      ],
      messages: [
        {
          id: 1,
          sender: "שמחה",
          message: "שלחתי לכם מסמך עם ממצאים ראשוניים של הסקר",
          time: "10:15",
        }
      ]
    }
  ];

  const tasks = [
    { id: 1, title: "עבודה מחקרית לפסיכולוגיה", due: "15 במרץ 2025", status: "בתהליך" },
    { id: 2, title: "פרויקט שנת אחודה", due: "30 במאי 2025", status: "בבדיקה" },
    { id: 3, title: "סיכום הרצאות 1-5 בנושא מחקר", due: "30 באוקטובר 2025", status: "הושלם" },
  ];

  const courses = [
    { id: 1, title: "פסיכולוגיה חברתית", teacher: "פרופ' גימבורג", credits: 2 },
    { id: 2, title: "שיטות מחקר מתקדמות", teacher: 'ד"ר אלשיך', credits: 3 },
    { id: 3, title: "סטטיסטיקה יישומית", teacher: 'ד"ר רונית כהן', credits: 4 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>מנהל פרויקטים ומשימות</h1>
      <p style={{ fontSize: "0.9rem" }}>ניהול קורסים, פרויקטים ומשימות במקום אחד</p>

      <div style={{ display: "flex", gap:20, alignItems: "center", margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="חפש פרויקט, קורס או משימה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "70%" }}
        />
        <button style={{ backgroundColor: "grey" }}>הוספת קורס/פרויקט</button>
      </div>

      <nav style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
        <button onClick={() => setActiveTab("projects")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "projects" ? "2px solid black" : "none" }}>פרויקטים</button>
        <button onClick={() => setActiveTab("tasks")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "tasks" ? "2px solid black" : "none" }}>משימות</button>
        <button onClick={() => setActiveTab("courses")} style={{ padding: "0.5rem 1rem", borderBottom: activeTab === "courses" ? "2px solid black" : "none" }}>קורסים</button>
      </nav>

      {activeTab === "projects" && (
        <section>
          {projects.filter(p => p.name.includes(searchTerm)).map(project => (
            <div key={project.id} style={{ border: "1px solid #ccc", marginBottom: "1rem" }}>
              <div style={{ padding: "0.75rem", cursor: "pointer", background: "#f9f9f9" }} onClick={() => toggleProject(project.id)}>
                <strong>{project.name}</strong> - {project.status} ({project.tasks} משימות)
              </div>
              {expandedProjectId === project.id && (
                <div style={{ padding: "1rem" }}>
                  <p>{project.description}</p>
                  <h4>חברי צוות:</h4>
                  <ul>
                    {project.teamMembers.map(member => (
                      <li key={member.id}>{member.name} - {member.role}</li>
                    ))}
                  </ul>
                  <h4>צ'אט קבוצתי:</h4>
                  {project.messages.map(msg => (
                    <div key={msg.id} style={{ border: "1px solid #eee", padding: "0.5rem", marginBottom: "0.5rem" }}>
                      <p><strong>{msg.sender}:</strong> {msg.message}</p>
                      <small>{msg.time}</small>
                    </div>
                  ))}
                  <textarea placeholder="כתיבת הודעה חדשה..." style={{ width: "100%", marginTop: "0.5rem" }} />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === "tasks" && (
        <section>
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
          <button style={{ backgroundColor: "grey" }} onClick={() => setIsAddTaskOpen(true)}>הוספת משימה</button>
          </div>
          {tasks.filter(t => t.title.includes(searchTerm)).map(task => (
            <div key={task.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <h3>{task.title}</h3>
              <p>תאריך יעד: {task.due}</p>
              <p>סטטוס: {task.status}</p>
            </div>
          ))}
        </section>
      )}

      {activeTab === "courses" && (
        <section>
          {courses.filter(c => c.title.includes(searchTerm)).map(course => (
            <div key={course.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <h3>{course.title}</h3>
              <p>{course.teacher}</p>
              <p>נקודות זכות: {course.credits}</p>
            </div>
          ))}
        </section>
      )}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>
              עזרה והגדרות
            </Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>
              תנאי שימוש
            </div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer>
      <AddTask isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />
    </div>
  );
};

export default CourseManagement;
