import React from "react";
import { Search, UserX, UserMinus, UserCheck, User, Shield } from "lucide-react";
import "./UserList.css";

const UserList = ({
  users,
  searchTerm,
  onSearchChange,
  onUserAction,
  onUserSelect,
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

  // מיון המשתמשים לפי תאריך יצירה (החדשים קודם)
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || a.joinDate);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || b.joinDate);
    return dateB - dateA;
  });

  // סינון המשתמשים לפי סטטוס פעיל (להציג קודם)
  const prioritizedUsers = sortedUsers.sort((a, b) => {
    const statusA = a.status || "פעיל";
    const statusB = b.status || "פעיל";
    
    if (statusA === "פעיל" && statusB !== "פעיל") return -1;
    if (statusA !== "פעיל" && statusB === "פעיל") return 1;
    return 0;
  });

  if (users.length === 0) {
    return (
      <div className="user-list-container">
        <div className="user-list-header">
          <h2 className="user-list-title">רשימת משתמשים</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              value={searchTerm}
              onChange={onSearchChange}
              className="user-search-input"
            />
            <Search className="search-icon" />
          </div>
        </div>
        <div className="empty-state">
          <User className="empty-icon" />
          <p>אין משתמשים רשומים במערכת</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2 className="user-list-title">רשימת משתמשים ({users.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="חיפוש לפי שם או אימייל..."
            value={searchTerm}
            onChange={onSearchChange}
            className="user-search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>אימייל</th>
              <th>תחום לימוד</th>
              <th>מוסד לימודים</th>
              <th>תאריך הצטרפות</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {prioritizedUsers.map((user) => (
              <tr key={user.id} className="table-row">
                <td 
                  className="user-name" 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                >
                  <div className="user-name-cell">
                    {user.isAdmin && <Shield className="admin-icon" title="מנהל מערכת" />}
                    <span>{user.fullName || "לא זמין"}</span>
                  </div>
                </td>
                <td 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                  className="user-email"
                >
                  {user.email || "לא זמין"}
                </td>
                <td 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                >
                  {user.studyField || user.major || "לא צוין"}
                </td>
                <td 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                >
                  {user.institution || user.university || "לא צוין"}
                </td>
                <td 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                >
                  {formatDate(user.createdAt || user.joinDate)}
                </td>
                <td 
                  onClick={() => onUserSelect(user)}
                  title="לחץ לצפייה בפרטים"
                >
                  <span className={`status-badge ${
                    (user.status === "פעיל" || !user.status) ? "active" : 
                    user.status === "קפוא" ? "frozen" : "inactive"
                  }`}>
                    {user.status || "פעיל"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {/* מניעת פעולות על מנהלי מערכת */}
                    {!user.isAdmin ? (
                      <>
                        {user.status === "קפוא" ? (
                          <button 
                            className="action-btn activate-btn"
                            onClick={() => onUserAction("הפעלה", user.id)}
                            title="הפעלת המשתמש"
                          >
                            <UserCheck className="btn-icon" />
                            הפעלה
                          </button>
                        ) : (
                          <button 
                            className="action-btn freeze-btn"
                            onClick={() => onUserAction("הקפאה", user.id)}
                            title="הקפאת המשתמש"
                          >
                            <UserMinus className="btn-icon" />
                            הקפאה
                          </button>
                        )}
                        <button 
                          className="action-btn remove-btn"
                          onClick={() => {
                            if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${user.fullName || user.email}"? פעולה זו לא הפיכה.`)) {
                              onUserAction("הסרה", user.id);
                            }
                          }}
                          title="מחיקת המשתמש לצמיתות"
                        >
                          <UserX className="btn-icon" />
                          הסרה
                        </button>
                      </>
                    ) : (
                      <div className="admin-protection">
                        <Shield className="protection-icon" />
                        <span className="protection-text">משתמש מוגן</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {prioritizedUsers.length === 0 && searchTerm && (
        <div className="no-results">
          <p>לא נמצאו משתמשים המתאימים לחיפוש "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default UserList;