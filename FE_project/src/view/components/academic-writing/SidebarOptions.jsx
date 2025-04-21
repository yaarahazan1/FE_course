import React from "react";
import ExportOptions from "./ExportOptions";
import CloudBackup from "./CloudBackup";
import SharingOptions from "./SharingOptions";
import "./SidebarOptions.css";

const SidebarOptions = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-panel">
        <h3 className="sidebar-title">אפשרויות נוספות</h3>
        <div className="sidebar-content">
          <ExportOptions />
          <CloudBackup />
          <SharingOptions />
        </div>
      </div>
    </div>
  );
};

export default SidebarOptions;