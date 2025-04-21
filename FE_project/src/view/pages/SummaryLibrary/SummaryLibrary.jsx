import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  BookOpen, 
  BarChart, 
  Clock, 
  CheckSquare, 
  Search, 
  Filter, 
  FilePlus, 
  BookmarkPlus, 
  Star, 
  Share2 
} from "lucide-react";
import "./SummaryLibrary.css";

const SummaryLibrary = () => {
  return (
    <div className="custom-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <Link to="/" className="header-title">סטודנט חכם</Link>
        </div>
      </header>
      
      {/* Library Content */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <BookOpen className="sidebar-icon" />
            <h2 className="sidebar-title">ספריית סיכומים</h2>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/Dashboard" className="nav-link">
              <BarChart className="nav-icon" />
              <span>לוח מחוונים</span>
            </Link>
            <Link to="/TimeManagement" className="nav-link">
              <Clock className="nav-icon" />
              <span>ניהול זמן</span>
            </Link>
            <Link to="/SummaryLibrary" className="nav-link active">
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
          <div className="page-header">
            <h1 className="page-title">ספריית סיכומים</h1>
            <Button className="add-button">
              <FilePlus className="button-icon" />
              הוסף סיכום חדש
            </Button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="חפש סיכומים..."
                className="search-input"
              />
            </div>
            <Button variant="outline" className="filter-button">
              <Filter className="button-icon" />
              מיין לפי
            </Button>
          </div>
          
          {/* Summary Categories */}
          <div className="categories-container">
            <Button variant="ghost" className="category-button active">הכל</Button>
            <Button variant="ghost" className="category-button">הסיכומים שלי</Button>
            <Button variant="ghost" className="category-button">מועדפים</Button>
            <Button variant="ghost" className="category-button">שיתופים</Button>
          </div>
          
          {/* Summary Cards */}
          <div className="summary-grid">
            {/* Summary Card 1 */}
            <div className="summary-item">
              <div className="summary-header">
                <h3 className="summary-title">מבוא לפסיכולוגיה - סיכום שיעור 5</h3>
                <div className="summary-subject">פסיכולוגיה</div>
              </div>
              <p className="summary-description">
                סיכום השיעור על התפתחות קוגניטיבית לפי פיאז'ה, מושגי יסוד וארבעת השלבים העיקריים של התפתחות חשיבה.
              </p>
              <div className="summary-meta">
                <div className="summary-date">עודכן: 15 באפריל, 2025</div>
                <div className="summary-actions">
                  <Button variant="ghost" className="action-button">
                    <BookmarkPlus className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Star className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Share2 className="action-icon" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Summary Card 2 */}
            <div className="summary-item">
              <div className="summary-header">
                <h3 className="summary-title">סטטיסטיקה - סיכום פרק 3</h3>
                <div className="summary-subject">סטטיסטיקה</div>
              </div>
              <p className="summary-description">
                סיכום הפרק על התפלגויות שונות, הנחות יסוד ומבחני מובהקות סטטיסטית. כולל דוגמאות מפורטות וחישובים.
              </p>
              <div className="summary-meta">
                <div className="summary-date">עודכן: 10 באפריל, 2025</div>
                <div className="summary-actions">
                  <Button variant="ghost" className="action-button">
                    <BookmarkPlus className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Star className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Share2 className="action-icon" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Summary Card 3 */}
            <div className="summary-item">
              <div className="summary-header">
                <h3 className="summary-title">שיטות מחקר - סיכום מאמר</h3>
                <div className="summary-subject">שיטות מחקר</div>
              </div>
              <p className="summary-description">
                סיכום מאמר "השפעת הרשתות החברתיות על התנהגות חברתית" - מתודולוגיה, ממצאים עיקריים ומסקנות.
              </p>
              <div className="summary-meta">
                <div className="summary-date">עודכן: 5 באפריל, 2025</div>
                <div className="summary-actions">
                  <Button variant="ghost" className="action-button">
                    <BookmarkPlus className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Star className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Share2 className="action-icon" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Summary Card 4 */}
            <div className="summary-item">
              <div className="summary-header">
                <h3 className="summary-title">פסיכולוגיה חברתית - סיכום פרק 2</h3>
                <div className="summary-subject">פסיכולוגיה</div>
              </div>
              <p className="summary-description">
                סיכום הפרק על תהליכי השפעה חברתית, קונפורמיות, ציות לסמכות ודה-אינדיבידואציה.
              </p>
              <div className="summary-meta">
                <div className="summary-date">עודכן: 1 באפריל, 2025</div>
                <div className="summary-actions">
                  <Button variant="ghost" className="action-button">
                    <BookmarkPlus className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Star className="action-icon" />
                  </Button>
                  <Button variant="ghost" className="action-button">
                    <Share2 className="action-icon" />
                  </Button>
                </div>
              </div>
            </div>
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

export default SummaryLibrary;