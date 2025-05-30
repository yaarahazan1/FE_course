import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase/config"; 
import { onAuthStateChanged } from "firebase/auth";
import UploadSummaryDialog from "../../components/SummaryLibraryHelper/UploadSummaryDialog/UploadSummaryDialog";
import "./SummaryLibrary.css";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "doxht9fpl"; 
const CLOUDINARY_API_KEY = "479472249636565";
const CLOUDINARY_API_SECRET = "HDKDKxj2LKE-tPHgd6VeRPFGJaU"; 
const CLOUDINARY_UPLOAD_PRESET = "summaries_preset"; 

const SummaryCard = ({ summary, hasAccess, onAccessRequired, onDownload, onPreview }) => {
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
      await onDownload(summary);
    }
  };

  const handlePreview = () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      onPreview(summary);
    }
  };

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
    loadSummariesFromCloudinary();
    checkUserUploadStatus();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      console.log("Current user:", user);
    });

    return () => unsubscribe();
  }, []);

  // טעינת סיכומים מ-Cloudinary
  const loadSummariesFromCloudinary = async () => {
    try {
      setLoading(true);
      
      // שליפת רשימת הקבצים מ-Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/raw?max_results=500&context=true`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from Cloudinary');
      }

      const data = await response.json();
      
      // המרת הנתונים לפורמט הנדרש
      const summariesList = data.resources
        .filter(resource => resource.context && resource.context.title) // רק קבצים עם metadata
        .map(resource => {
          const context = resource.context || {};
          return {
            id: resource.public_id,
            cloudinaryId: resource.public_id,
            title: context.title || "ללא כותרת",
            author: context.author || "לא צוין",
            course: context.course || "לא צוין",
            professor: context.professor || "לא צוין",
            date: context.date || new Date().toLocaleDateString('he-IL'),
            pages: parseInt(context.pages) || 0,
            rating: parseFloat(context.rating) || 5,
            downloads: parseInt(context.downloads) || 0,
            status: context.status || "pending",
            isLocked: context.isLocked === "true" || false,
            fileUrl: resource.secure_url,
            createdAt: new Date(resource.created_at),
            format: resource.format
          };
        })
        .filter(summary => summary.status === "approved"); // רק סיכומים מאושרים

        console.log("Loaded summaries from Cloudinary:", summariesList);
        setSummaries(summariesList);
    } catch (error) {
      console.error("שגיאה בטעינת הסיכומים מ-Cloudinary:", error);
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserUploadStatus = async () => {
    const userHasUploaded = localStorage.getItem("userHasUploaded") === "true";
    setHasUploaded(userHasUploaded);
  };

  // הורדת קובץ מ-Cloudinary
  const handleDownload = async (summary) => {
    try {
      // עדכון מספר ההורדות ב-Cloudinary
      await updateSummaryDownloads(summary.cloudinaryId);
      
      // הורדת הקובץ
      const link = document.createElement('a');
      link.href = summary.fileUrl;
      link.download = `${summary.title}.${summary.format}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // עדכון לוקלי של מספר ההורדות
      setSummaries(prev => prev.map(s => 
        s.id === summary.id 
          ? { ...s, downloads: s.downloads + 1 }
          : s
      ));
      
      console.log("מוריד את הסיכום: " + summary.title);
    } catch (error) {
      console.error("שגיאה בהורדת הקובץ:", error);
      alert("אירעה שגיאה בהורדת הקובץ");
    }
  };

  // תצוגה מקדימה
  const handlePreview = (summary) => {
    if (summary.format === 'pdf') {
      window.open(summary.fileUrl, '_blank');
    } else {
      // עבור פורמטים אחרים
      const previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(summary.fileUrl)}&embedded=true`;
      window.open(previewUrl, '_blank');
    }
  };

  // עדכון מספר ההורדות ב-Cloudinary
  const updateSummaryDownloads = async (cloudinaryId) => {
    try {
      const currentSummary = summaries.find(s => s.cloudinaryId === cloudinaryId);
      const newDownloadCount = (currentSummary?.downloads || 0) + 1;
      
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/raw/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_id: cloudinaryId,
            context: {
              downloads: newDownloadCount.toString()
            }
          })
        }
      );
    } catch (error) {
      console.error("שגיאה בעדכון ההורדות:", error);
    }
  };

  // בדיקה אם סיכום כבר קיים
  const checkDuplicateSummary = (title, author, course) => {
    return summaries.some(summary => 
      summary.title.toLowerCase() === title.toLowerCase() &&
      summary.author.toLowerCase() === author.toLowerCase() &&
      summary.course.toLowerCase() === course.toLowerCase()
    );
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
      return new Date(b.createdAt) - new Date(a.createdAt);
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
      // בדיקת כפילות
      if (checkDuplicateSummary(summaryData.title, summaryData.author, summaryData.course)) {
        alert("סיכום דומה כבר קיים במערכת!");
        return;
      }

      // העלאה ל-Cloudinary עם metadata
      const formData = new FormData();
      formData.append('file', summaryData.file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('resource_type', 'raw');
      
      // הוספת metadata
      const context = {
        title: summaryData.title,
        author: summaryData.author,
        course: summaryData.course,
        professor: summaryData.professor,
        date: summaryData.date || new Date().toLocaleDateString('he-IL'),
        pages: summaryData.pages?.toString() || "0",
        rating: summaryData.rating?.toString() || "5",
        downloads: "0",
        status: "pending",
        isLocked: "false"
      };
      
      formData.append('context', JSON.stringify(context));

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setHasUploaded(true);
      localStorage.setItem("userHasUploaded", "true");
      alert("הסיכום הועלה בהצלחה! הוא ממתין לאישור מנהל המערכת.");
      setIsDialogOpen(false);
      
      // רענון הרשימה
      await loadSummariesFromCloudinary();
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
              onPreview={handlePreview}
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

      {(
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