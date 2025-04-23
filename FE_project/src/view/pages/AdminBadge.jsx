import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={{top: '1rem', left: '1rem' }}>
      <button onClick={() => setShowPopover(!showPopover)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
        🛡️
      </button>

      {showPopover && (
        <div style={{ width: '250px', padding: '1rem', border: '1px solid #ccc', background: '#fff', position: 'absolute', top: '2.5rem', right: 0, direction: 'rtl' }}>
          {isAdmin ? (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>אפשרויות מנהל</h3>
              <button onClick={() => navigate('/AdminManagement')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}>
                מעבר לממשק ניהול
              </button>
              <button onClick={toggleAdminStatus} style={{ width: '100%', padding: '0.5rem' }}>
                ביטול מצב מנהל
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>הפעלת מצב מנהל</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                לחץ כאן כדי להפעיל את מצב המנהל לצורך הדגמה
              </p>
              <button onClick={toggleAdminStatus} style={{ width: '100%', padding: '0.5rem' }}>
                הפעל מצב מנהל
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBadge;
