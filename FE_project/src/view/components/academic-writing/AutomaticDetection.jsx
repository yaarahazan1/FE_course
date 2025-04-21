import React from "react";
import { CheckSquare, Pen } from "lucide-react";
import "./AutomaticDetection.css";

const AutomaticDetection = () => {
  return (
    <div className="automatic-detection">
      <h3 className="detection-title">זיהוי אוטומטי</h3>
      <div className="detection-items">
        <div className="detection-item">
          <CheckSquare className="detection-icon" />
          <span className="detection-text">חזרה מיותרת על רעיונות או מידע</span>
        </div>
        <div className="detection-item">
          <Pen className="detection-icon" />
          <span className="detection-text">חוסר בהירות במבנה המאמר וארגון לא מסודר</span>
        </div>
      </div>
    </div>
  );
};

export default AutomaticDetection;