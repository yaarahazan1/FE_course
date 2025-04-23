import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminBadge.css';

const AdminBadge = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const toggleAdminStatus = () => {
    const newStatus = !isAdmin;
    localStorage.setItem('isAdmin', String(newStatus));
    setIsAdmin(newStatus);
    setShowPopover(false);
  };

  return (
    <div className="admin-badge-wrapper">
      <button className="admin-button" onClick={() => setShowPopover(!showPopover)}>
        🛡️
      </button>

      {showPopover && (
        <div className="admin-popover">
          {isAdmin ? (
            <div className="admin-popover-content">
              <h3>אפשרויות מנהל</h3>
              <button onClick={() => navigate('/AdminManagement')}>מעבר לממשק ניהול</button>
              <button onClick={toggleAdminStatus}>ביטול מצב מנהל</button>
            </div>
          ) : (
            <div className="admin-popover-content">
              <h3>הפעלת מצב מנהל</h3>
              <p>לחץ כאן כדי להפעיל את מצב המנהל לצורך הדגמה</p>
              <button onClick={toggleAdminStatus}>הפעל מצב מנהל</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBadge;
