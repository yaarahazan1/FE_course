// ProjectCard.jsx
import React from "react";
import ChatSection from "./ChatSection";
import "./ProjectCard.css";

const ProjectCard = ({ project, selectedProjectId, onProjectSelect }) => {
  const isSelected = selectedProjectId === project.id;
  
  return (
    <div 
      className={`project-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onProjectSelect(project.id)}
    >
      <div className="project-content">
        <div className="project-header">
          <span className={`project-status ${
            project.status === "פעיל" ? 'status-active' : 'status-pending'
          }`}>
            {project.status}
          </span>
          <h3 className="project-name">{project.name}</h3>
        </div>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <div className={`chevron ${isSelected ? 'rotate' : ''}`}>
            {/* Replace with actual chevron icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div>{project.tasks} משימות | {project.teamMembers.length} חברי צוות</div>
        </div>

        {/* Collapsible Project Details */}
        {isSelected && (
          <div className="project-details">
            {/* Team Members */}
            <div className="team-members-section">
              <h4 className="section-title">חברי צוות</h4>
              <div className="members-list">
                {project.teamMembers.map(member => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="member-name">{member.name}</h5>
                        <p className="member-role">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Chat */}
            <div className="chat-section">
              <h4 className="section-title">צ'אט צוות</h4>
              <ChatSection initialMessages={project.messages} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;