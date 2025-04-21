import React from "react";
import DocumentOptions from "./DocumentOptions";
import DocumentEditor from "./DocumentEditor";
import "./MainPanel.css";

const MainPanel = ({
  documentType,
  setDocumentType,
  citationStyle,
  setCitationStyle,
  documentTypes,
  citationStyles,
  content,
  setContent,
}) => {
  return (
    <div className="main-panel">
      {/* בחירת סוג מסמך וסגנון ציטוט */}
      <DocumentOptions 
        documentType={documentType}
        setDocumentType={setDocumentType}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
        documentTypes={documentTypes}
        citationStyles={citationStyles}
      />

      {/* אזור העריכה */}
      <DocumentEditor 
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default MainPanel;