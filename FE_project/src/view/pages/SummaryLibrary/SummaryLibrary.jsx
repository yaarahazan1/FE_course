
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

const deleteFromCloudinary = async (publicId) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.api_secret}`;
    
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
    formData.append('access_mode', 'public');


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

const SummaryCard = ({ summary, hasAccess, onAccessRequired, onDelete, onUpdateSummary, currentUserId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const isOwnSummary = summary.uploadedBy === currentUserId;

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
      return;
    }

    try {
      setIsDownloading(true);
      
      console.log('Summary public_id:', summary.public_id);
      
      const getFileExtension = (publicId) => {
        if (publicId.includes('.')) {
          return publicId.split('.').pop().toLowerCase();
        }
        return 'unknown';
      };
      
      const fileExtension = getFileExtension(summary.public_id);
      const isDocFile = ['doc', 'docx'].includes(fileExtension);
      
      const cleanTitle = summary.title.replace(/[<>:"/\\|?*]/g, '_').trim();
      let fileName = cleanTitle;
      if (isDocFile) {
        fileName += `.${fileExtension}`;
      } else {
        fileName += '.pdf';
      }
      
      console.log('File type detected:', fileExtension, 'Download as:', fileName);
      
      if (summary.fileUrl) {
        console.log('Using direct file URL:', summary.fileUrl);
        
        const link = document.createElement('a');
        link.href = summary.fileUrl;
        link.download = fileName;
        link.target = '_blank'; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        updateDownloadCount(summary.id);
        return;
      }
      
      const downloadUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/fl_attachment/${summary.public_id}`;
      
      console.log('Trying download URL:', downloadUrl);
      
      try {
        const response = await fetch(downloadUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        if (blob.size === 0) {
          throw new Error('Downloaded file is empty');
        }
        
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        
        updateDownloadCount(summary.id);
        console.log('File downloaded successfully via fetch as:', fileName);
        
      } catch (fetchError) {
        console.log('Fetch failed, trying direct link method:', fetchError.message);
        
        const directUrls = [
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/fl_attachment/${summary.public_id}`,
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload/fl_attachment/${summary.public_id}`,
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`,
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload/${summary.public_id}`
        ];
        
        let downloadStarted = false;
        
        for (const url of directUrls) {
          try {
            console.log('Trying direct download URL:', url);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // שימוש בשם הקובץ עם הסיומת הנכונה
            link.target = '_blank'; // פתיחה בטאב חדש כ-fallback
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            updateDownloadCount(summary.id);
            downloadStarted = true;
            console.log('Direct download started with URL:', url, 'as:', fileName);
            break;
            
          } catch (directError) {
            console.log('Direct download failed for URL:', url, directError.message);
            continue;
          }
        }
        
        if (!downloadStarted) {
          throw new Error('כל שיטות ההורדה נכשלו');
        }
      }
      
    } catch (error) {
      console.error('Error downloading file:', error);
      
      let errorMessage = 'שגיאה בהורדת הקובץ:\n\n';
      
      if (error.message.includes('CORS')) {
        errorMessage += 'בעיית הרשאות גישה. נסה להוריד את הקובץ בדפדפן אחר או בחלון גלישה פרטית.';
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        errorMessage += 'הקובץ לא נמצא בשרת. ייתכן שהוא נמחק או שהקישור פגום.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage += 'בעיית חיבור לאינטרנט. נסה שוב מאוחר יותר.';
      } else {
        errorMessage += error.message;
      }
      
      errorMessage += '\n\nאם הבעיה נמשכת, נסה:';
      errorMessage += '\n1. לרענן את הדף';
      errorMessage += '\n2. לנסות בדפדפן אחר';
      errorMessage += '\n3. להשבית את חוסם הפרסומות זמנית';
      
      alert(errorMessage);
      
      const fallbackUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
      console.log('Opening fallback URL in new tab:', fallbackUrl);
      window.open(fallbackUrl, '_blank');
      
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePreview = async () => {
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
      return;
    }

    try {
      // פתיחת מודל התצוגה המקדימה
      setShowPreviewModal(true);
      
    } catch (error) {
      console.error('Error opening preview:', error);
      alert(`שגיאה בפתיחת התצוגה המקדימה: ${error.message}`);
    }
  };

  const PreviewContent = ({ summary }) => {
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentViewerIndex, setCurrentViewerIndex] = useState(0);

    const getFileExtension = (publicId) => {
      if (publicId.includes('.')) {
        return publicId.split('.').pop().toLowerCase();
      }
      return 'unknown';
    };

    const fileExtension = getFileExtension(summary.public_id);
    const isDocFile = ['doc', 'docx'].includes(fileExtension);
    const isPdfFile = ['pdf'].includes(fileExtension);

    useEffect(() => {
      const loadPreview = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          console.log('Loading preview for file type:', fileExtension);
          console.log('Public ID:', summary.public_id);
          
          // URL ישיר לקובץ
          const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
          console.log('Direct URL:', directUrl);
          
          // רשימת viewers שונים לפי סוג הקובץ
          let viewers = [];
          
          if (isDocFile) {
            // עבור קבצי DOC/DOCX
            viewers = [
              // Microsoft Office Online Viewer - הכי טוב לקבצי Word
              `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
              
              // Google Docs Viewer - גם תומך בקבצי Word
              `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
              
              // Google Drive Viewer (חלופה)
              `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
              
              // הצגה ישירה (לא תמיד עובד עם DOC)
              directUrl
            ];
          } else if (isPdfFile) {
            // עבור קבצי PDF
            viewers = [
              // PDF.js - הכי טוב לPDF
              `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(directUrl)}`,
              
              // Google Docs Viewer
              `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
              
              // Microsoft Office Viewer
              `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
              
              // הצגה ישירה
              directUrl
            ];
          } else {
            // עבור קבצים אחרים
            viewers = [
              `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
              `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
              directUrl
            ];
          }
          
          // התחל עם הviewer הראשון
          setPreviewUrl(viewers[0]);
          
        } catch (err) {
          console.error('Error loading preview:', err);
          setError('לא ניתן לטעון את התצוגה המקדימה');
        } finally {
          setIsLoading(false);
        }
      };

      loadPreview();
    }, [summary.public_id, fileExtension]);

    const handleIframeError = () => {
      console.log('Current viewer failed, trying next one');
      
      const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
      
      let viewers = [];
      if (isDocFile) {
        viewers = [
          `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
          `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
          `https://drive.google.com/viewerng/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
          directUrl
        ];
      } else if (isPdfFile) {
        viewers = [
          `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(directUrl)}`,
          `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
          `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
          directUrl
        ];
      }
      
      const nextIndex = currentViewerIndex + 1;
      
      if (nextIndex < viewers.length) {
        console.log(`Trying viewer ${nextIndex}:`, viewers[nextIndex]);
        setCurrentViewerIndex(nextIndex);
        setPreviewUrl(viewers[nextIndex]);
      } else {
        console.log('All viewers failed');
        setError('לא ניתן לטעון את התצוגה המקדימה. הקובץ עשוי להיות פגום או לא נגיש.');
      }
    };

    // פונקציה לבדיקת זמינות הקובץ
    const checkFileAvailability = async () => {
      try {
        const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
        const response = await fetch(directUrl, { method: 'HEAD' });
        
        if (!response.ok) {
          throw new Error(`File not accessible: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('File content type:', contentType);
        
        return true;
      } catch (error) {
        console.error('File availability check failed:', error);
        return false;
      }
    };

    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100% - 60px)',
          fontSize: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontSize: '20px' }}>⏳</div>
            <div>טוען תצוגה מקדימה...</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              סוג קובץ: {fileExtension.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100% - 60px)',
          fontSize: '16px',
          color: '#666',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '30px' }}>⚠️</div>
          <div style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
            {error}
          </div>
          <div style={{ fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            {isDocFile ? 
              'קבצי Word לפעמים דורשים הורדה לצפייה מלאה' : 
              'הקובץ עשוי להיות פגום או לא נגיש'
            }
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                window.open(directUrl, '_blank');
              }}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              פתח קובץ בטאב חדש
            </button>
            <button
              onClick={async () => {
                // בדוק זמינות הקובץ ונסה שוב
                const isAvailable = await checkFileAvailability();
                if (isAvailable) {
                  setCurrentViewerIndex(0);
                  setError(null);
                  setIsLoading(true);
                  
                  const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                  const firstViewer = isDocFile ? 
                    `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}` :
                    `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`;
                  
                  setPreviewUrl(firstViewer);
                  setTimeout(() => setIsLoading(false), 1000);
                } else {
                  alert('הקובץ לא נגיש. נסה להוריד אותו במקום.');
                }
              }}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              נסה שוב
            </button>
            {isDocFile && (
              <button
                onClick={() => {
                  // לקבצי DOC, נסה להמיר לPDF דרך Google
                  const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                  const convertUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true&a=v&pagenumber=1&w=100%`;
                  setPreviewUrl(convertUrl);
                  setError(null);
                }}
                style={{
                  background: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                נסה תצוגה מותאמת
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{ height: '100%', position: 'relative' }}>
        {/* מציג מידע על הviewer הנוכחי */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          {isDocFile ? 'Word Document' : isPdfFile ? 'PDF' : 'Document'} 
          {currentViewerIndex === 0 && ' - Microsoft Viewer'}
          {currentViewerIndex === 1 && ' - Google Viewer'}
          {currentViewerIndex === 2 && ' - Alternative Viewer'}
          {currentViewerIndex === 3 && ' - Direct View'}
        </div>
        
        <iframe
          src={previewUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0 0 8px 8px'
          }}
          title={`תצוגה מקדימה: ${summary.title}`}
          onError={handleIframeError}
          onLoad={() => {
            console.log('Preview loaded successfully with viewer index:', currentViewerIndex);
            console.log('Viewer URL:', previewUrl);
          }}
          // הוספת sandbox לבטיחות
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  };

  const updateDownloadCount = (summaryId) => {
    try {
      const savedSummaries = localStorage.getItem('uploaded_summaries');
      if (savedSummaries) {
        const summariesArray = JSON.parse(savedSummaries);
        const updatedSummaries = summariesArray.map(sum => {
          if (sum.id === summaryId) {
            return { ...sum, downloads: (sum.downloads || 0) + 1 };
          }
          return sum;
        });
        localStorage.setItem('uploaded_summaries', JSON.stringify(updatedSummaries));
        
        if (onUpdateSummary) {
          onUpdateSummary(summaryId, { downloads: (summary.downloads || 0) + 1 });
        }
      }
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הסיכום "${summary.title}"? פעולה זו אינה ניתנת לביטול.`)) {
      setIsDeleting(true);
      
      try {
        console.log('Starting deletion process for:', summary.public_id);
        
        const cloudinaryDeleted = await deleteFromCloudinary(summary.public_id);
        
        if (cloudinaryDeleted) {
          await onDelete(summary.public_id);
          alert("הסיכום נמחק בהצלחה מכל המקומות!");
        } else {
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
    <>
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
            className={`download-button ${summary.isLocked && !hasAccess ? "locked-button" : ""} ${isDownloading ? "loading" : ""}`}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <span className="download-icon">{isDownloading ? '⏳' : '⬇️'}</span>
            <span>{isDownloading ? 'מוריד...' : 'הורד'}</span>
          </button>
          <button 
            className={`preview-button ${summary.isLocked && !hasAccess ? "locked-button" : ""}`}
            onClick={handlePreview}
            disabled={isDownloading}
          >
            <span className="preview-icon">👁️</span>
            <span>תצוגה מקדימה</span>
          </button>
        </div>
      </div>
      {showPreviewModal && (
        <div 
          className="preview-modal-overlay"
          onClick={() => setShowPreviewModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="preview-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 15px',
              borderBottom: '1px solid #ddd',
              backgroundColor: '#f5f5f5'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>
                תצוגה מקדימה: {summary.title}
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: isDownloading ? 0.5 : 1
                  }}
                >
                  {isDownloading ? '⏳ מוריד...' : '⬇️ הורד'}
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕ סגור
                </button>
              </div>
            </div>
            <PreviewContent summary={summary} cloudinaryConfig={CLOUDINARY_CONFIG} />
          </div>
        </div>
      )}
    </>
  );
};

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

  const handleUpdateSummary = (summaryId, updates) => {
    setSummaries(prevSummaries => 
      prevSummaries.map(summary => 
        summary.id === summaryId 
          ? { ...summary, ...updates }
          : summary
      )
    );
  };

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
              onUpdateSummary={handleUpdateSummary}
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