import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  collection, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from "firebase/firestore";
import { db } from "../../../firebase/config";
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
  const [loading, setLoading] = useState(true);
  
  // State לנתונים מFirebase
  const [users, setUsers] = useState([]);
  const [summaries, setSummaries] = useState([]);

  // בדיקת הרשאות admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      toast.error("אין לך הרשאת גישה לדף הניהול");
      navigate("/");
    }
  }, [navigate]);

  // טעינת משתמשים מFirebase
  const loadUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
      });

      return unsubscribe;
    } catch (error) {
      console.error("שגיאה בטעינת משתמשים:", error);
      // במקרה של שגיאה, נשתמש בנתונים דמה
      setUsers(mockUsers);
    }
  };

  // טעינת סיכומים מFirebase
  const loadSummaries = async () => {
    try {
      const q = query(
        collection(db, "summaries"),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const summariesData = [];
        querySnapshot.forEach((doc) => {
          summariesData.push({ id: doc.id, ...doc.data() });
        });
        setSummaries(summariesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error("שגיאה בטעינת סיכומים:", error);
      // במקרה של שגיאה, נשתמש בנתונים דמה
      setSummaries(mockSummaries);
    }
  };

  // useEffect לטעינת כל הנתונים
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const unsubscribes = await Promise.all([
        loadUsers(),
        loadSummaries()
      ]);
      setLoading(false);

      // ניקוי listeners כשהקומפוננטה נמחקת
      return () => {
        unsubscribes.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    };

    loadAllData();
  }, []);

  // סינון משתמשים
  const filteredUsers = users.filter(user => 
    user.name?.includes(userSearchTerm) || user.email?.includes(userSearchTerm)
  );

  // סינון סיכומים
  const filteredSummaries = summaries.filter(summary => 
    summary.title?.includes(summarySearchTerm) || summary.author?.includes(summarySearchTerm)
  );

  // טיפול בפעולות על משתמשים
  const handleUserAction = async (action, userId) => {
    try {
      const userRef = doc(db, "users", userId);
      let updateData = { updatedAt: new Date() };

      switch (action) {
        case 'הקפאה':
          updateData.status = 'קפוא';
          break;
        case 'הפעלה':
          updateData.status = 'פעיל';
          break;
        case 'הסרה':
          // מחיקה מ-Firebase
          await deleteDoc(userRef);
          toast.success('מחיקת המשתמש בוצעה בהצלחה!');
          if (isUserDetailOpen) {
            setIsUserDetailOpen(false);
          }
          return;
        default:
          return;
      }

      // עדכון ב-Firebase
      await updateDoc(userRef, updateData);
      
      const actionText = {
        'הקפאה': 'הקפאת המשתמש',
        'הפעלה': 'הפעלת המשתמש'
      };
      
      toast.success(`${actionText[action]} בוצעה בהצלחה!`);
      
      if (isUserDetailOpen) {
        setIsUserDetailOpen(false);
      }

    } catch (error) {
      console.error("שגיאה בעדכון משתמש:", error);
      toast.error("אירעה שגיאה בעדכון המשתמש");
      
      // במקרה של שגיאה, נעדכן לוקלית
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
    }
  };

  // טיפול בפעולות על סיכומים
  const handleSummaryAction = async (action, summaryId) => {
    try {
      const summaryRef = doc(db, "summaries", summaryId);
      let updateData = { 
        updatedAt: new Date(),
        adminFeedback: feedbackText || null
      };

      switch (action) {
        case 'אישור':
          updateData.status = 'מאושר';
          break;
        case 'דחייה':
          updateData.status = 'נדחה';
          break;
        case 'מחיקה':
          // מחיקה מ-Firebase
          await deleteDoc(summaryRef);
          toast.success('מחיקת הסיכום בוצעה בהצלחה!');
          setIsSummaryDetailOpen(false);
          setFeedbackText("");
          return;
        default:
          return;
      }

      // עדכון ב-Firebase
      await updateDoc(summaryRef, updateData);
      
      const actionText = {
        'אישור': 'אישור הסיכום',
        'דחייה': 'דחיית הסיכום'
      };
      
      toast.success(`${actionText[action]} בוצעה בהצלחה!`);
      setIsSummaryDetailOpen(false);
      setFeedbackText("");

    } catch (error) {
      console.error("שגיאה בעדכון סיכום:", error);
      toast.error("אירעה שגיאה בעדכון הסיכום");
      
      // במקרה של שגיאה, נעדכן לוקלית
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
    }
  };

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const openSummaryDetail = (summary) => {
    setSelectedSummary(summary);
    setIsSummaryDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-header-content">
              <a href="/" className="logo">חזרה לדף הבית</a>
          </div>
        </header>
        <div className="loading-spinner">
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

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
              אישור סיכומים ({summaries.length})
            </button>
            <button 
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              ניהול משתמשים ({users.length})
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