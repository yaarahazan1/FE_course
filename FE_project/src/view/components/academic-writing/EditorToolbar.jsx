import React, { useState } from "react";
import "./EditorToolbar.css";

const EditorToolbar = () => {
  const [showCitationPopover, setShowCitationPopover] = useState(false);
  
  return (
    <div className="editor-toolbar">
      <button className="toolbar-button">
        <span className="font-bold">ב</span>
      </button>
      <button className="toolbar-button">
        <span className="italic">א</span>
      </button>
      <button className="toolbar-button">
        <span className="underline">ק</span>
      </button>
      <button className="toolbar-button">
        ≡
      </button>
      <button className="toolbar-button">
        •
      </button>
      <button className="toolbar-button">
        1.
      </button>
      <button className="toolbar-button">
        &ldquo;&rdquo;
      </button>
      
      <div className="citation-popover-container">
        <button 
          className="toolbar-button"
          onClick={() => setShowCitationPopover(!showCitationPopover)}
        >
          הוסף ציטוט
        </button>
        
        {showCitationPopover && (
          <div className="citation-popover">
            <div className="citation-content">
              <h3 className="citation-title">הוספת ציטוט</h3>
              <div className="citation-form">
                <input 
                  className="citation-input" 
                  placeholder="שם המחבר" 
                />
                <input 
                  className="citation-input" 
                  placeholder="כותרת המקור" 
                />
                <input 
                  className="citation-input" 
                  placeholder="שנת פרסום" 
                />
                <input 
                  className="citation-input" 
                  placeholder="מספרי עמודים" 
                />
                <button className="citation-add-button">הוסף</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;