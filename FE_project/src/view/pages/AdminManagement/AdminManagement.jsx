import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../firebase/config"
import UserList from "../../components/AdminManagementHelper/UserList/UserList";
import SummaryList from "../../components/AdminManagementHelper/SummaryList/SummaryList";
import UserDetailDialog from "../../components/AdminManagementHelper/UserDetailDialog/UserDetailDialog";
import SummaryDetailDialog from "../../components/AdminManagementHelper/SummaryDetailDialog/SummaryDetailDialog";
import "./AdminManagement.css";

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloud_name: 'doxht9fpl',
  upload_preset: 'summaries_preset',
  api_key: '479472249636565',
  api_secret: 'HDKDKxj2LKE-tPHgd6VeRPFGJaU'
};

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
  
  // State לניהול הנתונים
  const [users, setUsers] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      toast.error("אין לך הרשאת גישה לדף הניהול");
      navigate("/");
    }
  }, [navigate]);

  // טעינת משתמשים מ-Firebase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const usersCollection = collection(db, "users");
        const usersQuery = query(usersCollection, orderBy("createdAt", "desc"));
        
        // שימוש ב-onSnapshot לעדכון בזמן אמת
        const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
          const usersData = [];
          querySnapshot.forEach((doc) => {
            usersData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setUsers(usersData);
          setIsLoadingUsers(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("שגיאה בטעינת המשתמשים");
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // טעינת סיכומים מ-Firebase (במקום localStorage)
  useEffect(() => {
    const loadSummaries = () => {
      try {
        setIsLoadingSummaries(true);
        
        const summariesCollection = collection(db, "summaries");
        const summariesQuery = query(summariesCollection, orderBy("uploadedAt", "desc"));
        
        const unsubscribe = onSnapshot(summariesQuery, (querySnapshot) => {
          const summariesData = [];
          querySnapshot.forEach((doc) => {
            summariesData.push({
              firebaseId: doc.id, // ID האמיתי של המסמך ב-Firebase
              ...doc.data(),
              status: doc.data().status || 'ממתין לאישור'
            });
          });
          setSummaries(summariesData);
          setIsLoadingSummaries(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error loading summaries:", error);
        toast.error("שגיאה בטעינת הסיכומים");
        setIsLoadingSummaries(false);
      }
    };

    loadSummaries();
  }, []);

  // פונקציה למחיקת קובץ מ-Cloudinary
  const deleteFromCloudinary = async (publicId) => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.api_secret}`;
      
      const encoder = new TextEncoder();
      const data = encoder.encode(stringToSign);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('api_key', CLOUDINARY_CONFIG.api_key);
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/raw/destroy`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        console.error('HTTP Error:', response.status, response.statusText);
        return false;
      }

      const result = await response.json();
      return result.result === 'ok' || result.result === 'not found';
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return false;
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.includes(userSearchTerm) || user.email?.includes(userSearchTerm)
  );

  const filteredSummaries = summaries.filter(summary => 
    summary.title?.includes(summarySearchTerm) || summary.author?.includes(summarySearchTerm)
  );

  const handleUserAction = async (action, userId) => {
    try {
      const userRef = doc(db, "users", userId);
      let updateData = {};

      switch (action) {
        case 'הקפאה':
          updateData = { status: 'קפוא', updatedAt: serverTimestamp() };
          break;
        case 'הפעלה':
          updateData = { status: 'פעיל', updatedAt: serverTimestamp() };
          break;
        case 'הסרה':
          await deleteDoc(userRef);
          toast.success("מחיקת המשתמש בוצעה בהצלחה!");
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
      console.error("Error updating user:", error);
      toast.error("שגיאה בעדכון המשתמש");
    }
  };

  const handleSummaryAction = async (action, summaryId) => {
    try {
      // מצא את הסיכום לפי ID (זה יכול להיות firebaseId או id)
      const currentSummary = summaries.find(s => s.id === summaryId || s.firebaseId === summaryId);
      
      if (!currentSummary) {
        toast.error("סיכום לא נמצא");
        return;
      }

      // השתמש ב-firebaseId לעדכון הדוקומנט
      const firebaseDocId = currentSummary.firebaseId || summaryId;
      const summaryRef = doc(db, "summaries", firebaseDocId);

      switch (action) {
        case 'אישור':
          await updateDoc(summaryRef, {
            status: 'מאושר',
            approvedAt: new Date().toISOString(),
            feedback: feedbackText
          });
          break;
          
        case 'דחייה':
          await updateDoc(summaryRef, {
            status: 'נדחה',
            rejectedAt: new Date().toISOString(),
            feedback: feedbackText
          });
          break;
          
        case 'מחיקה':
          // מחיקה מ-Cloudinary תחילה
          if (currentSummary.public_id) {
            const cloudinaryDeleted = await deleteFromCloudinary(currentSummary.public_id);
            if (!cloudinaryDeleted) {
              toast.error("שגיאה במחיקת הקובץ מהשרת");
              return;
            }
          }
          
          // מחיקה מ-Firebase
          await deleteDoc(summaryRef);
          break;
          
        default:
          return;
      }
      
      const actionText = {
        'אישור': 'אישור הסיכום',
        'דחייה': 'דחיית הסיכום',
        'מחיקה': 'מחיקת הסיכום'
      };
      
      toast.success(`${actionText[action]} בוצעה בהצלחה!`);
      setIsSummaryDetailOpen(false);
      setFeedbackText("");
      
    } catch (error) {
      console.error("Error updating summary:", error);
      toast.error("שגיאה בעדכון הסיכום");
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

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
            <a href="/" className="logo">חזרה לדף הבית</a>
        </div>
      </header>
      <h1 className="admin-title">ניהול מערכת</h1>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="stat-card">
            <h3>סה"כ משתמשים</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>סה"כ סיכומים</h3>
            <p>{summaries.length}</p>
          </div>
          <div className="stat-card">
            <h3>ממתינים לאישור</h3>
            <p>{summaries.filter(s => s.status === 'ממתין לאישור').length}</p>
          </div>
          <div className="stat-card">
            <h3>סיכומים שנדחו</h3>
            <p>{summaries.filter(s => s.status === 'נדחה').length}</p>
          </div>
        </div>
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
                {isLoadingUsers ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    טוען משתמשים...
                  </div>
                ) : (
                  <UserList 
                    users={filteredUsers}
                    searchTerm={userSearchTerm}
                    onSearchChange={(e) => setUserSearchTerm(e.target.value)}
                    onUserAction={handleUserAction}
                    onUserSelect={openUserDetail}
                  />
                )}
              </div>
            )}

            {activeTab === "summaries" && (
              <div className="admin-panel">
                {isLoadingSummaries ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    טוען סיכומים...
                  </div>
                ) : (
                  <SummaryList 
                    summaries={filteredSummaries}
                    searchTerm={summarySearchTerm}
                    onSearchChange={(e) => setSummarySearchTerm(e.target.value)}
                    onSummaryAction={handleSummaryAction}
                    onSummarySelect={openSummaryDetail}
                  />
                )}
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