import React from "react";
import { Save } from "lucide-react";
import EditorToolbar from "./EditorToolbar";
import "./DocumentEditor.css";

const DocumentEditor = ({ content, setContent }) => {
  return (
    <>
      <EditorToolbar />
      
      <div className="editor-card">
        <textarea 
          className="document-textarea" 
          placeholder="התחל לכתוב את המסמך שלך כאן..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="editor-stats">
        <div className="autosave-info">
          <Save className="autosave-icon" />
          נשמר אוטומטית
        </div>
        <div className="word-count">
          מילים: {content.trim() ? content.trim().split(/\s+/).length : 0}
        </div>
      </div>
    </>
  );
};

export default DocumentEditor;