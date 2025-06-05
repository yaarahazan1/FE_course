import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from './view/pages/HomePage/HomePage';

const ProtectedRoute = ({ children, requireAuth = true, showHomeForAuth = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // מסך טעינה בזמן בדיקת סטטוס ההתחברות
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        direction: 'rtl'
      }}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            טוען...
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // אם נדרש אימות והמשתמש לא מחובר
  if (requireAuth && !currentUser) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // אם לא נדרש אימות והמשתמש כן מחובר (למשל דפי כניסה/הרשמה)
  if (!requireAuth && currentUser && !showHomeForAuth) {
    return <Navigate to="/Home" replace />;
  }

  // מקרה מיוחד: עמוד ראשי - אם המשתמש מחובר מציג HomePage, אחרת מציג את הילדים (LandingPage)
  if (showHomeForAuth && currentUser) {
    return <HomePage />;
  }

  return children;
};

export default ProtectedRoute;