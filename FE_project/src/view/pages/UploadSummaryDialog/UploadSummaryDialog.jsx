import React, { useState } from "react";

const UploadSummaryDialog = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (!title || !course || !file) {
      alert("אנא מלא את כל השדות הנדרשים ובחר קובץ");
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess();
      resetForm();
    }, 1500);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        alert("אנא העלה קובץ PDF בלבד");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("גודל הקובץ המקסימלי הוא 10MB");
        return;
      }

      setFile(selectedFile);
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

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", padding: "2rem", width: "100%", maxWidth: "500px", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "1rem" }}>העלאת סיכום חדש</h2>
        <p style={{ marginBottom: "1.5rem" }}>שתף את הסיכומים שלך עם סטודנטים אחרים וקבל גישה מלאה לספריית הסיכומים.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            placeholder="כותרת הסיכום *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="שם הקורס *"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            placeholder="שם המרצה (לא חובה)"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          />
          <textarea
            placeholder="תיאור קצר (לא חובה)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div>
            <label>בחר קובץ PDF *</label><br />
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {file && (
              <div style={{ marginTop: "0.5rem" }}>
                <p>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                <button onClick={removeFile}>הסר קובץ</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem", gap: "1rem" }}>
          <button onClick={onClose}>ביטול</button>
          <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "טוען..." : "העלה סיכום"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSummaryDialog;
