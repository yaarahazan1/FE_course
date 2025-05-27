import React from "react";
import { Search, UserX, UserMinus, UserCheck } from "lucide-react";
import "./UserList.css";

const UserList = ({
  users,
  searchTerm,
  onSearchChange,
  onUserAction,
  onUserSelect,
}) => {
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

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>אימייל</th>
              <th>תחום לימוד</th>
              <th>מוסד לימודים</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="table-row">
                <td 
                  className="user-name" 
                  onClick={() => onUserSelect(user)}
                >
                  {user.name}
                </td>
                <td onClick={() => onUserSelect(user)}>{user.email}</td>
                <td onClick={() => onUserSelect(user)}>{user.studyField}</td>
                <td onClick={() => onUserSelect(user)}>{user.institution}</td>
                <td onClick={() => onUserSelect(user)}>
                  <span className={`status-badge ${
                    user.status === "פעיל" ? "active" : 
                    user.status === "קפוא" ? "frozen" : "inactive"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {user.status === "קפוא" ? (
                      <button 
                        className="action-btn activate-btn"
                        onClick={() => onUserAction("הפעלה", user.id)}
                      >
                        <UserCheck className="btn-icon" />
                        הפעלה
                      </button>
                    ) : (
                      <button 
                        className="action-btn freeze-btn"
                        onClick={() => onUserAction("הקפאה", user.id)}
                      >
                        <UserMinus className="btn-icon" />
                        הקפאה
                      </button>
                    )}
                    <button 
                      className="action-btn remove-btn"
                      onClick={() => onUserAction("הסרה", user.id)}
                    >
                      <UserX className="btn-icon" />
                      הסרה
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

export default UserList;