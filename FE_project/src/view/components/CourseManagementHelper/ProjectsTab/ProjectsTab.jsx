import React from "react";
import "./ProjectsTab.css";

const ProjectsTab = ({ projects, selectedProjectId, setSelectedProjectId }) => {
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
            onClick={() => setSelectedProjectId(project.id)}
          >
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <p><strong>סטטוס:</strong> {project.status}</p>
            <p><strong>משימות:</strong> {project.tasks}</p>

            <div className="team-members">
              <p><strong>חברי צוות:</strong></p>
              <ul>
                {project.teamMembers.map((member) => (
                  <li key={member.id}>{member.name} - {member.role}</li>
                ))}
              </ul>
            </div>

            <div className="messages">
              <p><strong>הודעות:</strong></p>
              <ul>
                {project.messages.map((msg) => (
                  <li key={msg.id}>
                    <strong>{msg.sender}:</strong> {msg.message} ({msg.time})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
