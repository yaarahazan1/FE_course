import React, { useState } from "react";
import "./ProjectsTab.css";
import ProjectChat from "../ProjectChat/ProjectChat";

const ProjectsTab = ({ projects, selectedProjectId, setSelectedProjectId }) => {
  // שינוי: במקום משתנה showChat יחיד, נשתמש באובייקט שמחזיק את מצב הצ'אט לכל פרויקט
  const [chatVisibility, setChatVisibility] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
    setSelectedProjectId(projectId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "לא צוין תאריך";
    const date = new Date(dateString);
    return `תאריך הגשה: ${date.toLocaleDateString("he-IL")} `;
  };

  // מניעת סגירת הפרויקט בעת לחיצה על כפתור הצ'אט
  // שינוי: עדכון הפונקציה לניהול מצב הצ'אט עבור פרויקט ספציפי
  const handleChatToggle = (e, projectId) => {
    e.stopPropagation();
    setChatVisibility(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div className="projects-tab">
      <div className="projects-header">
        <h2>רשימת פרויקטים</h2>
      </div>

      <div className="project-list">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card ${selectedProjectId === project.id ? "selected" : ""}`}
            onClick={() => toggleProjectExpansion(project.id)}
          >
            <div className="project-summary">
              <h3>{project.name}</h3>
              <div className="project-meta">
                <span className={`project-status status-${project.status.replace(/\s+/g, '-')}`}>
                  {project.status}
                </span>
                <span className="project-date">{formatDate(project.dueDate)}</span>
              </div>
            </div>

            {/* Expanded content shown only when selected */}
            {expandedProjects[project.id] && (
              <div className="project-details" onClick={(e) => e.stopPropagation()}>
                <p className="project-description">{project.description}</p>
                <p><strong>משימות:</strong> {project.tasks}</p>

                <div className="team-members">
                  <p><strong>חברי צוות:</strong></p>
                  <ul>
                    {project.teamMembers.map((member) => (
                      <li key={member.id}>{member.name} - {member.role}</li>
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
                    messages={project.messages.map(msg => ({
                      ...msg,
                      isMine: msg.sender === "אני"
                    }))}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;