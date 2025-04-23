import React, { useState } from "react";
import PageHeader from "../PageHeader";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles.module.css";

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
          <input placeholder="כותרת הסיכום *" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="שם הקורס *" value={course} onChange={(e) => setCourse(e.target.value)} />
          <input placeholder="שם המרצה (לא חובה)" value={professor} onChange={(e) => setProfessor(e.target.value)} />
          <textarea placeholder="תיאור קצר (לא חובה)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
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

  const uniqueCourses = [...new Set(summaries.map(s => s.course))];
  const uniqueProfessors = [...new Set(summaries.map(s => s.professor))];

  const handleUploadSuccess = () => {
    setHasUploaded(true);
    setIsDialogOpen(false);
    alert("סיכום הועלה בהצלחה!");
  };

  const filteredSummaries = summaries
    .filter(s =>
      s.title.includes(searchQuery) ||
      s.course.includes(searchQuery) ||
      s.professor.includes(searchQuery)
    )
    .filter(s =>
      selectedCourse === "all" || s.course === selectedCourse
    )
    .filter(s =>
      selectedProfessor === "all" || s.professor === selectedProfessor
    )
    .sort(() => {
      if (sortBy === "recent") return 0;
      if (sortBy === "rating") return 0;
      if (sortBy === "downloads") return 0;
      return 0;
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "1rem" }}>
      <PageHeader />

      <header style={{ textAlign: "center" }}>
        <h1>ספריית סיכומים</h1>
        <p>גישה מהירה לחומרי לימוד מסוכמים שנאספו על ידי סטודנטים. חפשו, סננו וגלו סיכומים איכותיים לקורסים שלכם.</p>
      </header>

      <div style={{ padding: "1rem", borderRadius: "8px", marginTop: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <input
            type="text"
            placeholder="חפש לפי קורס, מרצה או נושא"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={{ padding: "0.5rem" }}>
            <option value="all">כל הקורסים</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <select value={selectedProfessor} onChange={(e) => setSelectedProfessor(e.target.value)} style={{ padding: "0.5rem" }}>
            <option value="all">כל המרצים</option>
            {uniqueProfessors.map(professor => (
              <option key={professor} value={professor}>{professor}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "0.5rem" }}>
            <option value="recent">הכי חדשים</option>
            <option value="rating">דירוג</option>
            <option value="downloads">הורדות</option>
          </select>
        </div>
      </div>

      <main style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {filteredSummaries.map((s, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "100px" }}>
            <p>{s.title}</p>
            <p style={{ fontSize: "0.85rem", color: "#555" }}>{s.course} - {s.professor}</p>
            {s.locked && !hasUploaded && <p style={{ color: "red" }}>[נעול – העלה סיכום כדי לפתוח]</p>}
          </div>
        ))}
      </main>

      {!hasUploaded && (
        <section style={{ marginTop: "2rem", border: "1px dashed gray", padding: "1rem", textAlign: "center" }}>
          <h3>גישה מוגבלת</h3>
          <p>כדי לצפות בכל הסיכומים עליך להעלות לפחות אחד.</p>
          <button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: "grey", padding: "0.5rem 1rem" }}>העלה סיכום</button>
        </section>
      )}

      <div style={{ position: "fixed", bottom: "1rem", left: "1rem" }}>
        <button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: "grey", padding: "0.5rem 1rem" }}>+ העלה סיכום</button>
      </div>

      <UploadSummaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLinks}>
            <Link to="/HelpSettings" className={styles.footerLink}>עזרה והגדרות</Link>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>תנאי שימוש</div>
            <span className={styles.footerSeparator}>|</span>
            <div className={styles.footerItem}>מדיניות פרטיות</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SummaryLibrary;
