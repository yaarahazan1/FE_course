import React, { useState, useEffect } from "react";
import { XCircle, CheckCircle, Eye, Download } from "lucide-react";
import "./SummaryDetailDialog.css";

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloud_name: 'doxht9fpl'
};

const SummaryDetailDialog = ({
  summary,
  isOpen,
  onOpenChange,
  feedbackText,
  onFeedbackChange,
  onSummaryAction,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  if (!summary || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const handlePreview = async () => {
    if (!summary.public_id) {
      alert("לא ניתן לפתוח תצוגה מקדימה - קובץ לא זמין");
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
              onClick={() => {
                setCurrentViewerIndex(0);
                setError(null);
                setIsLoading(true);
                
                const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/raw/upload/${summary.public_id}`;
                const firstViewer = isDocFile ? 
                  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(directUrl)}` :
                  `https://docs.google.com/viewer?url=${encodeURIComponent(directUrl)}&embedded=true`;
                
                setPreviewUrl(firstViewer);
                setTimeout(() => setIsLoading(false), 1000);
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
          </div>
        </div>
      );
    }

    return (
      <div style={{ height: '100%', position: 'relative' }}>
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
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  };

  const getFileExtension = (publicId) => {
    if (publicId && publicId.includes('.')) {
      return publicId.split('.').pop().toLowerCase();
    }
    return 'unknown';
  };

  const handleDownload = async () => {
    if (!summary.public_id) {
      alert("לא ניתן להוריד את הקובץ - קובץ לא זמין");
      return;
    }

    try {
      setIsDownloading(true);
      
      console.log('Summary public_id:', summary.public_id);
      
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
      
      // אם יש URL ישיר, השתמש בו
      if (summary.fileUrl) {
        console.log('Using direct file URL:', summary.fileUrl);
        
        const link = document.createElement('a');
        link.href = summary.fileUrl;
        link.download = fileName;
        link.target = '_blank'; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
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
            link.download = fileName;
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
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

  return (
    <div className="summary-dialog-overlay" onClick={handleBackdropClick}>
      <div className="summary-dialog-content">
        <div className="summary-dialog-header">
          <h2 className="summary-dialog-title">פרטי סיכום</h2>
          <p className="summary-dialog-description">צפייה בסיכום ושליחת משוב</p>
        </div>
        
        <div className="summary-dialog-body">
          <div className="summary-info-grid">
            <div className="summary-info-row">
              <div className="summary-info-label">כותרת:</div>
              <div className="summary-info-value">{summary.title}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">מחבר:</div>
              <div className="summary-info-value">{summary.author}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">תאריך העלאה:</div>
              <div className="summary-info-value">{summary.date}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">קורס:</div>
              <div className="summary-info-value">{summary.course}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">מרצה:</div>
              <div className="summary-info-value">{summary.professor}</div>
            </div>
            <div className="summary-info-row">
              <div className="summary-info-label">סטטוס:</div>
              <div className="summary-info-value">{summary.status || 'ממתין לאישור'}</div>
            </div>
            {summary.pages && (
              <div className="summary-info-row">
                <div className="summary-info-label">מספר עמודים:</div>
                <div className="summary-info-value">{summary.pages}</div>
              </div>
            )}
          </div>
          
          
          <div className="summary-file-actions">
            <button 
              className="summary-file-btn preview-btn"
              onClick={handlePreview}
              disabled={isDownloading}
              title="תצוגה מקדימה"
            >
              <Eye className="btn-icon" />
              תצוגה מקדימה
            </button>
            <button 
              className="summary-file-btn download-btn"
              onClick={handleDownload}
              title="הורד קובץ"
            >
              <Download className="btn-icon" />
              הורד קובץ
            </button>
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
          )};
          
          <div className="summary-content-section">
            <div className="summary-content-title">תוכן הסיכום:</div>
            <div className="summary-content-box">
              {summary.content || summary.description || "תוכן הסיכום זמין בקובץ המצורף"}
            </div>
            
            <div className="summary-feedback-title">משוב למשתמש:</div>
            <textarea
              className="summary-feedback-textarea"
              placeholder="הוסף משוב או הערות עבור המשתמש..."
              value={feedbackText}
              onChange={onFeedbackChange}
              rows={4}
            />
          </div>
        </div>
        
        <div className="summary-dialog-footer">
          <button 
            className="summary-dialog-btn summary-reject-btn"
            onClick={() => onSummaryAction("דחייה", summary.id)}
          >
            <XCircle className="btn-icon" />
            דחיית הסיכום
          </button>
          <button 
            className="summary-dialog-btn summary-approve-btn"
            onClick={() => onSummaryAction("אישור", summary.id)}
          >
            <CheckCircle className="btn-icon" />
            אישור הסיכום
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetailDialog;