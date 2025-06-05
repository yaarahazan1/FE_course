import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config'; // עדכן את הנתיב לפי המבנה שלך
import './AdminBadge.css';

const AdminBadge = () => {
  const navigate = useNavigate();
  const [isRealAdmin, setIsRealAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);

  // פונקציה לבדיקת הרשאות אדמין בשרת
  const checkAdminPermissions = async (userId) => {
    try {
      const userQuery = query(
        collection(db, "users"), 
        where("uid", "==", userId),
        where("isAdmin", "==", true)
      );
      const querySnapshot = await getDocs(userQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking admin permissions:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setIsCheckingPermissions(true);
      setCurrentUser(user);
      
      if (user) {
        // בדיקת הרשאות אדמין אמיתיות בשרת
        const adminStatus = await checkAdminPermissions(user.uid);
        setIsRealAdmin(adminStatus);
      } else {
        setIsRealAdmin(false);
      }
      
      setIsCheckingPermissions(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleNavigateToAdmin = () => {
    if (isRealAdmin) {
      navigate('/AdminManagement');
      setShowPopover(false);
    }
  };

  if (isCheckingPermissions) {
    return null;
  }

  if (!currentUser || !isRealAdmin) {
    return null;
  }

  return (
    <div className="admin-badge-wrapper">
      <button 
        className="admin-button" 
        onClick={() => setShowPopover(!showPopover)}
        title="אפשרויות מנהל"
      >
        🛡️
      </button>

      {showPopover && (
        <div className="admin-popover">
          <div className="admin-popover-content">
            <h3>אפשרויות מנהל</h3>
            <p>שלום {currentUser.displayName || currentUser.email}</p>
            <button onClick={handleNavigateToAdmin}>
              מעבר לממשק ניהול
            </button>
            <button onClick={() => setShowPopover(false)}>
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBadge;