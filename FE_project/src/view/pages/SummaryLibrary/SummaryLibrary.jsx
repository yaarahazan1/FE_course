import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Summarylibrary.css";
import "../../../styles/styles.css";
import PageHeader from "../PageHeader";

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
    const selected = e.target.files?.[0];
    if (selected?.type !== "application/pdf") return alert("PDF בלבד");
    if (selected.size > 10 * 1024 * 1024) return alert("מקסימום 10MB");
    setFile(selected);
  };

  const resetForm = () => {
    setTitle(""); setCourse(""); setProfessor(""); setDescription(""); setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h2>העלאת סיכום חדש</h2>
        <p>שתף את הסיכומים שלך עם סטודנטים אחרים</p>
        <input placeholder="כותרת הסיכום *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="שם הקורס *" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input placeholder="שם המרצה" value={professor} onChange={(e) => setProfessor(e.target.value)} />
        <textarea placeholder="תיאור קצר" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        <div>
          <label>בחר קובץ PDF *</label><br />
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          {file && (
            <div className="file-info">
              <p>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              <button onClick={() => setFile(null)}>הסר קובץ</button>
            </div>
          )}
        </div>
        <div className="dialog-actions">
          <button onClick={onClose}>ביטול</button>
          <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "טוען..." : "העלה סיכום"}
          </button>
        </div>
      </div>
    </div>
  );
};

function SummaryLibrary() {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedProfessor, setSelectedProfessor] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const summaries = [
    { title: "מבוא לסטטיסטיקה", course: "סטטיסטיקה", professor: "פרופ' לוי", locked: false },
    { title: "פסיכולוגיה חברתית", course: "פסיכולוגיה", professor: "ד\"ר גולן", locked: false },
    { title: "אלגוריתמים", course: "מדעי המחשב", professor: "פרופ' כהן", locked: true },
    { title: "אלגברה לינארית", course: "מתמטיקה", professor: "ד\"ר רונית", locked: true },
  ];

  const courses = [...new Set(summaries.map(s => s.course))];
  const profs = [...new Set(summaries.map(s => s.professor))];

  const filtered = summaries
    .filter(s => [s.title, s.course, s.professor].some(f => f.includes(searchQuery)))
    .filter(s => selectedCourse === "all" || s.course === selectedCourse)
    .filter(s => selectedProfessor === "all" || s.professor === selectedProfessor);

  return (
    <div className="summary-wrapper">
      <PageHeader />
      <header className="summary-header">
        <h1>ספריית סיכומים</h1>
        <p>גישה מהירה לחומרי לימוד מסוכמים</p>
      </header>

      <section className="summary-filters">
        <input placeholder="חיפוש..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="all">כל הקורסים</option>
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={selectedProfessor} onChange={(e) => setSelectedProfessor(e.target.value)}>
          <option value="all">כל המרצים</option>
          {profs.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="recent">הכי חדשים</option>
          <option value="rating">דירוג</option>
          <option value="downloads">הורדות</option>
        </select>
      </section>

      <main className="summary-list">
        {filtered.map((s, i) => (
          <div key={i} className="summary-item">
            <p>{s.title}</p>
            <small>{s.course} - {s.professor}</small>
            {s.locked && !hasUploaded && <p className="locked">[נעול – העלה סיכום]</p>}
          </div>
        ))}
      </main>

      {!hasUploaded && (
        <section className="locked-notice">
          <h3>גישה מוגבלת</h3>
          <p>כדי לצפות בכל הסיכומים, עליך להעלות אחד.</p>
          <button className="upload-sum" onClick={() => setIsDialogOpen(true)}>העלה סיכום</button>
        </section>
      )}

      <button className="floating-upload" onClick={() => setIsDialogOpen(true)}>+ העלה סיכום</button>

      <UploadSummaryDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onUploadSuccess={() => {
        setHasUploaded(true);
        setIsDialogOpen(false);
        alert("סיכום הועלה בהצלחה!");
      }} />

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/HelpSettings" className="footer-link">עזרה והגדרות</Link>
            <span className="footer-separator">|</span>
            <div className="footer-item">תנאי שימוש</div>
            <span className="footer-separator">|</span>
            <div className="footer-item">מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SummaryLibrary;
