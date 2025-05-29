import React from "react";
import { Search, XCircle, CheckCircle, FileText, Trash2 } from "lucide-react";
import "./SummaryList.css";

const SummaryList = ({
  summaries,
  searchTerm,
  onSearchChange,
  onSummaryAction,
  onSummarySelect,
}) => {
  
  // פורמט תאריך לתצוגה
  const formatDate = (date) => {
    if (!date) return "לא זמין";
    
    // אם זה Firestore timestamp
    if (date?.toDate) {
      return date.toDate().toLocaleDateString('he-IL');
    }
    
    // אם זה Date object
    if (date instanceof Date) {
      return date.toLocaleDateString('he-IL');
    }
    
    // אם זה string
    return date;
  };

  // מיון הסיכומים לפי תאריך יצירה (החדשים קודם)
  const sortedSummaries = [...summaries].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || a.date);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || b.date);
    return dateB - dateA;
  });

  if (summaries.length === 0) {
    return (
      <div className="summary-list-container">
        <div className="summary-list-header">
          <h2 className="summary-list-title">רשימת סיכומים לאישור</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="חיפוש סיכומים..."
              value={searchTerm}
              onChange={onSearchChange}
              className="summary-search-input"
            />
            <Search className="search-icon" />
          </div>
        </div>
        <div className="empty-state">
          <FileText className="empty-icon" />
          <p>אין סיכומים זמינים כרגע</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-list-container">
      <div className="summary-list-header">
        <h2 className="summary-list-title">רשימת סיכומים לאישור ({summaries.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="חיפוש לפי כותרת או מחבר..."
            value={searchTerm}
            onChange={onSearchChange}
            className="summary-search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      <div className="table-container">
        <table className="summaries-table">
          <thead>
            <tr>
              <th>כותרת הסיכום</th>
              <th>מחבר</th>
              <th>תאריך העלאה</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {sortedSummaries.map((summary) => (
              <tr key={summary.id} className="table-row">
                <td 
                  className="summary-title" 
                  onClick={() => onSummarySelect(summary)}
                  title="לחץ לצפייה בפרטים"
                >
                  <FileText className="file-icon" />
                  <span className="title-text">
                    {summary.title || "ללא כותרת"}
                  </span>
                </td>
                <td 
                  onClick={() => onSummarySelect(summary)}
                  title="לחץ לצפייה בפרטים"
                >
                  {summary.author || summary.userName || "לא ידוע"}
                </td>
                <td 
                  onClick={() => onSummarySelect(summary)}
                  title="לחץ לצפייה בפרטים"
                >
                  {formatDate(summary.createdAt || summary.date)}
                </td>
                <td 
                  onClick={() => onSummarySelect(summary)}
                  title="לחץ לצפייה בפרטים"
                >
                  <span className={`status-badge ${
                    summary.status === "מאושר" ? "approved" :
                    summary.status === "נדחה" ? "rejected" :
                    summary.status === "ממתין לאישור" ? "pending" : "default"
                  }`}>
                    {summary.status || "ממתין לאישור"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn details-btn"
                      onClick={() => onSummarySelect(summary)}
                      title="צפייה בפרטים מלאים"
                    >
                      <FileText className="btn-icon" />
                      פרטים
                    </button>
                    
                    {summary.status !== "מאושר" && (
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => onSummaryAction("אישור", summary.id)}
                        title="אישור הסיכום"
                      >
                        <CheckCircle className="btn-icon" />
                        אישור
                      </button>
                    )}
                    
                    {summary.status !== "נדחה" && (
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => onSummaryAction("דחייה", summary.id)}
                        title="דחיית הסיכום"
                      >
                        <XCircle className="btn-icon" />
                        דחייה
                      </button>
                    )}
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => {
                        if (window.confirm('האם אתה בטוח שברצונך למחוק את הסיכום? פעולה זו לא הפיכה.')) {
                          onSummaryAction("מחיקה", summary.id);
                        }
                      }}
                      title="מחיקת הסיכום לצמיתות"
                    >
                      <Trash2 className="btn-icon" />
                      מחיקה
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedSummaries.length === 0 && searchTerm && (
        <div className="no-results">
          <p>לא נמצאו סיכומים המתאימים לחיפוש "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default SummaryList;