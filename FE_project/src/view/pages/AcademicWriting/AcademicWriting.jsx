import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import ContentArea from "../../components/academic-writing/ContentArea";
import AutomaticDetection from "../../components/academic-writing/AutomaticDetection";
import AcademicHeader from "../../components/academic-writing/AcademicHeader";
import AcademicFooter from "../../components/academic-writing/AcademicFooter";
import "./AcademicWriting.css";

const AcademicWriting = () => {
  const [documentType, setDocumentType] = useState("מאמר");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");

  const documentTypes = [
    { value: "מאמר", label: "מאמר אקדמי" },
    { value: "תזה", label: "תזה / דיסרטציה" },
    { value: "סמינריון", label: "עבודה סמינריונית" },
    { value: "מסמך", label: "מסמך מחקרי" },
  ];

  const citationStyles = [
    { value: "APA", label: "APA" },
    { value: "MLA", label: "MLA" },
    { value: "Chicago", label: "Chicago" },
    { value: "Harvard", label: "Harvard" },
    { value: "IEEE", label: "IEEE" },
  ];

  return (
    <div className={"container"}>
      {/* סרגל ניווט */}
      <PageHeader />

      {/* כותרת */}
      <AcademicHeader />

      {/* תוכן העמוד - מחולק לפאנל ראשי וסרגל צד */}
      <ContentArea
        documentType={documentType}
        setDocumentType={setDocumentType}
        citationStyle={citationStyle}
        setCitationStyle={setCitationStyle}
        documentTypes={documentTypes}
        citationStyles={citationStyles}
        content={content}
        setContent={setContent}
      />

      {/* זיהוי אוטומטי */}
      <AutomaticDetection />

      {/* Footer */}
      <AcademicFooter />
    </div>
  );
};

export default AcademicWriting;