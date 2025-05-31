import React, { useState, useEffect } from "react";
import UploadSummaryDialog from "../../components/SummaryLibraryHelper/UploadSummaryDialog/UploadSummaryDialog";
import "./SummaryLibrary.css";

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloud_name: 'doxht9fpl',
  upload_preset: 'summaries_preset',
  api_key: '479472249636565',
  api_secret: 'HDKDKxj2LKE-tPHgd6VeRPFGJaU'
};

// פונקציה לקבלת מזהה משתמש ייחודי (מבוסס על localStorage)
const getUserId = () => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

// פונקציה למחיקת קובץ מ-Cloudinary - מתוקנת עם Web Crypto API
const deleteFromCloudinary = async (publicId) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.api_secret}`;
    
    // שימוש ב-Web Crypto API במקום crypto של Node.js
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('Attempting to delete from Cloudinary:', {
      publicId,
      timestamp,
      signature: signature.substring(0, 10) + '...' // הצג רק חלק מהחתימה בלוג
    });

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('api_key', CLOUDINARY_CONFIG.api_key);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/raw/destroy`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return false;
    }

    const result = await response.json();
    console.log('Cloudinary deletion response:', result);
    
    if (result.result === 'ok') {
      console.log('File deleted successfully from Cloudinary');
      return true;
    } else if (result.result === 'not found') {
      console.log('File was already deleted or not found in Cloudinary');
      return true; // נחשיב זאת כהצלחה כי הקובץ ממילא לא קיים
    } else {
      console.error('Failed to delete from Cloudinary:', result);
      return false;
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    
    // בדיקה אם השגיאה קשורה ל-CORS או רשתות
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error - possibly CORS issue');
      alert('שגיאת רשת במחיקה מ-Cloudinary. הקובץ עדיין קיים בשרת.');
    }
    
    return false;
  }
};

