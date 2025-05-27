import React from "react";
import { Search, XCircle, CheckCircle, FileText } from "lucide-react";
import "./SummaryList.css";

const SummaryList = ({
  summaries,
  searchTerm,
  onSearchChange,
  onSummaryAction,
  onSummarySelect,
}) => {
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
            {summaries.map((summary) => (
              <tr key={summary.id} className="table-row">
                <td 
                  className="summary-title" 
                  onClick={() => onSummarySelect(summary)}
                >
                  <FileText className="file-icon" />
                  {summary.title}
                </td>
                <td onClick={() => onSummarySelect(summary)}>{summary.author}</td>
                <td onClick={() => onSummarySelect(summary)}>{summary.date}</td>
                <td onClick={() => onSummarySelect(summary)}>
                  <span className={`status-badge ${
                    summary.status === "מאושר" ? "approved" :
                    summary.status === "נדחה" ? "rejected" :
                    summary.status === "ממתין לאישור" ? "pending" : "default"
                  }`}>
                    {summary.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {summary.status !== "נדחה" && (
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => onSummaryAction("דחייה", summary.id)}
                      >
                        <XCircle className="btn-icon" />
                        דחייה
                      </button>
                    )}
                    {summary.status !== "מאושר" && (
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => onSummaryAction("אישור", summary.id)}
                      >
                        <CheckCircle className="btn-icon" />
                        אישור
                      </button>
                    )}
                    <button 
                      className="action-btn details-btn"
                      onClick={() => onSummarySelect(summary)}
                    >
                      <FileText className="btn-icon" />
                      פרטים
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryList;