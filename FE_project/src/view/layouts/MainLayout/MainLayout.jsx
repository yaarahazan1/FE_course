import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import PageHeader from '../PageHeader'; // חשוב לשים לב למסלול
import './MainLayout.css'; // אם יש צורך לעצב פה

const MainLayout = () => {
  const location = useLocation(); // מביא את המיקום הנוכחי

  return (
    
    <div>
      {/* Header יופיע רק אם זה לא HomePage */}
      {location.pathname !== '/' && <PageHeader />}

      <main>
        <Outlet /> {/* כאן יוצגו כל התוכן של העמודים */}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">עזרה והגדרות</Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">תנאי שימוש</div>
            <span className="footer-separator">|</span>
            <div className="footer-item">מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
