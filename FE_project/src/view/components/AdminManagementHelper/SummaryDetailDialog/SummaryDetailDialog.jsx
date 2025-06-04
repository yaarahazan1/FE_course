import React, { useState } from "react";
import { XCircle, CheckCircle, Trash2 } from "lucide-react";
import "./SummaryDetailDialog.css";

// Cloudinary configuration - זהה לזה שב-SummaryLibrary
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
    
    console.log('Admin attempting to delete from Cloudinary:', {
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
      console.log('File deleted successfully from Cloudinary by admin');
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

const deleteSummaryFromStorage = async (summaryId) => {
  try {
    console.log('Admin deleting summary from storage:', summaryId);
    
    const savedSummaries = localStorage.getItem('uploaded_summaries');
    if (savedSummaries) {
      const summariesArray = JSON.parse(savedSummaries);
      const updatedSummaries = summariesArray.filter(summary => 
        summary.id !== summaryId && summary.public_id !== summaryId
      );
      
      localStorage.setItem('uploaded_summaries', JSON.stringify(updatedSummaries));
      console.log('Updated localStorage after admin deletion, remaining summaries:', updatedSummaries.length);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting summary from storage:', error);
    throw error;
  }
};

const SummaryDetailDialog = ({
  summary,
  isOpen,
  onOpenChange,
  feedbackText,
  onFeedbackChange,
  onSummaryAction,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!summary || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const handleCompleteDeletion = async () => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק לצמיתות את הסיכום "${summary.title}"? פעולה זו תמחק את הקובץ גם מהשרת ואינה ניתנת לביטול.`)) {
      setIsDeleting(true);
      
      try {
        console.log('Admin starting complete deletion process for:', summary.public_id || summary.id);
        
        let cloudinaryDeleted = true;
        
        if (summary.public_id) {
          cloudinaryDeleted = await deleteFromCloudinary(summary.public_id);
        }
        
        if (cloudinaryDeleted) {
          await deleteSummaryFromStorage(summary.id);
          
          onSummaryAction("מחיקה", summary.id);
          
          alert("הסיכום נמחק בהצלחה מכל המקומות!");
        } else {
          const shouldContinue = window.confirm(
            "לא הצלחנו למחוק את הקובץ מהשרת (Cloudinary). זה יכול להיות בגלל בעיית רשת או הרשאות.\n\n" +
            "האם ברצונך למחוק אותו רק מהממשק? (הקובץ עדיין יישאר בשרת)"
          );
          
          if (shouldContinue) {
            await deleteSummaryFromStorage(summary.id);
            onSummaryAction("מחיקה", summary.id);
            alert("הסיכום נמחק מהממשק בלבד.\nהקובץ עדיין קיים בשרת Cloudinary.");
          }
        }
      } catch (error) {
        console.error('Error in complete deletion:', error);
        alert("שגיאה במחיקת הסיכום: " + error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="summary-dialog-overlay" onClick={handleBackdropClick}>
      <div className="summary-dialog-content">
        <div className="summary-dialog-header">
          <h2 className="summary-dialog-title">פרטי סיכום</h2>
          <p className="summary-dialog-subtitle">צפייה בסיכום ושליחת משוב</p>
          <button 
            className="summary-dialog-close"
            onClick={() => onOpenChange(false)}
          >
            ✕
          </button>
        </div>

        <div className="summary-dialog-body">
          <div className="summary-info-grid">
            <div className="summary-info-item">
              <span className="summary-info-label">כותרת:</span>
              <span className="summary-info-value">{summary.title}</span>
            </div>
            <div className="summary-info-item">
              <span className="summary-info-label">מחבר:</span>
              <span className="summary-info-value">{summary.author}</span>
            </div>
            <div className="summary-info-item">
              <span className="summary-info-label">תאריך העלאה:</span>
              <span className="summary-info-value">{summary.date}</span>
            </div>
          </div>

          <div className="summary-content-section">
            <div className="summary-content-label">תוכן הסיכום:</div>
            <div className="summary-content-text">
              {summary.content || "זהו תוכן הסיכום לדוגמה. במערכת אמיתית, כאן יוצג תוכן הסיכום המלא שהועלה על ידי המשתמש."}
            </div>
          </div>

          <div className="summary-feedback-section">
            <label className="summary-feedback-label">משוב למשתמש:</label>
            <textarea
              className="summary-feedback-textarea"
              value={feedbackText}
              onChange={onFeedbackChange}
              placeholder="הכנס כאן משוב למשתמש (אופציונלי)"
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
            className="summary-dialog-btn summary-delete-btn"
            onClick={handleCompleteDeletion}
            disabled={isDeleting}
            style={{ 
              opacity: isDeleting ? 0.5 : 1,
              backgroundColor: '#dc3545',
              borderColor: '#dc3545'
            }}
          >
            <Trash2 className="btn-icon" />
            {isDeleting ? 'מוחק...' : 'מחיקה מלאה'}
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