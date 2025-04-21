import React from "react";
import MainPanel from "./MainPanel";
import SidebarOptions from "./SidebarOptions";
import "./ContentArea.css";

const ContentArea = ({
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
    <div className="content-area">
      {/* Main Panel - תופס 3/4 מהרוחב במסכים גדולים */}
      <MainPanel
        documentType={documentType}
        setDocumentType={setDocumentType}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
        documentTypes={documentTypes}
        citationStyles={citationStyles}
        content={content}
        setContent={setContent}
      />

      {/* Sidebar - אפשרויות ייצוא, גיבוי ושיתוף */}
      <SidebarOptions />
    </div>
  );
};

export default ContentArea;