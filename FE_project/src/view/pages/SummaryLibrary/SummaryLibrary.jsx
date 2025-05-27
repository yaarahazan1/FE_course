import React, { useState } from "react";
import UploadSummaryDialog from "../../components/SummaryLibraryHelper/UploadSummaryDialog/UploadSummaryDialog";
import "./SummaryLibrary.css";

const demoSummaries = [
  {
    id: 1,
    title: "מבוא לסטטיסטיקה",
    author: "עדי לוי",
    date: "15 בינואר 2025",
    course: "סטטיסטיקה למדעי החברה",
    professor: "פרופ׳ יעקב כהן",
    rating: 5,
    downloads: 142,
    pages: 15,
    isLocked: false,
  },
  {
    id: 2,
    title: "סיכום סמסטר א׳ - פסיכולוגיה חברתית",
    author: "מיכל גולן",
    date: "3 בפברואר 2025",
    course: "פסיכולוגיה חברתית",
    professor: "ד״ר שרה לוינסון",
    rating: 4.5,
    downloads: 89,
    pages: 23,
    isLocked: false,
  },
  {
    id: 3,
    title: "מבנה נתונים ואלגוריתמים - סיכום מבחן",
    author: "אייל דורון",
    date: "20 בדצמבר 2024",
    course: "מבנה נתונים",
    professor: "פרופ׳ דוד ישראלי",
    rating: 4,
    downloads: 210,
    pages: 18,
    isLocked: true,
  },
  {
    id: 4,
    title: "אלגברה לינארית - נוסחאון מורחב",
    author: "רונית כהן",
    date: "5 בינואר 2025",
    course: "אלגברה לינארית",
    professor: "ד״ר משה אברהם",
    rating: 5,
    downloads: 320,
    pages: 8,
    isLocked: true,
  },
];

// רכיב כרטיס סיכום
const SummaryCard = ({ summary, hasAccess, onAccessRequired }) => {
  // פונקציה להצגת כוכבי דירוג
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star-full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star-half">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">★</span>);
    }

    return stars;
  };

  const handleDownload = () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      // בהמשך: לוגיקת הורדה
      alert("מוריד את הסיכום: " + summary.title);
    }
  };

  const handlePreview = () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      // בהמשך: לוגיקת תצוגה מקדימה
      alert("מציג תצוגה מקדימה של: " + summary.title);
    }
  };

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        {summary.isLocked && !hasAccess ? (
          <div className="locked-indicator">
            <span className="lock-icon">🔒</span>
          </div>
        ) : null}
        
        <div className="summary-type">
          {summary.course.includes("פסיכולוגיה") ? "פסיכולוגיה חברתית" : 
           summary.course.includes("סטטיסטיקה") ? "סטטיסטיקה למדעי החברה" :
           summary.course.includes("נתונים") ? "מבנה נתונים" :
           "אלגברה לינארית"}
        </div>
      </div>

      <div className="summary-card-content">
        <h3 className="summary-title">{summary.title}</h3>
        <div className="summary-meta">
          <span className="summary-author">{summary.author}</span>
          <span className="summary-date">{summary.date}</span>
        </div>
        <div className="summary-professor">
          <span className="professor-label">מרצה: </span>
          <span className="professor-name">{summary.professor}</span>
        </div>
        <div className="summary-stats">
          <div className="summary-pages">
            <span className="pages-icon">📄</span>
            <span>{summary.pages} עמודים</span>
          </div>
          <div className="summary-rating">
            <div className="rating-value">{summary.rating}</div>
            <div className="rating-stars">{renderRatingStars(summary.rating)}</div>
          </div>
          <div className="summary-downloads">
            <span className="downloads-count">{summary.downloads}</span>
            <span className="downloads-icon">⬇️</span>
          </div>
        </div>
      </div>

      <div className="summary-card-actions">
        <button 
          className={`download-button ${summary.isLocked && !hasAccess ? "locked-button" : ""}`}
          onClick={handleDownload}
        >
          <span className="download-icon">⬇️</span>
          <span>הורד</span>
        </button>
        <button 
          className={`preview-button ${summary.isLocked && !hasAccess ? "locked-button" : ""}`}
          onClick={handlePreview}
        >
          <span className="preview-icon">👁️</span>
          <span>תצוגה מקדימה</span>
        </button>
      </div>
    </div>
  );
};

