import React, { useState } from "react";
import "./UploadSummaryDialog.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../../../../firebase/config";

const UploadSummaryDialog = ({ isOpen, onClose, onUploadSuccess, cloudinaryConfig }) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [user] = useAuthState(auth);

  const showToast = (title, description, type = "error") => {
    // יצירת toast פשוט
    const toast = document.createElement('div');
    toast.className = `upload-toast ${type}`;
    toast.innerHTML = `
      <div class="upload-toast-title">${title}</div>
      <div class="upload-toast-description">${description}</div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const uploadToCloudinary = async (file) => {
    try {
      // נתחיל עם הגישה הכי פשוטה - רק הפרמטרים החיוניים
      const formData = new FormData();
      
      // רק הפרמטרים הבסיסיים ביותר
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.upload_preset);

      console.log('Uploading to Cloudinary with minimal config:', {
        cloud_name: cloudinaryConfig.cloud_name,
        upload_preset: cloudinaryConfig.upload_preset,
        file_size: file.size,
        file_type: file.type,
        file_name: file.name
      });

      // נשתמש ב-auto upload - Cloudinary יחליט איך לטפל בקובץ
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/auto/upload`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      // בדיקת תגובה ופרטי שגיאה
      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Cloudinary error details:', errorData);
          
          if (errorData.error && errorData.error.message) {
            const cloudinaryError = errorData.error.message;
            console.error('Cloudinary specific error:', cloudinaryError);
            
            // טיפול מיוחד בשגיאות נפוצות
            if (cloudinaryError.includes('not allowed') || cloudinaryError.includes('Invalid')) {
              errorMessage = `שגיאת הגדרות Cloudinary: ${cloudinaryError}\n\nפתרונות:\n1. בדוק שה-Upload Preset "${cloudinaryConfig.upload_preset}" קיים ב-Cloudinary Dashboard\n2. וודא שה-Upload Preset מוגדר כ-"Unsigned"\n3. בדוק ש"Mode" מוגדר כ-"Unsigned" (לא "Signed")\n4. וודא שאין הגבלות על סוג קבצים בהגדרות`;
            } else if (cloudinaryError.includes('Access control') || cloudinaryError.includes('Blocked')) {
              errorMessage = `בעיית הרשאות: ${cloudinaryError}\n\nפתרונות:\n1. בדוק את הגדרות Security ב-Cloudinary\n2. וודא שאין חסימה על קבצים מסוג זה\n3. בדוק הגדרות Access Control`;
            } else {
              errorMessage = `Cloudinary Error: ${cloudinaryError}`;
            }
          }
        } catch (e) {
          console.error('Error parsing Cloudinary response:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload successful with result:', result);
      
      return result;
      
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!title || !course || !professor || !file) {
      showToast("שגיאה", "אנא מלא את כל השדות הנדרשים ובחר קובץ");
      return;
    }

    setIsUploading(true);
    
    try {
      const metadata = {
        title,
        course,
        professor,
        description
      };

      console.log('Starting upload process...');
      
      // העלאה ל-Cloudinary
      const uploadResult = await uploadToCloudinary(file, metadata);
      
      console.log('Upload result:', uploadResult);
      
      // יצירת אובייקט הסיכום החדש
      const newSummary = {
        id: uploadResult.public_id,
        public_id: uploadResult.public_id,
        title: title,
        author: user.displayName || user.email || "משתמש לא מזוהה",
        date: new Date().toLocaleDateString('he-IL'),
        course: course,
        professor: professor,
        description: description,
        rating: 5,
        downloads: 0,
        pages: Math.floor(Math.random() * 20) + 5,
        isLocked: false,
        size: file.size,
        cloudinaryUrl: uploadResult.secure_url,
        fileUrl: uploadResult.secure_url,
        originalFilename: file.name,
        fileType: file.type
      };

      console.log('Created summary object:', newSummary);

      // קריאה לפונקציה שמעדכנת את הקומפוננט הראשי
      onUploadSuccess(newSummary);
      resetForm();
      showToast("הצלחה!", "הסיכום הועלה בהצלחה", "success");
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // הצגת הודעת שגיאה מפורטת יותר
      let errorMessage = "שגיאה לא ידועה בהעלאת הקובץ";
      
      if (error.message.includes('Access control') || error.message.includes('Blocked')) {
        errorMessage = error.message;
      } else if (error.message.includes('Upload failed: 400')) {
        errorMessage = "שגיאה בהגדרות Cloudinary.\n\nבדוק:\n1. ה-Upload Preset נכון ותקין\n2. הפרמטרים מותרים בהגדרות\n3. סוג הקובץ נתמך";
      } else if (error.message.includes('Upload failed: 401')) {
        errorMessage = "שגיאת הרשאה.\n\nבדוק:\n1. שם החשבון (Cloud Name) נכון\n2. ה-Upload Preset קיים ומוגדר כ-Unsigned";
      } else if (error.message.includes('Upload failed: 403')) {
        errorMessage = "הגישה נדחתה.\n\nבדוק:\n1. הגדרות ה-Upload Preset\n2. Security Settings ב-Cloudinary\n3. הגבלות על סוג הקובץ";
      } else if (error.message.includes('network')) {
        errorMessage = "שגיאת רשת. בדוק את החיבור לאינטרנט ונסה שוב";
      } else if (error.message.includes('not allowed')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast("שגיאה בהעלאה", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    // בדיקה שהקובץ הוא רק DOCX או DOC
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword" // .doc (legacy)
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      showToast("סוג קובץ לא נתמך", "אנא העלה קובץ WORD (DOC או DOCX) בלבד");
      return;
    }
    
    // בדיקת גודל קובץ (מקסימום 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast("קובץ גדול מדי", "גודל הקובץ המקסימלי הוא 10MB");
      return;
    }
    
    setFile(selectedFile);
    console.log('File selected:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCourse("");
    setProfessor("");
    setDescription("");
    setFile(null);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleFileUploadClick = () => {
    document.getElementById("file-upload")?.click();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="upload-dialog-overlay" onClick={onClose}>
        <div className="upload-dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="upload-dialog-header">
            <div className="upload-dialog-title">העלאת סיכום חדש</div>
            <div className="upload-dialog-description">
              שתף את הסיכומים שלך עם סטודנטים אחרים וקבל גישה מלאה לספריית הסיכומים.
            </div>
          </div>
          
          <div className="upload-dialog-body">
            <div className="upload-form-field">
              <label htmlFor="title" className="upload-form-label">כותרת הסיכום *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="upload-form-input"
                placeholder="לדוגמה: סיכום מבוא לסטטיסטיקה - פרק 3"
                required={true}
              />
            </div>
            
            <div className="upload-form-field">
              <label htmlFor="course" className="upload-form-label">קורס *</label>
              <input
                id="course"
                type="text"
                value={course}
                className="upload-form-input"
                onChange={(e) => setCourse(e.target.value)}
                placeholder="שם הקורס"
                required={true}
              />
            </div>
            
            <div className="upload-form-field">
              <label htmlFor="professor" className="upload-form-label">מרצה *</label>
              <input
                id="professor"
                type="text"
                value={professor}
                className="upload-form-input"
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="שם המרצה"
                required={true}
              />
            </div>
            
            <div className="upload-form-field">
              <label htmlFor="description" className="upload-form-label">תיאור (אופציונלי)</label>
              <textarea
                id="description"
                value={description}
                className="upload-form-textarea"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="תיאור קצר של תוכן הסיכום"
                rows={3}
              />
            </div>
            
            <div className="upload-form-field">
              <label className="upload-form-label">קובץ מסמך *</label>
              <div className="upload-file-info-box">
                <p><strong>חשוב: </strong>העלאת קבצי WORD בלבד (DOC או DOCX)</p>
              </div>
              {!file ? (
                <div 
                  className={`upload-file-drop-zone ${isDragOver ? 'drag-over' : ''}`}
                  onClick={handleFileUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <svg className="upload-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  <p className="upload-file-drop-text">לחץ להעלאת קובץ WORD</p>
                  <p className="upload-file-drop-subtext">או גרור קובץ לכאן</p>
                  <p className="upload-file-drop-info">DOC או DOCX בלבד, עד 10MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                    className="upload-hidden-input"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="upload-file-preview">
                  <div className="upload-file-info">
                    <svg className="upload-file-preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    <div className="upload-file-details">
                      <p className="upload-file-name">{file.name}</p>
                      <p className="upload-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button className="upload-remove-file-btn" onClick={removeFile} type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="upload-dialog-footer">
            <button className="upload-btn upload-btn-outline" onClick={onClose} type="button">
              ביטול
            </button>
            <button className="upload-btn upload-btn-primary" onClick={handleUpload} disabled={isUploading} type="button">
              {isUploading ? (
                <>טוען...</>
              ) : (
                <>
                  <svg className="upload-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  העלה סיכום
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadSummaryDialog;