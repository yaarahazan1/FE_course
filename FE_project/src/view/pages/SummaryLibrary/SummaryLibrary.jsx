import React, { useState, useEffect } from "react";
import UploadSummaryDialog from "../../components/SummaryLibraryHelper/UploadSummaryDialog/UploadSummaryDialog";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, onSnapshot } from 'firebase/firestore';
import "./SummaryLibrary.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase/config';

const CLOUDINARY_CONFIG = {
  cloud_name: 'doxht9fpl',
  upload_preset: 'summaries_preset',
  api_key: '479472249636565',
  api_secret: 'HDKDKxj2LKE-tPHgd6VeRPFGJaU'
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
  const [summaries, setSummaries] = useState([]);

  const isOwnSummary = summary.uploadedBy === currentUserId;
  const isRejected = summary.status === 'נדחה';
  const isPending = summary.status === 'ממתין לאישור' || !summary.status;
  const isApproved = summary.status === 'מאושר';

  const [user] = useAuthState(auth);

  useEffect(() => {
    getSummaries();
  }, []);

  const getSummaries = async () => {
    if (!user?.uid) return;
    
    try {
      const summariesRef = collection(db, 'summaries');
      const q = query(summariesRef, where('uploadedBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const userSummaries = [];
      querySnapshot.forEach((doc) => {
        userSummaries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setSummaries(userSummaries);
    } catch (error) {
      console.error('Error getting user summaries:', error);
    }
  };

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
    const isAccessible = summary.status === 'מאושר' || 
                        (summary.uploadedBy === currentUserId && !isRejected);
        
    if (!isAccessible) {
      if (isRejected && !isOwnSummary) {
        onAccessRequired();
        return;
      } else if (isRejected && isOwnSummary) {
        alert("סיכום זה נדחה על ידי המנהל ואינו זמין להורדה");
        return;
      } else if (isPending) {
        alert("סיכום זה ממתין לאישור המנהל");
        return;
      } else {
        alert("סיכום זה אינו זמין להורדה");
        return;
      }
    }

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
    // רק הבעלים יכול לצפות בסיכומים נדחים - לכל השאר זה נעול
    const isAccessible = isApproved || (isOwnSummary && !isRejected);
    
    if (!isAccessible) {
      if (isRejected && !isOwnSummary) {
        // עבור משתמשים אחרים - סיכום נדחה מתנהג כמו סיכום נעול
        onAccessRequired();
        return;
      } else if (isRejected && isOwnSummary) {
        alert("סיכום זה נדחה על ידי המנהל ואינו זמין לצפייה");
        return;
      } else if (isPending) {
        alert("סיכום זה ממתין לאישור המנהל");
        return;
      } else {
        alert("סיכום זה אינו זמין לצפייה");
        return;
      }
    }
    
    if (summary.isLocked && !hasAccess) {
      onAccessRequired();
      return;
    }

    try {
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
          
          const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
          console.log('Direct URL:', directUrl);
          
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
          } else {
            viewers = [
              `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`,
              `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}`,
              directUrl
            ];
          }
          
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
        <div className="preview-loading">
          <div className="preview-loading-content">
            <div className="preview-loading-icon">⏳</div>
            <div className="preview-loading-text">טוען תצוגה מקדימה...</div>
            <div className="preview-loading-subtext">
              סוג קובץ: {fileExtension.toUpperCase()}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="preview-error">
          <div className="preview-error-icon">⚠️</div>
          <div className="preview-error-title">
            {error}
          </div>
          <div className="preview-error-description">
            {isDocFile ? 
              'קבצי Word לפעמים דורשים הורדה לצפייה מלאה' : 
              'הקובץ עשוי להיות פגום או לא נגיש'
            }
          </div>
          <div className="preview-error-actions">
            <button
              onClick={() => {
                const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                window.open(directUrl, '_blank');
              }}
              className="preview-error-btn primary"
            >
              פתח קובץ בטאב חדש
            </button>
            <button
              onClick={async () => {
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
              className="preview-error-btn secondary"
            >
              נסה שוב
            </button>
            {isDocFile && (
              <button
                onClick={() => {
                  const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                  const convertUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true&a=v&pagenumber=1&w=100%`;
                  setPreviewUrl(convertUrl);
                  setError(null);
                }}
                className="preview-error-btn warning"
              >
                נסה תצוגה מותאמת
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="preview-content-summary-container">
        <div className="viewer-info">
          {isDocFile ? 'Word Document' : isPdfFile ? 'PDF' : 'Document'} 
          {currentViewerIndex === 0 && ' - Microsoft Viewer'}
          {currentViewerIndex === 1 && ' - Google Viewer'}
          {currentViewerIndex === 2 && ' - Alternative Viewer'}
          {currentViewerIndex === 3 && ' - Direct View'}
        </div>
        
        <iframe
          src={previewUrl}
          className="preview-iframe"
          title={`תצוגה מקדימה: ${summary.title}`}
          onError={handleIframeError}
          onLoad={() => {
            console.log('Preview loaded successfully with viewer index:', currentViewerIndex);
            console.log('Viewer URL:', previewUrl);
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  };

  const updateDownloadCount = async (summaryId) => {
    try {
      const summary = summaries.find(s => s.id === summaryId);
      if (!summary) return;
      
      const newDownloadCount = (summary.downloads || 0) + 1;
      
      // עדכון ב-Firebase
      await updateDoc(doc(db, 'summaries', summaryId), {
        downloads: newDownloadCount
      });
      
      // עדכון מקומי
      if (onUpdateSummary) {
        onUpdateSummary(summaryId, { downloads: newDownloadCount });
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

  const isSummaryLocked = (summary) => {
    const isOwnSummary = summary.uploadedBy === currentUserId; 
    const isRejected = summary.status === 'נדחה';

    // האם המשתמש העלה סיכום כלשהו?
    const userHasSubmittedAny = summaries.length > 0;

    // האם המשתמש העלה סיכום מאושר?
    const userHasApprovedSummary = summaries.some(s => s.status === 'מאושר');

    // 1. אם לא העלה סיכום בכלל → נעול
    if (!userHasSubmittedAny) {
      return true;
    }

    // 2. הסיכום שלו → אף פעם לא נעול (גם אם דחוי)
    if (isOwnSummary) {
      return false;
    }

    // 3. סיכום של מישהו אחר
    if (!userHasApprovedSummary) {
      return true;  // אם המשתמש לא העלה סיכום מאושר → סיכומים אחרים נעולים
    }

    return isRejected; // אם המשתמש העלה סיכום מאושר → סיכומים אחרים נעולים רק אם דחויים
  };

  // בדיקה אם הסיכום צריך להיראות כנעול
  const shouldDisplayAsLocked = isSummaryLocked(summary)

  return (
    <>
      <div className="summary-card">
        <div className="summary-card-header">
          {shouldDisplayAsLocked ? (
            <div className="locked-indicator">
              <span className="lock-icon">🔒</span>
              <span className="locked-text">נעול</span>
            </div>
          ) : null}
          
           {isOwnSummary && (
            <div className="status-indicator">
              {isPending && (
                <span className="status-pending" title="ממתין לאישור מנהל">
                  ⏳ ממתין לאישור
                </span>
              )}
              {isRejected && (
                <span className="status-rejected" title={`נדחה: ${summary.feedback || 'ללא הסבר'}`}>
                  ❌ נדחה
                </span>
              )}
              {isApproved && (
                <span className="status-approved" title="מאושר">
                  ✅ מאושר
                </span>
              )}
            </div>
          )}
          
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
          <h3 className="summary-library-title">{summary.title}</h3>
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
          className={`download-button ${
            shouldDisplayAsLocked || (!isApproved && !isOwnSummary) || (isRejected && isOwnSummary)
              ? "locked-button" 
              : ""
          } ${isDownloading ? "loading" : ""}`}
          onClick={handleDownload}
          disabled={isDownloading || (!isApproved && !isOwnSummary) || (isRejected && isOwnSummary)}
        >
          <span className="download-icon">{isDownloading ? '⏳' : '⬇️'}</span>
          <span>
            {isDownloading ? 'מוריד...' : 
            shouldDisplayAsLocked ? 'נעול' :
            !isApproved && !isOwnSummary ? (isRejected ? 'נדחה' : 'ממתין') : 
            (isRejected && isOwnSummary) ? 'נדחה' : 'הורד'}
          </span>
        </button>
        <button 
          className={`preview-button ${
            shouldDisplayAsLocked || (!isApproved && !isOwnSummary) || (isRejected && isOwnSummary)
              ? "locked-button" 
              : ""
          }`}
          onClick={handlePreview}
          disabled={isDownloading || (!isApproved && !isOwnSummary) || (isRejected && isOwnSummary)}
        >
          <span className="preview-icon">👁️</span>
          <span>
            {!isApproved && !isOwnSummary ? (isRejected ? 'נדחה' : 'ממתין') : 'תצוגה מקדימה'}
          </span>
        </button>
      </div>
      </div>
      {showPreviewModal && (
        <div 
          className="preview-modal-overlay"
          onClick={() => setShowPreviewModal(false)}
        >
          <div 
            className="preview-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-modal-header">
              <h3 className="preview-modal-title">
                תצוגה מקדימה: {summary.title}
              </h3>
              <div className="preview-modal-actions">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`preview-modal-btn download ${isDownloading ? 'loading' : ''}`}
                >
                  {isDownloading ? '⏳ מוריד...' : '⬇️ הורד'}
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="preview-modal-btn close"
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

  const currentUserId = user?.uid || null;
  const [user] = useAuthState(auth);

  const handleUpdateSummary = (summaryId, updates) => {
    setSummaries(prevSummaries => 
      prevSummaries.map(summary => 
        summary.id === summaryId 
          ? { ...summary, ...updates }
          : summary
      )
    );
  };

  const checkUserUploadStatus = async (user) => {
    if (!user?.uid) return false;
    
    try {
      const summariesRef = collection(db, 'summaries');
      const q = query(summariesRef, where('uploadedBy', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking user upload status:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkUploadStatus = async () => {
      if (user?.uid) {
        console.log('Checking user upload status for:', user.displayName);
        const userHasUploaded = await checkUserUploadStatus(user);
        console.log('User has uploaded:', userHasUploaded);
        setHasUploaded(userHasUploaded);
      } else {
        console.log('No user for upload status check');
        setHasUploaded(false);
      }
    };
    
    checkUploadStatus();
  }, [user]);

  const loadSummariesFromFirebase = async () => {
    if (!user?.uid) {
      console.log('No user, cannot load summaries');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading summaries for user:', user.displayName);
      
      const summariesRef = collection(db, 'summaries');
      const querySnapshot = await getDocs(summariesRef);
      
      const firebaseSummaries = [];
      querySnapshot.forEach((doc) => {
        firebaseSummaries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Loaded summaries from Firebase:', firebaseSummaries.length);
      
      const userHasUploaded = await checkUserUploadStatus(user);
      console.log('User upload status:', userHasUploaded);
      
      const allSummaries = firebaseSummaries.map(summary => ({
        ...summary,
        isLocked: !userHasUploaded || (summary.uploadedBy !== user?.uid && !userHasUploaded)
      }));
      
      setSummaries(allSummaries);
      setHasUploaded(userHasUploaded);
      
    } catch (error) {
      console.error('Error loading summaries from Firebase:', error);
      setSummaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSummaryFromFirebase = async (publicId) => {
    try {
      console.log('Deleting summary from Firebase:', publicId);
      
      // מצא את הסיכום לפי public_id
      const summaryToDelete = summaries.find(summary => summary.public_id === publicId);
      if (!summaryToDelete) {
        throw new Error('Summary not found');
      }
      
      // מחק מ-Firebase
      await deleteDoc(doc(db, 'summaries', summaryToDelete.id));
      console.log('Deleted from Firebase successfully');
      
      // עדכן את הרשימה המקומית
      const updatedSummaries = summaries.filter(summary => summary.public_id !== publicId);
      
      // בדיקה אם למשתמש עדיין יש סיכומים
      const userSummariesAfterDelete = updatedSummaries.filter(summary => summary.uploadedBy === user?.uid);
      const userStillHasUploads = userSummariesAfterDelete.length > 0;
      
      console.log('User summaries after delete:', userSummariesAfterDelete.length);
      console.log('User still has uploads:', userStillHasUploads);
      
      setHasUploaded(userStillHasUploads);
      
      // עדכון רשימת הסיכומים
      if (!userStillHasUploads) {
        const summariesWithLock = updatedSummaries.map(summary => ({
          ...summary,
          isLocked: summary.uploadedBy !== user?.uid
        }));
        setSummaries(summariesWithLock);
      } else {
        setSummaries(updatedSummaries);
      }
      
    } catch (error) {
      console.error('Error deleting summary from Firebase:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User detected, loading summaries for:', user.displayName);
      loadSummariesFromFirebase();
      
      const summariesRef = collection(db, 'summaries');
      const unsubscribe = onSnapshot(summariesRef, () => {
        console.log('Real-time update detected');
        loadSummariesFromFirebase();
      });
      
      return () => unsubscribe();
    } else {
      console.log('No user detected yet, waiting...');
      setIsLoading(true);
    }
  }, [user]);


  const filteredSummaries = summaries.filter(summary => {
    const isApproved = summary.status === 'מאושר';
    const isOwnSummary = summary.uploadedBy === currentUserId;
    
    // הצג סיכומים מאושרים לכולם, וסיכומים של המשתמש עצמו (כולל ממתינים/נדחים)
    if (!isApproved && !isOwnSummary) {
      return false;
    }
    
    const matchesSearch = searchQuery === "" || 
      summary.title.includes(searchQuery) || 
      summary.course.includes(searchQuery) || 
      summary.professor.includes(searchQuery);
    
    const matchesCourse = selectedCourse === "" || summary.course === selectedCourse;
    const matchesProfessor = selectedProfessor === "" || summary.professor === selectedProfessor;
    
    return matchesSearch && matchesCourse && matchesProfessor;
  });

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

  const handleUploadSuccess = async (uploadedSummary) => {
    console.log('Upload success - starting Firebase save process...');
    
    if (!user?.uid) {
      alert('שגיאה: לא ניתן לזהות את המשתמש');
      return;
    }
    
    const summaryWithUserId = {
      ...uploadedSummary,
      uploadedBy: user.uid,
      author: user.displayName || user.email,
      isLocked: false,
      status: 'ממתין לאישור',
      uploadedAt: new Date().toISOString()
    };

    try {
      // שמירה ב-Firebase
      const docRef = await addDoc(collection(db, 'summaries'), summaryWithUserId);
      console.log('Saved to Firebase with ID:', docRef.id);
      
      // עדכון המצב מיד אחרי העלאה
      setHasUploaded(true);
      
      // הוספת הסיכום החדש לרשימה עם ה-ID מ-Firebase
      const summaryWithFirebaseId = {
        ...summaryWithUserId,
        id: docRef.id
      };
      
      setSummaries(prevSummaries => {
        const newSummaries = [summaryWithFirebaseId, ...prevSummaries.map(s => ({ ...s, isLocked: false }))];
        console.log('Updated summaries state, new count:', newSummaries.length);
        return newSummaries;
      });
      
      alert("הסיכום הועלה בהצלחה! כעת יש לך גישה מלאה לכל הסיכומים בספרייה.");
      setIsDialogOpen(false);
      
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      alert('שגיאה בשמירת הסיכום. נסה שוב.');
    }
  };

  const uniqueCourses = [...new Set(summaries.map(summary => summary.course))];
  const uniqueProfessors = [...new Set(summaries.map(summary => summary.professor))];

  if (isLoading) {
    return (
      <div className="summary-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>טוען סיכומים...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-container">
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
        
        <div className="filter-summary-container">
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
        
        <div className="filter-summary-container">
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
        
        <div className="filter-summary-container">
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
              onDelete={deleteSummaryFromFirebase}
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