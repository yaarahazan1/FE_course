import React from "react";
import { Share2 } from "lucide-react";
import "./SharingOptions.css";

const SharingOptions = () => {
  return (
    <div className="sharing-card">
      <div className="card-header">
        <h3 className="card-title">שיתוף</h3>
      </div>
      <div className="card-content">
        <button className="share-button">
          <Share2 className="button-icon" />
          שיתוף להערות ומשוב
        </button>
      </div>
    </div>
  );
};

export default SharingOptions;