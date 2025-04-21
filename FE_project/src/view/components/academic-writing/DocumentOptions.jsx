import React from "react";
import "./DocumentOptions.css";

const DocumentOptions = ({
  documentType,
  setDocumentType,
  citationStyle,
  setCitationStyle,
  documentTypes,
  citationStyles,
}) => {
  return (
    <div className="document-options">
      <div className="option-column">
        <label className="option-label">סוג המסמך</label>
        <select 
          className="option-select" 
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          {documentTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      <div className="option-column">
        <label className="option-label">סגנון ציטוט</label>
        <select 
          className="option-select" 
          value={citationStyle}
          onChange={(e) => setCitationStyle(e.target.value)}
        >
          {citationStyles.map((style) => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>
      </div>
      
      <div className="option-column">
        <label className="option-label">תבנית מסמך</label>
        <select className="option-select">
          <option value="basic">תבנית בסיסית</option>
          <option value="research">תבנית מחקר</option>
          <option value="thesis">תבנית תזה</option>
          <option value="custom">תבנית מותאמת אישית</option>
        </select>
      </div>
    </div>
  );
};

export default DocumentOptions;