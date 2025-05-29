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
import { mockUsers } from "../../components/AdminManagementHelper/mockData";
import "./AdminManagement.css";

const AdminManagement = () => {
  const CLOUDINARY_CLOUD_NAME = "doxht9fpl";
  const CLOUDINARY_API_KEY = "479472249636565";
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
  
  const [users, setUsers] = useState([]);
  const [summaries, setSummaries] = useState([]);

  // טעינת Cloudinary Widget Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      setUsers(mockUsers);
    }
  };

  // טעינת סיכומים באמצעות Cloudinary Widget (גישה למטא-דאטה בלבד)
  const loadSummariesFromCloudinary = async () => {
    try {
      // במקום לגשת ל-API ישירות, נשתמש בגישה אלטרנטיבית
      // אפשרות 1: שמירת מטא-דאטה ב-Firebase במקביל
      // אפשרות 2: שימוש ב-Cloudinary Upload Widget callbacks
      
      // לעת עתה, נציג נתונים סטטיים כדוגמה
      const dummySummaries = [
        {
          id: "summaries/example1",
          title: "סיכום מתמטיקה",
          author: "דוגמה",
          course: "חשבון אינפיניטסימלי",
          professor: "פרופ' כהן",
          date: new Date().toLocaleDateString('he-IL'),
          content: "זהו סיכום לדוגמה",
          status: "ממתין לאישור",
          downloads: 0,
          rating: 0,
          pages: 5,
          url: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/summaries/example1.pdf`,
          format: "pdf",
          bytes: 1024000,
          createdAt: new Date().toISOString(),
          adminFeedback: null
        }
      ];
      
      setSummaries(dummySummaries);
      
      // הצעה: שמור מטא-דאטה ב-Firebase כדי לעקוף את בעיית ה-CORS
      console.log("להשלמת הפתרון, מומלץ לשמור מטא-דאטה של הסיכומים ב-Firebase");
      
    } catch (error) {
      console.error("שגיאה בטעינת סיכומים:", error);
      setSummaries([]);
    }
  };

  // useEffect לטעינת כל הנתונים
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      
      const userUnsubscribe = await loadUsers();
      await loadSummariesFromCloudinary();
      
      setLoading(false);

      return () => {
        if (typeof userUnsubscribe === 'function') {
          userUnsubscribe();
        }
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
          await deleteDoc(userRef);
          toast.success('מחיקת המשתמש בוצעה בהצלחה!');
          if (isUserDetailOpen) {
            setIsUserDetailOpen(false);
          }
          return;
        default:
          return;
      }

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
    }
  };

  // טיפול בפעולות על סיכומים (עדכון ב-Firebase במקום Cloudinary API)
  const handleSummaryAction = async (action, summaryId) => {
    try {
      switch (action) {
        case 'אישור':
          // עדכון מקומי (בפתרון מלא זה יהיה ב-Firebase)
          setSummaries(prevSummaries => 
            prevSummaries.map(summary => 
              summary.id === summaryId 
                ? { ...summary, status: 'מאושר', adminFeedback: feedbackText }
                : summary
            )
          );
          toast.success('אישור הסיכום בוצעה בהצלחה!');
          break;

        case 'דחייה':
          setSummaries(prevSummaries => 
            prevSummaries.map(summary => 
              summary.id === summaryId 
                ? { ...summary, status: 'נדחה', adminFeedback: feedbackText }
                : summary
            )
          );
          toast.success('דחיית הסיכום בוצעה בהצלחה!');
          break;

        case 'מחיקה':
          // מחיקה מקומית (בפתרון מלא זה יכלול מחיקה מ-Cloudinary דרך שרת)
          setSummaries(prevSummaries => 
            prevSummaries.filter(summary => summary.id !== summaryId)
          );
          toast.success('מחיקת הסיכום בוצעה בהצלחה!');
          break;

        default:
          return;
      }

      setIsSummaryDetailOpen(false);
      setFeedbackText("");
    } catch (error) {
      console.error("שגיאה בעדכון סיכום:", error);
      toast.error("אירעה שגיאה בעדכון הסיכום");
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
                <div className="admin-panel-header">
                </div>
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