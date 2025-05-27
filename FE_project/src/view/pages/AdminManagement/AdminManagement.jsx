import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import UserList from "../../components/AdminManagementHelper/UserList/UserList";
import SummaryList from "../../components/AdminManagementHelper/SummaryList/SummaryList";
import UserDetailDialog from "../../components/AdminManagementHelper/UserDetailDialog/UserDetailDialog";
import SummaryDetailDialog from "../../components/AdminManagementHelper/SummaryDetailDialog/SummaryDetailDialog";
import { mockUsers, mockSummaries } from "../../components/AdminManagementHelper/mockData";
import "./AdminManagement.css";

const AdminManagement = () => {
  const navigate = useNavigate();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [summarySearchTerm, setSummarySearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isSummaryDetailOpen, setIsSummaryDetailOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  
  // State לניהול הנתונים המקומיים
  const [users, setUsers] = useState(mockUsers);
  const [summaries, setSummaries] = useState(mockSummaries);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      toast.error("אין לך הרשאת גישה לדף הניהול");
      navigate("/");
    }
  }, [navigate]);

  const filteredUsers = users.filter(user => 
    user.name.includes(userSearchTerm) || user.email.includes(userSearchTerm)
  );

  const filteredSummaries = summaries.filter(summary => 
    summary.title.includes(summarySearchTerm) || summary.author.includes(summarySearchTerm)
  );

  const handleUserAction = (action, userId) => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'הקפאה':
              return { ...user, status: 'קפוא' };
            case 'הפעלה':
              return { ...user, status: 'פעיל' };
            case 'הסרה':
              return null; 
            default:
              return user;
          }
        }
        return user;
      }).filter(Boolean); 
    });
    
    const actionText = {
      'הקפאה': 'הקפאת המשתמש',
      'הפעלה': 'הפעלת המשתמש', 
      'הסרה': 'מחיקת המשתמש'
    };
    
    toast.success(`${actionText[action]} בוצעה בהצלחה!`);
    
    if (isUserDetailOpen) {
      setIsUserDetailOpen(false);
    }
  };

  const handleSummaryAction = (action, summaryId) => {
    setSummaries(prevSummaries => {
      return prevSummaries.map(summary => {
        if (summary.id === summaryId) {
          switch (action) {
            case 'אישור':
              return { ...summary, status: 'מאושר' };
            case 'דחייה':
              return { ...summary, status: 'נדחה' };
            case 'מחיקה':
              return null;
            default:
              return summary;
          }
        }
        return summary;
      }).filter(Boolean); 
    });
    
    const actionText = {
      'אישור': 'אישור הסיכום',
      'דחייה': 'דחיית הסיכום',
      'מחיקה': 'מחיקת הסיכום'
    };
    
    toast.success(`${actionText[action]} בוצעה בהצלחה!`);
    setIsSummaryDetailOpen(false);
    setFeedbackText("");
  };

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const openSummaryDetail = (summary) => {
    setSelectedSummary(summary);
    setIsSummaryDetailOpen(true);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
            <a href="/" className="logo">חזרה לדף הבית</a>
        </div>
      </header>
      <h1 className="admin-title">ניהול מערכת</h1>


      <main className="admin-main">
        <div className="admin-tabs">
          <div className="admin-tabs-list">
            <button 
              className={`admin-tab ${activeTab === "summaries" ? "active" : ""}`}
              onClick={() => setActiveTab("summaries")}
            >
              אישור סיכומים
            </button>
            <button 
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              ניהול משתמשים
            </button>
          </div>

          <div className="admin-tab-content">
            {activeTab === "users" && (
              <div className="admin-panel">
                <UserList 
                  users={filteredUsers}
                  searchTerm={userSearchTerm}
                  onSearchChange={(e) => setUserSearchTerm(e.target.value)}
                  onUserAction={handleUserAction}
                  onUserSelect={openUserDetail}
                />
              </div>
            )}

            {activeTab === "summaries" && (
              <div className="admin-panel">
                <SummaryList 
                  summaries={filteredSummaries}
                  searchTerm={summarySearchTerm}
                  onSearchChange={(e) => setSummarySearchTerm(e.target.value)}
                  onSummaryAction={handleSummaryAction}
                  onSummarySelect={openSummaryDetail}
                />
              </div>
            )}
          </div>
        </div>

        <UserDetailDialog 
          user={selectedUser}
          isOpen={isUserDetailOpen}
          onOpenChange={setIsUserDetailOpen}
        />

        <SummaryDetailDialog 
          summary={selectedSummary}
          isOpen={isSummaryDetailOpen}
          onOpenChange={setIsSummaryDetailOpen}
          feedbackText={feedbackText}
          onFeedbackChange={(e) => setFeedbackText(e.target.value)}
          onSummaryAction={handleSummaryAction}
        />
      </main>
    </div>
  );
};

export default AdminManagement;