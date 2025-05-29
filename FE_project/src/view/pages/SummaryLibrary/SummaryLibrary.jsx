import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  increment
} from "firebase/firestore";
import { auth, db } from "../../../firebase/config"; 
import { onAuthStateChanged } from "firebase/auth";
import UploadSummaryDialog from "../../components/SummaryLibraryHelper/UploadSummaryDialog/UploadSummaryDialog";
import "./SummaryLibrary.css";

const SummaryCard = ({ summary, hasAccess, onAccessRequired, onDownload }) => {
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

  const handleDownload = async () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      await onDownload(summary.id);
      alert("מוריד את הסיכום: " + summary.title);
    }
  };

  const handlePreview = () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      alert("מציג תצוגה מקדימה של: " + summary.title);
    }
  };

  // תיקון הצגת כמות העמודים
  const formatPages = (pages) => {
    if (!pages || pages === 0) {
      return "לא צוין";
    }
    if (typeof pages === 'string') {
      const numPages = parseInt(pages);
      if (isNaN(numPages)) {
        return "לא צוין";
      }
      return `${numPages} עמודים`;
    }
    if (typeof pages === 'number') {
      return `${pages} עמודים`;
    }
    return "לא צוין";
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
          {summary.course}
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
            <span>{formatPages(summary.pages)}</span>
          </div>
          <div className="summary-rating">
            <div className="rating-value">{summary.rating || 0}</div>
            <div className="rating-stars">{renderRatingStars(summary.rating || 0)}</div>
          </div>
          <div className="summary-downloads">
            <span className="downloads-count">{summary.downloads || 0}</span>
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

const SummaryLibrary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadSummaries();
    checkUserUploadStatus();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      console.log("Current user:", user);
    });

    return () => unsubscribe();
  }, []);

  const loadSummaries = async () => {
    try {
      setLoading(true);
      const summariesCollection = collection(db, "summaries");
      const summariesSnapshot = await getDocs(summariesCollection);
      const summariesList = summariesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // וידוא שכל הערכים מוגדרים כראוי
          pages: data.pages || 0,
          downloads: data.downloads || 0,
          rating: data.rating || 0,
          author: data.author || "לא צוין",
          professor: data.professor || "לא צוין",
          course: data.course || "לא צוין"
        };
      });
      setSummaries(summariesList);
    } catch (error) {
      console.error("שגיאה בטעינת הסיכומים:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserUploadStatus = async () => {
    const userHasUploaded = localStorage.getItem("userHasUploaded") === "true";
    setHasUploaded(userHasUploaded);
  };

  const handleDownload = async (summaryId) => {
    try {
      const summaryDoc = doc(db, "summaries", summaryId);
      await updateDoc(summaryDoc, {
        downloads: increment(1)
      });
      
      setSummaries(prev => prev.map(summary => 
        summary.id === summaryId 
          ? { ...summary, downloads: summary.downloads + 1 }
          : summary
      ));
    } catch (error) {
      console.error("שגיאה בעדכון ההורדות:", error);
    }
  };

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = searchQuery === "" || 
      summary.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      summary.course.toLowerCase().includes(searchQuery.toLowerCase()) || 
      summary.professor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = selectedCourse === "" || summary.course === selectedCourse;
    const matchesProfessor = selectedProfessor === "" || summary.professor === selectedProfessor;
    
    return matchesSearch && matchesCourse && matchesProfessor;
  });

  const sortedSummaries = [...filteredSummaries].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt);
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "downloads") {
      return b.downloads - a.downloads;
    }
    return 0;
  });

  const handleUploadSuccess = async (summaryData) => {
    try {
      // וידוא שכל הנתונים מוגדרים כראוי לפני השמירה
      const summaryToSave = {
        ...summaryData,
        createdAt: new Date(),
        downloads: 0,
        rating: summaryData.rating || 5,
        isLocked: false,
        pages: summaryData.pages ? parseInt(summaryData.pages) : 0, // וידוא שהעמודים הם מספר
        author: summaryData.author || "לא צוין",
        professor: summaryData.professor || "לא צוין",
        course: summaryData.course || "לא צוין"
      };

      const docRef = await addDoc(collection(db, "summaries"), summaryToSave);

      const newSummary = {
        id: docRef.id,
        ...summaryToSave
      };

      setSummaries(prev => [newSummary, ...prev]);
      setHasUploaded(true);
      localStorage.setItem("userHasUploaded", "true");
      alert("הסיכום הועלה בהצלחה! כעת יש לך גישה מלאה לכל הסיכומים בספרייה.");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("שגיאה בהעלאת הסיכום:", error);
      alert("אירעה שגיאה בהעלאת הסיכום. אנא נסה שוב.");
    }
  };

  const uniqueCourses = [...new Set(summaries.map(summary => summary.course))];
  const uniqueProfessors = [...new Set(summaries.map(summary => summary.professor))];

  if (loading || authLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>טוען סיכומים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-title">
        <h1>ספריית סיכומים</h1>
        <p className="subtitle">
          גישה מהירה לחומרי לימוד מסוכמים שנאספו על ידי סטודנטים. חפשו, סננו וגלו סיכומים איכותיים לקורסים שלכם.
        </p>
        {currentUser && (
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            משתמש מחובר: {currentUser.displayName || currentUser.email || "משתמש אנונימי"}
          </div>
        )}
      </header>

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

      {sortedSummaries.length > 0 ? (
        <div className="summaries-grid">
          {sortedSummaries.map(summary => (
            <SummaryCard 
              key={summary.id} 
              summary={summary} 
              hasAccess={hasUploaded}
              onAccessRequired={() => setIsDialogOpen(true)}
              onDownload={handleDownload}
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

      <div className="fixed-summary-upload-btn">
        <button 
          className="summary-upload-btn-floating"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="upload-icon">📤</span>
          העלה סיכום
        </button>
      </div>

      <UploadSummaryDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentUser={currentUser}
      />
    </div>
  );
};

export default SummaryLibrary;