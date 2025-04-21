// TasksTab.jsx
import React from "react";
import TasksList from "./TasksList";
import GroupUpdatesSection from "./GroupUpdatesSection";
import "./TasksTab.css";

const TasksTab = ({ onAddTask }) => {
  return (
    <div className="tasks-tab-container">
      <div className="tasks-tab-header">
        <button 
          onClick={onAddTask} 
          className="add-task-btn"
        >
          הוספת משימה
        </button>
        <h2 className="tasks-tab-title">המשימות שלי</h2>
      </div>

      <div className="tasks-tab-content">
        <TasksList />
      </div>

      <GroupUpdatesSection />
    </div>
  );
};

export default TasksTab;