import React from "react";
import { XCircle, CheckCircle, Trash2 } from "lucide-react";
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

  const handleDeleteClick = () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הסיכום? פעולה זו לא ניתנת לביטול.")) {
      onSummaryAction("מחיקה", summary.id);
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
              <div className="summary-info-value">
                <span className={`status-badge ${summary.status === 'מאושר' ? 'approved' : summary.status === 'נדחה' ? 'rejected' : 'pending'}`}>
                  {summary.status}
                </span>
              </div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">עמודים:</div>
              <div className="summary-info-value">{summary.pages || 'לא צוין'}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">הורדות:</div>
              <div className="summary-info-value">{summary.downloads || 0}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">דירוג:</div>
              <div className="summary-info-value">{summary.rating || 0}/5</div>
            </div>
            {summary.url && (
              <div className="summary-info-row">
                <div className="summary-info-label">קובץ:</div>
                <div className="summary-info-value">
                  <a href={summary.url} target="_blank" rel="noopener noreferrer" className="file-link">
                    צפה בקובץ
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="summary-content-section">
            <div className="summary-content-title">תוכן הסיכום:</div>
            <div className="summary-content-box">
              {summary.content || "זהו תוכן הסיכום לדוגמה. במערכת אמיתית, כאן יוצג תוכן הסיכום המלא שהועלה על ידי המשתמש."}
            </div>
            
            {summary.adminFeedback && (
              <div className="existing-feedback-section">
                <div className="summary-feedback-title">משוב קיים:</div>
                <div className="existing-feedback-box">
                  {summary.adminFeedback}
                </div>
              </div>
            )}
            
            <div className="summary-feedback-title">משוב חדש למשתמש:</div>
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
          <div className="summary-dialog-actions-left">
            <button 
              className="summary-dialog-btn summary-delete-btn"
              onClick={handleDeleteClick}
              title="מחק סיכום לצמיתות"
            >
              <Trash2 className="btn-icon" />
              מחיקת הסיכום
            </button>
          </div>
          
          <div className="summary-dialog-actions-right">
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
    </div>
  );
};

export default SummaryDetailDialog;