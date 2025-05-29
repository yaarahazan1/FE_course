import React, { useState } from "react";
import { db } from "../../../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import "./UploadSummaryDialog.css";


const UploadSummaryDialog = ({ isOpen, onClose, onUploadSuccess, currentUser }) => {

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const CLOUDINARY_CLOUD_NAME = "doxht9fpl"; 
  const CLOUDINARY_UPLOAD_PRESET = "summaries_preset"; 

  const showToast = (title, description, type = "error") => {
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
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'summaries');
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'שגיאה בהעלאה');
      }
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        size: data.bytes,
        format: data.format
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('שגיאה בהעלאה לשרת. אנא נסי שוב');
    }
  };

  // פונקציה לקבלת שם המשתמש
  const getUserDisplayName = () => {
    if (!currentUser) return "משתמש אנונימי";
    
    // אפשרויות שונות לפי איך המשתמש מוגדר
    return currentUser.displayName || 
           currentUser.name || 
           currentUser.email || 
           currentUser.username || 
           "משתמש רשום";
  };

  const handleUpload = async () => {
    if (!title || !course || !professor || !file) {
      showToast("שגיאה", "אנא מלאי את כל השדות הנדרשים ובחרי קובץ");
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('מתחיל העלאה ל-Cloudinary...');
      
      const uploadResult = await uploadToCloudinary(file);
      
      console.log('העלאה הושלמה:', uploadResult);

      // יצירת metadata עם פרטי המשתמש המחובר
      const summaryData = {
        title: title.trim(),
        course: course.trim(),
        professor: professor.trim(),
        description: description.trim(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        pages: Math.floor(Math.random() * 50) + 1,
        author: getUserDisplayName(), // שינוי כאן!
        authorId: currentUser?.uid || currentUser?.id || null, // הוספת ID המשתמש לזיהוי
        authorEmail: currentUser?.email || null, // הוספת אימייל אם נדרש
        date: new Date().toLocaleDateString('he-IL'),
        uploadDate: new Date().toISOString(),
        id: `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('שומר metadata ב-Firestore...');
      
      const docRef = await addDoc(collection(db, "summaries"), summaryData);
      summaryData.firestoreId = docRef.id;
      
      console.log('נשמר ב-Firestore עם ID:', docRef.id);
      
      await onUploadSuccess(summaryData);
      
      resetForm();
      onClose();
      showToast("הצלחה!", "הסיכום הועלה בהצלחה ונשמר בענן", "success");
      
    } catch (error) {
      console.error("שגיאה בהעלאת הסיכום:", error);
      
      let errorMessage = "אירעה שגיאה בהעלאת הסיכום. אנא נסי שוב";
      
      if (error.message.includes('Invalid cloud name')) {
        errorMessage = "שם הענן של Cloudinary שגוי. בדקי את ההגדרות";
      } else if (error.message.includes('Invalid upload preset')) {
        errorMessage = "Upload Preset שגוי. בדקי את ההגדרות ב-Cloudinary";
      } else if (error.message.includes('File size too large')) {
        errorMessage = "הקובץ גדול מדי. נסי קובץ קטן יותר";
      } else if (error.message.includes('Network')) {
        errorMessage = "בעיה בחיבור לאינטרנט. בדקי את החיבור";
      }
      
      showToast("שגיאה", errorMessage);
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
    if (selectedFile.type !== "application/pdf") {
      showToast("סוג קובץ לא נתמך", "אנא העלי קובץ PDF בלבד");
      return;
    }
    
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (selectedFile.size > maxSize) {
      showToast("קובץ גדול מדי", `גודל הקובץ המקסימלי הוא 20MB`);
      return;
    }
    
    setFile(selectedFile);
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
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDialogClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="upload-dialog-overlay" onClick={handleDialogClose}>
        <div className="upload-dialog-content" onClick={(e) => e.stopPropagation()}>
          <div className="upload-dialog-header">
            <div className="upload-dialog-title">העלאת סיכום חדש</div>
            <div className="upload-dialog-description">
              שתפי את הסיכומים שלך עם סטודנטים אחרים וקבלי גישה מלאה לספריית הסיכומים.
              {currentUser && (
                <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
                  מעלה: {getUserDisplayName()}
                </div>
              )}
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
                disabled={isUploading}
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
                disabled={isUploading}
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
                disabled={isUploading}
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
                disabled={isUploading}
              />
            </div>
            
            <div className="upload-form-field">
              <label className="upload-form-label">קובץ PDF * (עד 20MB)</label>
              {!file ? (
                <div 
                  className={`upload-file-drop-zone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'disabled' : ''}`}
                  onClick={!isUploading ? handleFileUploadClick : undefined}
                  onDragOver={!isUploading ? handleDragOver : undefined}
                  onDragLeave={!isUploading ? handleDragLeave : undefined}
                  onDrop={!isUploading ? handleDrop : undefined}
                >
                  <svg className="upload-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  <p className="upload-file-drop-text">
                    {isUploading ? "מעלה קובץ לענן..." : "לחצי להעלאת קובץ"}
                  </p>
                  {!isUploading && (
                    <>
                      <p className="upload-file-drop-subtext">או גררי קובץ לכאן</p>
                      <p className="upload-file-drop-info">PDF בלבד, עד 20MB</p>
                      <p className="upload-file-drop-info">📁 יישמר בענן עם Cloudinary</p>
                    </>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="upload-hidden-input"
                    onChange={handleFileChange}
                    disabled={isUploading}
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
                  {!isUploading && (
                    <button className="upload-remove-file-btn" onClick={removeFile} type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="upload-dialog-footer">
            <button 
              className="upload-btn upload-btn-outline" 
              onClick={handleDialogClose} 
              type="button"
              disabled={isUploading}
            >
              ביטול
            </button>
            <button 
              className="upload-btn upload-btn-primary" 
              onClick={handleUpload} 
              disabled={isUploading || !title || !course || !professor || !file} 
              type="button"
            >
              {isUploading ? (
                <>
                  <div style={{ display: 'inline-block', marginRight: '8px' }}>
                    🔄
                  </div>
                  מעלה לענן...
                </>
              ) : (
                <>
                  <svg className="upload-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  העלי סיכום
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