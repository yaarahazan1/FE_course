import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { BarChart, Clock, BookOpen, CheckSquare, Bell, Settings } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="custom-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <Link to="/" className="header-title">סטודנט חכם</Link>
        </div>
        <div className="header-right">
          <Button variant="ghost" className="header-icon-button">
            <Bell />
          </Button>
          <Button variant="ghost" className="header-icon-button">
            <Settings />
          </Button>
          <Link to="/">
            <Button variant="outline" className="logout-button">
              התנתקות
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <BarChart className="sidebar-icon" />
            <h2 className="sidebar-title">לוח מחוונים</h2>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/Dashboard" className="nav-link active">
              <BarChart className="nav-icon" />
              <span>לוח מחוונים</span>
            </Link>
            <Link to="/TimeManagement" className="nav-link">
              <Clock className="nav-icon" />
              <span>ניהול זמן</span>
            </Link>
            <Link to="/SummaryLibrary" className="nav-link">
              <BookOpen className="nav-icon" />
              <span>ספריית סיכומים</span>
            </Link>
            <Link to="/CourseManagement" className="nav-link">
              <CheckSquare className="nav-icon" />
              <span>ניהול קורסים</span>
            </Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="dashboard-main">
          <h1 className="page-title">שלום, סטודנט</h1>
          
          <div className="summary-cards">
            <div className="summary-card">
              <h3 className="card-title">משימות פעילות</h3>
              <p className="card-count">12</p>
              <div className="card-footer">
                <Link to="/CourseManagement" className="card-link">צפה בכל המשימות</Link>
              </div>
            </div>
            
            <div className="summary-card">
              <h3 className="card-title">סיכומים שהועלו</h3>
              <p className="card-count">8</p>
              <div className="card-footer">
                <Link to="/SummaryLibrary" className="card-link">צפה בכל הסיכומים</Link>
              </div>
            </div>
            
            <div className="summary-card">
              <h3 className="card-title">אירועים היום</h3>
              <p className="card-count">3</p>
              <div className="card-footer">
                <Link to="/TimeManagement" className="card-link">צפה בלוח זמנים</Link>
              </div>
            </div>
          </div>
          
          <div className="dashboard-sections">
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">משימות קרובות</h2>
                <Link to="/CourseManagement" className="section-link">צפה בהכל</Link>
              </div>
              
              <div className="task-list">
                <div className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-content">
                    <h4 className="task-title">הגשת עבודה בשיטות מחקר</h4>
                    <p className="task-date">היום, 23:59</p>
                  </div>
                  <div className="task-priority high"></div>
                </div>
                
                <div className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-content">
                    <h4 className="task-title">תרגיל בסטטיסטיקה</h4>
                    <p className="task-date">מחר, 16:00</p>
                  </div>
                  <div className="task-priority medium"></div>
                </div>
                
                <div className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-content">
                    <h4 className="task-title">קריאת מאמר לשיעור פסיכולוגיה</h4>
                    <p className="task-date">יום רביעי, 10:00</p>
                  </div>
                  <div className="task-priority low"></div>
                </div>
              </div>
            </section>
            
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">לוח זמנים להיום</h2>
                <Link to="/TimeManagement" className="section-link">צפה בלוח המלא</Link>
              </div>
              
              <div className="schedule-list">
                <div className="schedule-item">
                  <div className="schedule-time">08:30 - 10:00</div>
                  <div className="schedule-content">
                    <h4 className="schedule-title">הרצאה: שיטות מחקר</h4>
                    <p className="schedule-location">בניין 72, כיתה 204</p>
                  </div>
                </div>
                
                <div className="schedule-item">
                  <div className="schedule-time">10:15 - 11:45</div>
                  <div className="schedule-content">
                    <h4 className="schedule-title">תרגול: סטטיסטיקה</h4>
                    <p className="schedule-location">בניין 90, כיתה 101</p>
                  </div>
                </div>
                
                <div className="schedule-item">
                  <div className="schedule-time">13:00 - 14:30</div>
                  <div className="schedule-content">
                    <h4 className="schedule-title">הרצאה: פסיכולוגיה חברתית</h4>
                    <p className="schedule-location">בניין 72, כיתה 115</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">
              עזרה והגדרות
            </Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">
              תנאי שימוש
            </div>
            <span className="footer-separator">|</span>
            <div className="footer-item">
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;