// רכיב ראשי של ספריית הסיכומים
const SummaryLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  // פונקציה לסינון וחיפוש סיכומים
  const filteredSummaries = demoSummaries.filter(summary => {
    const matchesSearch = searchQuery === "" || 
      summary.title.includes(searchQuery) || 
      summary.course.includes(searchQuery) || 
      summary.professor.includes(searchQuery);
    
    const matchesCourse = selectedCourse === "" || summary.course === selectedCourse;
    const matchesProfessor = selectedProfessor === "" || summary.professor === selectedProfessor;
    
    return matchesSearch && matchesCourse && matchesProfessor;
  });

  // מיון סיכומים
  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "downloads") {
      return b.downloads - a.downloads;
    }
    return 0;
  });

  const handleUploadSuccess = () => {
    setHasUploaded(true);
    alert("הסיכום הועלה בהצלחה! כעת יש לך גישה מלאה לכל הסיכומים בספרייה.");
    setIsDialogOpen(false);
  };

  const uniqueCourses = [...new Set(demoSummaries.map(summary => summary.course))];
  const uniqueProfessors = [...new Set(demoSummaries.map(summary => summary.professor))];

  return (
    <div className="container">
      <header className="page-title">
        <h1>ספריית סיכומים</h1>
        <p className="subtitle">
          גישה מהירה לחומרי לימוד מסוכמים שנאספו על ידי סטודנטים. חפשו, סננו וגלו סיכומים איכותיים לקורסים שלכם.
        </p>
      </header>

      {/* חיפוש וסינון */}
      <div className="search-filters">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="חפש לפי קורס, מרצה או נושא"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-summery"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="filter-select"
          >
            <option value="">סנן לפי קורס</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <select 
            value={selectedProfessor} 
            onChange={(e) => setSelectedProfessor(e.target.value)}
            className="filter-select"
          >
            <option value="">סנן לפי מרצה</option>
            {uniqueProfessors.map(professor => (
              <option key={professor} value={professor}>{professor}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recent">הכי חדשים</option>
            <option value="rating">דירוג</option>
            <option value="downloads">הורדות</option>
          </select>
        </div>
      </div>

      {/* רשימת הסיכומים */}
      {sortedSummaries.length > 0 ? (
        <div className="summaries-grid">
          {sortedSummaries.map(summary => (
            <SummaryCard 
              key={summary.id} 
              summary={summary} 
              hasAccess={hasUploaded}
              onAccessRequired={() => setIsDialogOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">📄</div>
          <h3 className="no-results-title">לא נמצאו סיכומים</h3>
          <p className="no-results-message">נסו לשנות את מונחי החיפוש או הסינון</p>
          <button 
            className="clear-filter-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedCourse("");
              setSelectedProfessor("");
            }}
          >
            נקה סינון
          </button>
        </div>
      )}

      {/* אזור גישה מוגבלת */}
      {!hasUploaded && (
        <div className="restricted-access">
          <div className="lock-icon-large">🔒</div>
          <h3 className="restricted-title">גישה מוגבלת</h3>
          <p className="restricted-message">
            כדי לקבל גישה מלאה לכל הסיכומים בספרייה, עליך להעלות לפחות סיכום אחד משלך.
          </p>
          <button 
            className="summary-upload-btn"
            onClick={() => setIsDialogOpen(true)}
          >
            <span className="upload-icon">📤</span>
            העלה את הסיכום הראשון שלך
          </button>
        </div>
      )}

      {/* כפתור העלאת סיכום - הצג תמיד גם אחרי העלאה */}
      <div className="fixed-summary-upload-btn">
        <button 
          className="summary-upload-btn-floating"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="upload-icon">📤</span>
          העלה סיכום
        </button>
      </div>

      {/* דיאלוג העלאת סיכום */}
      <UploadSummaryDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default SummaryLibrary;