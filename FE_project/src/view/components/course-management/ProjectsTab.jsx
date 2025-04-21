// ProjectsTab.jsx
import React from "react";
import ProjectCard from "./ProjectCard";
import "./ProjectsTab.css";

const ProjectsTab = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onAddProject
}) => {
  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId === selectedProjectId ? null : projectId);
  };
  
  return (
    <div className="projects-container">
      <div className="projects-header">
        <button 
          onClick={onAddProject} 
          className="add-project-button"
        >
          הוספת פרויקט
        </button>
        <h2 className="projects-title">הפרויקטים שלי</h2>
      </div>
      
      {projects.map(project => (
        <ProjectCard 
          key={project.id}
          project={project}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
        />
      ))}
    </div>
  );
};

export default ProjectsTab;