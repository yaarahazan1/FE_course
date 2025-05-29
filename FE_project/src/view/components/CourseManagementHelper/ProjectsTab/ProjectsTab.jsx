import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./ProjectsTab.css";
import ProjectChat from "../ProjectChat/ProjectChat";

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [chatVisibility, setChatVisibility] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error("שגיאה בטעינת פרויקטים:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
    setSelectedProjectId(projectId);
  };

  const handleChatToggle = (e, projectId) => {
    e.stopPropagation();
    setChatVisibility((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "לא צוין תאריך";
    const date = new Date(dateString);
    return `תאריך הגשה: ${date.toLocaleDateString("he-IL")}`;
  };

  return (
    <div className="projects-tab">
      <div className="projects-header">
        <h2>רשימת פרויקטים</h2>
      </div>

      {loading ? (
        <p>טוען פרויקטים...</p>
      ) : projects.length === 0 ? (
        <div className="tasks-empty-message">
          <p>אין פרויקטים זמינים כרגע. לחץ על כפתור "הוסף פרויקט" כדי להתחיל.</p>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${
                selectedProjectId === project.id ? "selected" : ""
              }`}
              onClick={() => toggleProjectExpansion(project.id)}
            >
              <div className="project-summary">
                <h3>{project.name}</h3>
                <div className="project-meta">
                  <span
                    className={`project-status status-${project.status?.replace(/\s+/g, "-")}`}
                  >
                    {project.status}
                  </span>
                  <span className="project-date">{formatDate(project.dueDate)}</span>
                </div>
              </div>

              {expandedProjects[project.id] && (
                <div
                  className="project-details"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="project-description">{project.description}</p>
                  <p>
                    <strong>משימות:</strong> {project.tasks}
                  </p>

                  <div className="team-members">
                    <p>
                      <strong>חברי צוות:</strong>
                    </p>
                    <ul>
                      {(project.teamMembers || []).map((member, index) => (
                        <li key={member.id || index}>
                          {member.name} - {member.role}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="project-actions">
                    <button
                      className="chat-button"
                      onClick={(e) => handleChatToggle(e, project.id)}
                    >
                      {chatVisibility[project.id] ? "סגור צ'אט" : "פתח צ'אט"}
                    </button>
                  </div>

                  {chatVisibility[project.id] && (
                    <ProjectChat
                      projectId={project.id}
                      messages={(project.messages || []).map((msg) => ({
                        ...msg,
                        isMine: msg.sender === "אני",
                      }))}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
