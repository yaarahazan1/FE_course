import React from "react";
import "./TaskList.css";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

const TaskList = ({ filteredTasks, onAddTask }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "אישי":
        return "#B3C8CF";
      case "לימודים":
        return "#89A8B2";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <button className="add-task-btn" onClick={onAddTask}>
          <PlusCircle className="icon" />
          הוספת משימה
        </button>
      </div>

      <div className="scroll-area">
        {filteredTasks
          .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
          .map((task) => (
            <div
              key={task.id}
              className="task-card"
              style={{ borderRightColor: getTypeColor(task.type) }}
            >
              <div className="badge" style={{ backgroundColor: getTypeColor(task.type) }}>
                {task.type === "לימודים" ? task.priority : task.type}
              </div>
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                {task.course && <div className="task-course">{task.course}</div>}
              </div>
              <div className="task-deadline">
                <div className="date">{format(task.deadline, "dd/MM/yyyy")}</div>
                <div className="countdown">
                  בעוד{" "}
                  {Math.floor(
                    (task.deadline.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  ימים
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TaskList;
