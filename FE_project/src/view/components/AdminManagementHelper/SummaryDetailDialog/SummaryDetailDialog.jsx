import React from "react";
import { XCircle, CheckCircle, Eye, Download } from "lucide-react";
import "./SummaryDetailDialog.css";

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloud_name: 'doxht9fpl'
};

const SummaryDetailDialog = ({
  summary,
  isOpen,
  onOpenChange,
  feedbackText,
  onFeedbackChange,
  onSummaryAction,
}) => {
  if (!summary || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  // פונקציה לתצוגה מקדימה של הקובץ מ-Cloudinary
  const handlePreview = () => {
    if (summary.public_id) {
      const previewUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}.pdf`;
      window.open(previewUrl, '_blank');
    } else {
      alert("לא ניתן לפתוח תצוגה מקדימה - קובץ לא זמין");
    }
  };

  // פונקציה להורדת הקובץ מ-Cloudinary
  const handleDownload = () => {
    if (summary.public_id) {
      const downloadUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/fl_attachment/${summary.public_id}.pdf`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${summary.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("לא ניתן להוריד את הקובץ - קובץ לא זמין");
    }
  };

  return (
    <div className="summary-dialog-overlay" onClick={handleBackdropClick}>
      <div className="summary-dialog-content">
        <div className="summary-dialog-header">
          <h2 className="summary-dialog-title">פרטי סיכום</h2>
          <p className="summary-dialog-description">צפייה בסיכום ושליחת משוב</p>
        </div>
        
        <div className="summary-dialog-body">
          <div className="summary-info-grid">
            <div className="summary-info-row">
              <div className="summary-info-label">כותרת:</div>
              <div className="summary-info-value">{summary.title}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">מחבר:</div>
              <div className="summary-info-value">{summary.author}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">תאריך העלאה:</div>
              <div className="summary-info-value">{summary.date}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">קורס:</div>
              <div className="summary-info-value">{summary.course}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">מרצה:</div>
              <div className="summary-info-value">{summary.professor}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">סטטוס:</div>
              <div className="summary-info-value">{summary.status || 'ממתין לאישור'}</div>
            </div>
            {summary.pages && (
              <div className="summary-info-row">
                <div className="summary-info-label">מספר עמודים:</div>
                <div className="summary-info-value">{summary.pages}</div>
              </div>
            )}
          </div>
          
          {/* כפתורים לתצוגה והורדה */}
          {summary.public_id && (
            <div className="summary-file-actions">
              <button 
                className="summary-file-btn preview-btn"
                onClick={handlePreview}
                title="תצוגה מקדימה"
              >
                <Eye className="btn-icon" />
                תצוגה מקדימה
              </button>
              <button 
                className="summary-file-btn download-btn"
                onClick={handleDownload}
                title="הורד קובץ"
              >
                <Download className="btn-icon" />
                הורד קובץ
              </button>
            </div>
          )}
          
          <div className="summary-content-section">
            <div className="summary-content-title">תוכן הסיכום:</div>
            <div className="summary-content-box">
              {summary.content || summary.description || "תוכן הסיכום זמין בקובץ המצורף"}
            </div>
            
            <div className="summary-feedback-title">משוב למשתמש:</div>
            <textarea
              className="summary-feedback-textarea"
              placeholder="הוסף משוב או הערות עבור המשתמש..."
              value={feedbackText}
              onChange={onFeedbackChange}
              rows={4}
            />
          </div>
        </div>
        
        <div className="summary-dialog-footer">
          <button 
            className="summary-dialog-btn summary-reject-btn"
            onClick={() => onSummaryAction("דחייה", summary.id)}
          >
            <XCircle className="btn-icon" />
            דחיית הסיכום
          </button>
          <button 
            className="summary-dialog-btn summary-approve-btn"
            onClick={() => onSummaryAction("אישור", summary.id)}
          >
            <CheckCircle className="btn-icon" />
            אישור הסיכום
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetailDialog;