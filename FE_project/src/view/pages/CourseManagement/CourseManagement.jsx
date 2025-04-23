import React, { useState } from "react";
import PageHeader from "../PageHeader";
import AddTask from "../AddTask/AddTask";
import { Link } from "react-router-dom";
import "./CourseManagement.css";
import "../../../styles/styles.css";

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
          message: "זוכרים שהמשימה 'טופס מצב רוח' מוגשת השבוע",
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
          message: "שלחתי מסמך עם ממצאים ראשוניים",
          time: "10:15",
        }
      ]
    }
  ];

  const tasks = [
    { id: 1, title: "עבודה מחקרית לפסיכולוגיה", due: "15 במרץ 2025", status: "בתהליך" },
    { id: 2, title: "פרויקט שנת אחודה", due: "30 במאי 2025", status: "בבדיקה" },
    { id: 3, title: "סיכום הרצאות 1-5", due: "30 באוקטובר 2025", status: "הושלם" },
  ];

  const courses = [
    { id: 1, title: "פסיכולוגיה חברתית", teacher: "פרופ' גימבורג", credits: 2 },
    { id: 2, title: "שיטות מחקר", teacher: 'ד"ר אלשיך', credits: 3 },
    { id: 3, title: "סטטיסטיקה", teacher: 'ד"ר רונית כהן', credits: 4 },
  ];

  return (
    <div className="page">
      <PageHeader />
      <h1 className="title">מנהל פרויקטים ומשימות</h1>
      <p className="subtitle">ניהול קורסים, פרויקטים ומשימות במקום אחד</p>

      <div className="search-add-container">
        <input
          type="text"
          placeholder="חפש פרויקט, קורס או משימה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>הוספת קורס/פרויקט</button>
      </div>

      <nav className="tabs">
        <button onClick={() => setActiveTab("projects")} className={activeTab === "projects" ? "active" : ""}>פרויקטים</button>
        <button onClick={() => setActiveTab("tasks")} className={activeTab === "tasks" ? "active" : ""}>משימות</button>
        <button onClick={() => setActiveTab("courses")} className={activeTab === "courses" ? "active" : ""}>קורסים</button>
      </nav>

      {activeTab === "projects" && (
        <section>
          {projects.filter(p => p.name.includes(searchTerm)).map(project => (
            <div key={project.id} className="project-box">
              <div className="project-header" onClick={() => toggleProject(project.id)}>
                <strong>{project.name}</strong> - {project.status} ({project.tasks} משימות)
              </div>
              {expandedProjectId === project.id && (
                <div className="project-details">
                  <p>{project.description}</p>
                  <h4>חברי צוות:</h4>
                  <ul>
                    {project.teamMembers.map(member => (
                      <li key={member.id}>{member.name} - {member.role}</li>
                    ))}
                  </ul>
                  <h4>צ'אט קבוצתי:</h4>
                  {project.messages.map(msg => (
                    <div key={msg.id} className="message-box">
                      <p><strong>{msg.sender}:</strong> {msg.message}</p>
                      <small>{msg.time}</small>
                    </div>
                  ))}
                  <textarea placeholder="כתיבת הודעה חדשה..." />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {activeTab === "tasks" && (
        <section>
          <div style={{ textAlign: "left", marginBottom: "1rem" }}>
            <button className="add-task" onClick={() => setIsAddTaskOpen(true)}>הוספת משימה</button>
          </div>
          {tasks.filter(t => t.title.includes(searchTerm)).map(task => (
            <div key={task.id} className="task-box">
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
            <div key={course.id} className="course-box">
              <h3>{course.title}</h3>
              <p>{course.teacher}</p>
              <p>נקודות זכות: {course.credits}</p>
            </div>
          ))}
        </section>
      )}

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

      <AddTask isOpen={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} />
    </div>
  );
};

export default CourseManagement;
