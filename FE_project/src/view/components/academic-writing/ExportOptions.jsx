import React, { useState } from "react";
import { Download, Code } from "lucide-react";
import "./ExportOptions.css";

const ExportOptions = () => {
  const [exportFormat, setExportFormat] = useState("pdf");
  
  return (
    <div className="export-options-card">
      <div className="card-header">
        <h3 className="card-title">אפשרויות ייצוא</h3>
      </div>
      <div className="card-content">
        <form className="export-form">
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="pdf" 
                name="exportFormat" 
                value="pdf"
                checked={exportFormat === "pdf"}
                onChange={() => setExportFormat("pdf")}
              />
              <label htmlFor="pdf" className="radio-label">PDF</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="word" 
                name="exportFormat" 
                value="word"
                checked={exportFormat === "word"}
                onChange={() => setExportFormat("word")}
              />
              <label htmlFor="word" className="radio-label">Word</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="latex" 
                name="exportFormat" 
                value="latex"
                checked={exportFormat === "latex"}
                onChange={() => setExportFormat("latex")}
              />
              <label htmlFor="latex" className="radio-label">
                <Code className="label-icon" /> LaTeX
              </label>
            </div>
          </div>
        </form>
        
        <button className="export-button">
          <Download className="button-icon" />
          ייצוא מסמך
        </button>
      </div>
    </div>
  );
};

export default ExportOptions;