// רכיב כרטיס סיכום
const SummaryCard = ({ summary, hasAccess, onAccessRequired, onDelete, currentUserId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // בדיקה האם הסיכום שייך למשתמש הנוכחי
  const isOwnSummary = summary.uploadedBy === currentUserId;

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

  const handleDownload = async () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      try {
        // יצירת URL להורדה של הקובץ מ-Cloudinary
        const downloadUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/fl_attachment/${summary.public_id}.pdf`;
        
        // פתיחת הקובץ בטאב חדש להורדה
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${summary.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert("מוריד את הסיכום: " + summary.title);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert("שגיאה בהורדת הקובץ");
      }
    }
  };

  const handlePreview = () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
    } else {
      try {
        // יצירת URL לתצוגה מקדימה של הקובץ מ-Cloudinary
        const previewUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}.pdf`;
        window.open(previewUrl, '_blank');
      } catch (error) {
        console.error('Error previewing file:', error);
        alert("שגיאה בתצוגה מקדימה");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הסיכום "${summary.title}"? פעולה זו אינה ניתנת לביטול.`)) {
      setIsDeleting(true);
      
      try {
        console.log('Starting deletion process for:', summary.public_id);
        
        // ניסיון למחוק מ-Cloudinary
        const cloudinaryDeleted = await deleteFromCloudinary(summary.public_id);
        
        if (cloudinaryDeleted) {
          // מחיקה מהאחסון המקומי רק אם המחיקה מ-Cloudinary הצליחה
          await onDelete(summary.public_id);
          alert("הסיכום נמחק בהצלחה מכל המקומות!");
        } else {
          // במקרה של כשל במחיקה מ-Cloudinary, שאל את המשתמש אם להמשיך
          const shouldContinue = window.confirm(
            "לא הצלחנו למחוק את הקובץ מהשרת (Cloudinary). זה יכול להיות בגלל בעיית רשת או הרשאות.\n\n" +
            "האם ברצונך למחוק אותו רק מהממשק המקומי? (הקובץ עדיין יישאר בשרת)"
          );
          
          if (shouldContinue) {
            await onDelete(summary.public_id);
            alert("הסיכום נמחק מהממשק המקומי בלבד.\nהקובץ עדיין קיים בשרת Cloudinary.");
          }
        }
      } catch (error) {
        console.error('Error deleting summary:', error);
        alert("שגיאה במחיקת הסיכום: " + error.message);
      } finally {
        setIsDeleting(false);
      }
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
        
        {/* כפתור מחיקה - יוצג רק אם הסיכום שייך למשתמש הנוכחי */}
        {hasAccess && isOwnSummary && (
          <button 
            className="delete-button" 
            onClick={handleDelete} 
            title="מחק סיכום"
            disabled={isDeleting}
            style={{ opacity: isDeleting ? 0.5 : 1 }}
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        )}
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
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId] = useState(getUserId());

  // בדיקה האם המשתמש כבר העלה סיכום
  const checkUserUploadStatus = () => {
    const savedSummaries = localStorage.getItem('uploaded_summaries');
    if (savedSummaries) {
      const summariesArray = JSON.parse(savedSummaries);
      const userSummaries = summariesArray.filter(summary => summary.uploadedBy === currentUserId);
      return userSummaries.length > 0;
    }
    return false;
  };

  useEffect(() => {
    const userHasUploaded = checkUserUploadStatus();
    setHasUploaded(userHasUploaded);
    localStorage.setItem('user_uploaded_summary', userHasUploaded ? 'true' : 'false');
  }, [currentUserId]);

  // פונקציה לטעינת סיכומים מ-localStorage (פתרון זמני עד להקמת backend)
  const loadSummariesFromLocalStorage = () => {
    try {
      setIsLoading(true);
      
      // טעינת סיכומים מ-localStorage
      const savedSummaries = localStorage.getItem('uploaded_summaries');
      let localSummaries = [];
      
      if (savedSummaries) {
        localSummaries = JSON.parse(savedSummaries);
      }
      
      // בדיקה האם המשתמש העלה סיכום
      const userHasUploaded = checkUserUploadStatus();
      
      // עדכון סטטוס הנעילה לכל הסיכומים
      const allSummaries = localSummaries.map(summary => ({
        ...summary,
        isLocked: !userHasUploaded
      }));
      
      setSummaries(allSummaries);
      setHasUploaded(userHasUploaded);
      
    } catch (error) {
      console.error('Error loading summaries from localStorage:', error);
      setSummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // פונקציה למחיקת סיכום מ-localStorage
  const deleteSummaryFromStorage = async (publicId) => {
    try {
      console.log('Deleting summary from storage:', publicId);
      
      // עדכון רשימת הסיכומים - הסרה מהמערך הנוכחי
      setSummaries(prevSummaries => {
        const updatedSummaries = prevSummaries.filter(summary => summary.public_id !== publicId);
        
        // עדכון localStorage - שמירה רק של הסיכומים שנותרו
        localStorage.setItem('uploaded_summaries', JSON.stringify(updatedSummaries));
        console.log('Updated localStorage with remaining summaries:', updatedSummaries.length);
        
        // בדיקה האם המשתמש עדיין יש לו סיכומים אחרי המחיקה
        const userSummariesAfterDelete = updatedSummaries.filter(summary => summary.uploadedBy === currentUserId);
        const userStillHasUploads = userSummariesAfterDelete.length > 0;
        
        console.log('User summaries after delete:', userSummariesAfterDelete.length);
        
        // עדכון סטטוס ההעלאה
        setHasUploaded(userStillHasUploads);
        localStorage.setItem('user_uploaded_summary', userStillHasUploads ? 'true' : 'false');
        
        // אם המשתמש לא נותר לו סיכומים, נעיל את כל הסיכומים האחרים
        if (!userStillHasUploads) {
          return updatedSummaries.map(summary => ({
            ...summary,
            isLocked: true
          }));
        }
        
        return updatedSummaries;
      });
      
    } catch (error) {
      console.error('Error deleting summary from storage:', error);
      throw error;
    }
  };

  // טעינת סיכומים בעת טעינת הרכיב
  useEffect(() => {
    loadSummariesFromLocalStorage();
  }, []);

  // פונקציה לסינון וחיפוש סיכומים
  const filteredSummaries = summaries.filter(summary => {
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

  const handleUploadSuccess = (uploadedSummary) => {
    setHasUploaded(true);
    localStorage.setItem('user_uploaded_summary', 'true');
    
    // הוספת מזהה המשתמש לסיכום החדש
    const summaryWithUserId = {
      ...uploadedSummary,
      uploadedBy: currentUserId,
      isLocked: false,
      id: Date.now().toString() // מזהה ייחודי
    };
    
    // שמירה ב-localStorage
    const existingSummaries = JSON.parse(localStorage.getItem('uploaded_summaries') || '[]');
    const updatedSummaries = [summaryWithUserId, ...existingSummaries];
    localStorage.setItem('uploaded_summaries', JSON.stringify(updatedSummaries));
    
    // הוספת הסיכום החדש לרשימה
    setSummaries(prevSummaries => [summaryWithUserId, ...prevSummaries]);
    
    alert("הסיכום הועלה בהצלחה! כעת יש לך גישה מלאה לכל הסיכומים בספרייה.");
    setIsDialogOpen(false);
    
    // עדכון הסטטוס של כל הסיכומים - הסרת הנעילה
    setSummaries(prevSummaries => 
      prevSummaries.map(summary => ({ ...summary, isLocked: false }))
    );
    
    // רענון הרשימה כדי לוודא שהסיכום החדש מופיע
    setTimeout(() => {
      loadSummariesFromLocalStorage();
    }, 100);
  };

  const uniqueCourses = [...new Set(summaries.map(summary => summary.course))];
  const uniqueProfessors = [...new Set(summaries.map(summary => summary.professor))];

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>טוען סיכומים...</div>
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
              onDelete={deleteSummaryFromStorage}
              currentUserId={currentUserId}
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
        cloudinaryConfig={CLOUDINARY_CONFIG}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default SummaryLibrary;