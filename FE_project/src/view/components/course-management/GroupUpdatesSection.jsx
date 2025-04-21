import React from "react";
import { Calendar } from "lucide-react";
import "./GroupUpdatesSection.css";

const GroupUpdatesSection = () => {
  return (
    <div className="group-updates-card">
      <div className="group-updates-header">
        <h3 className="group-updates-title">שיעורים</h3>
      </div>
      <div className="group-updates-content">
        <div className="add-task-button">
          <Calendar className="calendar-icon" />
          <h3 className="add-task-text">הוספת משימה</h3>
        </div>
      </div>
    </div>
  );
};

export default GroupUpdatesSection;