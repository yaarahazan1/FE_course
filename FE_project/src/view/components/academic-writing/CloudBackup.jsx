import React from "react";
import { Cloud } from "lucide-react";
import "./CloudBackup.css";

const CloudBackup = () => {
  const [backupOption, setBackupOption] = React.useState("googledrive");
  
  return (
    <div className="cloud-backup-card">
      <div className="card-header">
        <h3 className="card-title">שמירה בענן</h3>
      </div>
      <div className="card-content">
        <form className="backup-form">
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="googledrive" 
                name="backupOption" 
                value="googledrive"
                checked={backupOption === "googledrive"}
                onChange={() => setBackupOption("googledrive")}
              />
              <label htmlFor="googledrive" className="radio-label">Google Drive</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="onedrive" 
                name="backupOption" 
                value="onedrive"
                checked={backupOption === "onedrive"}
                onChange={() => setBackupOption("onedrive")}
              />
              <label htmlFor="onedrive" className="radio-label">OneDrive</label>
            </div>
          </div>
        </form>
        
        <button className="backup-button">
          <Cloud className="button-icon" />
          שמירה בענן
        </button>
      </div>
    </div>
  );
};

export default CloudBackup;