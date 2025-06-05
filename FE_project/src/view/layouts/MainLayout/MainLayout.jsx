import { Outlet, Link, useLocation } from 'react-router-dom';
import PageHeader from '../PageHeader';
import '../../../styles/styles.css';

const MainLayout = () => {
  const location = useLocation();
  
  // נתיבים שבהם לא נציג Header
  const hideHeaderPaths = ['/', '/Home', '/Login', '/Signup', '/Dashboard', '/HelpSettings', '/AdminManagement'];
  
  return (
    <div>
      {!hideHeaderPaths.includes(location.pathname) && <PageHeader />}

      <main>
        <Outlet />
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