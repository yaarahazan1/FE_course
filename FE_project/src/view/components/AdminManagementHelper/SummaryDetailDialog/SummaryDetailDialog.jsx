import React from "react";
import { XCircle, CheckCircle } from "lucide-react";
import "./SummaryDetailDialog.css";

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
          </div>
          
          <div className="summary-content-section">
            <div className="summary-content-title">תוכן הסיכום:</div>
            <div className="summary-content-box">
              {summary.content || "זהו תוכן הסיכום לדוגמה. במערכת אמיתית, כאן יוצג תוכן הסיכום המלא שהועלה על ידי המשתמש."}
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