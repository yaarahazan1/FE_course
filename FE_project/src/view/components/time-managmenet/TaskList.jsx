import React from "react";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { getTypeColor } from "./timeManagementUtils";
import "./TaskList.css";

const TaskList = ({ filteredTasks, onAddTask }) => {
  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <button className="add-task-button" onClick={onAddTask}>
          <PlusCircle className="icon-small" />
          הוספת משימה
        </button>
      </div>

      <div className="tasks-scroll-area">
        <div className="tasks-list">
          {filteredTasks
            .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
            .map(task => (
              <div 
                key={task.id} 
                className="task-card"
                style={{ borderRightColor: task.type === "לימודים" ? task.color : getTypeColor(task.type) }}
              >
                <div className="task-badge-container">
                  <span 
                    className="task-badge"
                    style={{ backgroundColor: task.type === "לימודים" ? task.color : getTypeColor(task.type) }}
                  >
                    {task.type === "לימודים" ? task.priority : task.type}
                  </span>
                </div>
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  {task.course && <div className="task-course">{task.course}</div>}
                </div>
                <div className="task-deadline">
                  <div className="deadline-date">
                    {format(task.deadline, "dd/MM/yyyy")}
                  </div>
                  <div className="days-remaining">
                    בעוד {Math.floor((task.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ימים
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;