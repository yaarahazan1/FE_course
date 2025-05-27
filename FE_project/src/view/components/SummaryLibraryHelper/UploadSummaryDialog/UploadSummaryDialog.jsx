import React, { useState } from "react";
import "./UploadSummaryDialog.css";

const UploadSummaryDialog = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleUpload = () => {
    if (!title || !course || !file) {
      showToast("שגיאה", "אנא מלא את כל השדות הנדרשים ובחר קובץ");
      return;
    }

    setIsUploading(true);
    
    // סימולציה של העלאת קובץ
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess();
      resetForm();
      showToast("הצלחה!", "הסיכום הועלה בהצלחה", "success");
    }, 1500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    // בדיקה שהקובץ הוא PDF
    if (selectedFile.type !== "application/pdf") {
      showToast("סוג קובץ לא נתמך", "אנא העלה קובץ PDF בלבד");
      return;
    }
    
    // בדיקת גודל קובץ (מקסימום 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast("קובץ גדול מדי", "גודל הקובץ המקסימלי הוא 10MB");
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
              required={true}/>
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
              required={true}/>
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
              required={true}/>
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
              <label className="upload-form-label">קובץ PDF *</label>
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
                  <p className="upload-file-drop-text">לחץ להעלאת קובץ</p>
                  <p className="upload-file-drop-subtext">או גרור קובץ לכאן</p>
                  <p className="upload-file-drop-info">PDF בלבד, עד 10MB</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
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