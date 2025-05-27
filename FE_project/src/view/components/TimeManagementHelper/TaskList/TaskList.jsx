import React from 'react';
import { PlusCircle } from 'lucide-react';
import './TaskList.css';

// Helper function to get color based on task type
const getTypeColor = (type) => {
  switch (type) {
    case "לימודים":
      return "blue";
    case "עבודה":
      return "green";
    case "אישי":
      return "purple";
    default:
      return "gray";
  }
};

const TaskList = ({ filteredTasks, onAddTask }) => {
  return (
    <div className="task-list-container">
      <button className="add-task-button" onClick={onAddTask}>
        <PlusCircle className="plus-icon" />
        <span>הוספת משימה</span>
      </button>
      
      <div className="task-list">
        {filteredTasks
          .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
          .map(task => (
            <div className="task-card" key={task.id}>
              <div className="task-header">
                <span className={`task-badge ${getTypeColor(task.type)}`}>
                  {task.type === "לימודים" ? task.priority : task.type}
                </span>
              </div>
              
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.course && <p className="task-course">{task.course}</p>}
              </div>

            </div>
          ))}
      </div>
    </div>
  );
};

export default TaskList;