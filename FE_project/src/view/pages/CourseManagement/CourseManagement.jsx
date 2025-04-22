import React, { useState } from "react";
import PageHeader from "../PageHeader";

function ProjectTaskManager() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const tasks = [
    { id: 1, title: "עבודת מחקרית לפסיכולוגיה", status: "מתבצע", date: "15 ביוני 2025" },
    { id: 2, title: "פרויקט שנה באתיקה", status: "בבדיקה", date: "30 במאי 2025" },
    { id: 3, title: "סיכום הרצאות 1-5 בשיטות מחקר", status: "הושלם", date: "30 באוקטובר 2025" },
  ];

  const projects = [
    {
      id: 1,
      title: "SnackMatch",
      description: "אפליקציה שתתאים חטיפים לפי מצב רוח שלך",
      group: ["יואב לוי", "מאיה כהן", "דנה פרידמן"],
      chat: [
        { from: "יואב", message: "בקרוב נעלה דברים שהשלמנו" },
        { from: "מאיה", message: "סיימתי לכתוב חלק מהסקירה" },
      ],
    },
  ];

  const renderTasks = () => (
    <div>
      {tasks.map((task) => (
        <div key={task.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h3>{task.title}</h3>
          <p>התאריך: {task.date}</p>
          <span>{task.status}</span>
        </div>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div>
      {projects.map((project) => (
        <div key={project.id} style={{ border: "1px solid #ccc", marginBottom: "1rem" }}>
          <div
            style={{ padding: "1rem", cursor: "pointer" }}
            onClick={() => setExpandedProjectId(project.id === expandedProjectId ? null : project.id)}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          {expandedProjectId === project.id && (
            <div style={{ padding: "1rem", borderTop: "1px solid #ccc", background: "#f9f9f9" }}>
              <h4>חברי הקבוצה:</h4>
              <ul>
                {project.group.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
              <h4 style={{ marginTop: "1rem" }}>צ׳אט קבוצתי:</h4>
              <div style={{ border: "1px solid #ddd", padding: "0.5rem", marginTop: "0.5rem" }}>
                {project.chat.map((msg, idx) => (
                  <div key={idx}><strong>{msg.from}:</strong> {msg.message}</div>
                ))}
              </div>
              <textarea style={{ width: "100%", marginTop: "0.5rem" }} placeholder="כתיבת הודעה..." />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "1rem", direction: "rtl", fontFamily: "sans-serif" }}>
      {/* Header */}
      <PageHeader />
  
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2>מנהל פרויקטים ומשימות</h2>
        <button style={{ padding: "0.5rem 1rem" }}>הוספת קורס/פרויקט +</button>
      </header>

      {/* Search and Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <input type="text" placeholder="חפש משימה, פרויקט, קורס..." style={{ flex: 1, padding: "0.5rem" }} />
      </div>

      <nav style={{ display: "flex", gap: "2rem", marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
        <span style={{ cursor: "pointer", fontWeight: activeTab === "courses" ? "bold" : "normal" }} onClick={() => setActiveTab("courses")}>קורסים</span>
        <span style={{ cursor: "pointer", fontWeight: activeTab === "projects" ? "bold" : "normal" }} onClick={() => setActiveTab("projects")}>פרויקטים</span>
        <span style={{ cursor: "pointer", fontWeight: activeTab === "tasks" ? "bold" : "normal" }} onClick={() => setActiveTab("tasks")}>משימות</span>
      </nav>

      {/* Content */}
      <div>
        {activeTab === "tasks" && renderTasks()}
        {activeTab === "projects" && renderProjects()}
        {activeTab === "courses" && <p>כאן יופיעו קורסים.</p>}
      </div>

      {/* Footer */}
      <footer style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.8rem", color: "#777" }}>
        <span>עזרה והדרכות | תנאי שימוש | מדיניות פרטיות</span>
      </footer>
    </div>
  );
}

export default ProjectTaskManager;
