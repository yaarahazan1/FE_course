import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Calendar, BookOpen, CheckSquare, PenLine, Users, BarChart } from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="custom-container">
      {/* Header/Navbar */}
      <header className="custom-header">
        <div className="header-left">
          <span className="header-title">סטודנט חכם</span>
        </div>
        <div className="header-right">
          <Link to="/Dashboard">
            <Button variant="outline" className="dashboard-button">
              <BarChart className="icon-chart" />
              לוח מחוונים
            </Button>
          </Link>
          <Link to="/Login">
            <Button variant="outline" className="dashboard-button">
              כניסה
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">סטודנט חכם</h1>
        <p className="hero-description">
          נהל את הלימודים שלך בצורה חכמה - גישה מהירה לסיכומים, משימות ולוח זמנים מותאם אישית
        </p>
        <p className="hero-description">
          המערכת עוזרת לך לארגן את הלימודים שלך, לשתף סיכומים, לעקוב אחרי משימות והגשות לוח זמנים מותאם לסיכומים והחומרים האישיים שלך.
        </p>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-content">
              <Calendar className="feature-icon" />
              <h3 className="feature-title">ניהול לוח זמנים</h3>
              <p className="feature-description">
                סדר את לוח הזמנים שלך עם כל מה שמרכיב את היום שלך וצור את לוח הזמנים החכם
              </p>
              <div className="feature-links-row">
                <Link to="/TimeManagement">
                  <Button variant="outline" size="sm" className="feature-button">
                    למעבר
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-content">
              <BookOpen className="feature-icon" />
              <h3 className="feature-title">ספריית סיכומים</h3>
              <p className="feature-description">
                גישה מהירה לספריית הסיכומים שלך, למידה משותפת וסיכומים מאורגנים
              </p>
              <div className="feature-links-row">
                <Link to="/SummaryLibrary">
                  <Button variant="outline" size="sm" className="feature-button">
                    למעבר
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-content">
              <CheckSquare className="feature-icon" />
              <h3 className="feature-title">ניהול משימות ופרויקטים</h3>
              <p className="feature-description">
                סכם אחרי משימות, הבנת מה יש לסיים ופרויקטים עם צ׳אט קבוצתי והתראות
              </p>
              <div className="feature-links-row">
                <Link to="/CourseManagement">
                  <Button variant="outline" size="sm" className="feature-button">
                    למעבר
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-content">
              <PenLine className="feature-icon" />
              <h3 className="feature-title">כלי לכתיבה אקדמית</h3>
              <p className="feature-description">
                כתיבת עבודות וסיכומים עם ציטוטים אקדמיים מובנים
              </p>
              <div className="feature-links-row">
                <Link to="/AcademicWriting">
                  <Button variant="outline" size="sm" className="feature-button">
                    למעבר
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-content">
              <Users className="feature-icon" />
              <h3 className="feature-title">רשת חברתית לסטודנטים</h3>
              <p className="feature-description">
                התחברי לפי קורסים ותחומי לימודים וקבלי סיכומים
              </p>
              <div className="feature-links-row">
                <Link to="/SocialNetwork">
                  <Button variant="outline" size="sm" className="feature-button">
                    למעבר
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/help-settings" className="footer-link">
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

export default HomePage;