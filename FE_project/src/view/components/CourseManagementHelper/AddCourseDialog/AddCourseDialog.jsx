import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import DialogComponent from "../DialogComponent/DialogComponent";
import "./AddCourseDialog.css";

const AddCourseDialog = ({ isOpen, onClose, onAddSuccess }) => {
  const [courseName, setCourseName] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [credits, setCredits] = useState("");
  const [semester, setSemester] = useState("סמסטר ב'");
  const [courseCode, setCourseCode] = useState("");
  const [department, setDepartment] = useState("");
  const [courseType, setCourseType] = useState("חובה");
  const [description, setDescription] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const semesterOptions = ["סמסטר א'", "סמסטר ב'", "סמסטר ג'", "קיץ"];
  const courseTypeOptions = ["חובה", "בחירה", "רפואה מקדמת", "מעבדה", "פרויקט"];

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseName.trim() || !lecturer.trim() || !credits) return;
    
    setIsLoading(true);
    
    try {
      const userId = getCurrentUserId();
      const newCourse = {
        // שדות בסיסיים
        name: courseName.trim(),
        lecturer: lecturer.trim(),
        credits: Number(credits),
        courseCode: courseCode.trim() || `COURSE-${Date.now()}`,
        department: department.trim() || "כללי",
        courseType,
        semester,
        description: description.trim(),
        syllabus: syllabus.trim(),
        
        // הגדרות קורס
        maxStudents: maxStudents ? Number(maxStudents) : null,
        currentStudents: 0,
        isActive: true,
        isPublic: true,
        
        // מטאדטה
        userId,
        instructorId: userId,
        assistants: [],
        
        // תכנים קשורים
        assignments: [],
        exams: [],
        lectures: [],
        materials: [],
        announcements: [],
        discussions: [],
        
        // סטטיסטיקות
        totalAssignments: 0,
        completedAssignments: 0,
        averageGrade: 0,
        attendanceRate: 0,
        studentSatisfaction: 0,
        
        // ציונים ודרישות
        gradeDistribution: {
          "A": 0,
          "B": 0,
          "C": 0,
          "D": 0,
          "F": 0
        },
        requirements: {
          attendance: 80,
          assignments: 70,
          finalExam: 60
        },
        
        // לוח זמנים
        schedule: {
          days: [],
          startTime: "",
          endTime: "",
          location: "",
          room: "",
          building: ""
        },
        
        // הגדרות התראות
        notifications: {
          assignmentReminders: true,
          examReminders: true,
          lectureReminders: true,
          announcementNotifications: true
        },
        
        // משאבים חיצוניים
        resources: {
          textbook: "",
          onlineResources: [],
          supplementaryMaterial: [],
          requiredSoftware: []
        },
        
        // הערכה ומשוב
        evaluationCriteria: {
          assignments: 40,
          midtermExam: 30,
          finalExam: 30,
          participation: 0
        },
        
        // תאריכים חשובים
        importantDates: {
          registrationDeadline: null,
          dropDeadline: null,
          midtermDate: null,
          finalExamDate: null
        },
        
        // שפה ואזור
        language: "עברית",
        timezone: "Asia/Jerusalem",
        
        // תאריכים
        startDate: null,
        endDate: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // הוספה ל-Firebase
      const docRef = await addDoc(collection(db, "courses"), newCourse);
      console.log("קורס נוסף בהצלחה עם ID:", docRef.id);
      
      // קריאה לפונקציה מהקומפוננטה האב אם נדרש
      if (onAddSuccess) {
        onAddSuccess({ ...newCourse, id: docRef.id });
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error("שגיאה בהוספת קורס:", error);
      alert("שגיאה בהוספת הקורס. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setLecturer("");
    setCredits("");
    setCourseCode("");
    setDepartment("");
    setSemester("סמסטר ב'");
    setCourseType("חובה");
    setDescription("");
    setSyllabus("");
    setMaxStudents("");
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <DialogComponent 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="הוספת קורס חדש"
    >
      <form onSubmit={handleSubmit} className="dialog-form">
        <div className="form-field">
          <label>שם הקורס *</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="הכנס שם קורס"
            required={true}
            autoFocus
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>קוד קורס</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="למשל: CS101"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>שם המרצה *</label>
          <input
            type="text"
            value={lecturer}
            onChange={(e) => setLecturer(e.target.value)}
            placeholder="הכנס שם מרצה"
            required={true}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>מחלקה</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="למשל: מדעי המחשב"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>תיאור הקורס</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="תאר את תוכן הקורס ומטרותיו"
            rows="3"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>סילבוס</label>
          <textarea
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            placeholder="פרט את נושאי הקורס והתכנית הלימודית"
            rows="4"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>נקודות זכות *</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="מספר נקודות זכות"
            required={true}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>מספר סטודנטים מקסימלי</label>
          <input
            type="number"
            min="1"
            max="500"
            value={maxStudents}
            onChange={(e) => setMaxStudents(e.target.value)}
            placeholder="מספר מקסימלי של סטודנטים"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-field">
          <label>סמסטר</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            disabled={isLoading}
          >
            {semesterOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="form-field">
          <label>סוג קורס</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            disabled={isLoading}
          >
            {courseTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="dialog-actions">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="button button-secondary"
            disabled={isLoading}
          >
            ביטול
          </button>
          <button 
            type="submit" 
            className="button button-primary"
            disabled={isLoading || !courseName.trim() || !lecturer.trim() || !credits}
          >
            {isLoading ? "מוסיף..." : "הוסף קורס"}
          </button>
        </div>
      </form>
    </DialogComponent>
  );
};

export default AddCourseDialog;