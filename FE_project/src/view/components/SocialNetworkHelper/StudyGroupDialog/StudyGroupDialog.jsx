import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./StudyGroupDialog.css";

const StudyGroupDialog = ({ isOpen, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    meetingType: "פרונטלי",
    location: "",
    maxMembers: 10,
    tags: [],
    meetingDays: [],
    preferredTime: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const availableTags = [
    "מתמטיקה", "פיזיקה", "כימיה", "ביולוגיה", "היסטוריה", 
    "ספרות", "אנגלית", "מדעי המחשב", "פסיכולוגיה", "כלכלה"
  ];

  const meetingDays = [
    "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      meetingDays: prev.meetingDays.includes(day)
        ? prev.meetingDays.filter(d => d !== day)
        : [...prev.meetingDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.course.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const groupData = {
        title: formData.title.trim(),
        course: formData.course.trim(),
        description: formData.description.trim(),
        meetingType: formData.meetingType,
        location: formData.location.trim(),
        maxMembers: parseInt(formData.maxMembers),
        tags: formData.tags,
        meetingDays: formData.meetingDays,
        preferredTime: formData.preferredTime,
        createdBy: currentUser?.uid || "anonymous",
        createdByName: currentUser?.displayName || "משתמש אנונימי",
        members: [currentUser?.uid || "anonymous"],
        memberNames: [currentUser?.displayName || "משתמש אנונימי"],
        status: "active",
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      };

      await addDoc(collection(db, "studyGroups"), groupData);
      
      // Reset form
      setFormData({
        title: "",
        course: "",
        description: "",
        meetingType: "פרונטלי",
        location: "",
        maxMembers: 10,
        tags: [],
        meetingDays: [],
        preferredTime: ""
      });
      
      onClose();
      alert("קבוצת הלימוד נוצרה בהצלחה!");
      
    } catch (error) {
      console.error("Error creating study group:", error);
      alert("שגיאה ביצירת קבוצת הלימוד. נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="study-group-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>צור קבוצת לימוד חדשה</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="study-group-form">
          <div className="form-section">
            <h3>פרטי בסיסיים</h3>
            
            <div className="input-group">
              <label>שם הקבוצה *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="למשל: 'קבוצת לימוד מתמטיקה'"
                required
              />
            </div>

            <div className="input-group">
              <label>קורס/מקצוע *</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder="למשל: 'מתמטיקה דיסקרטית'"
                required
              />
            </div>

            <div className="input-group">
              <label>תיאור הקבוצה</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="תאר את מטרות הקבוצה, סגנון הלימוד, וכל מידע רלוונטי אחר..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>פרטי מפגש</h3>
            
            <div className="form-row">
              <div className="input-group">
                <label>סוג מפגש</label>
                <select
                  value={formData.meetingType}
                  onChange={(e) => handleInputChange("meetingType", e.target.value)}
                >
                  <option value="פרונטלי">פרונטלי</option>
                  <option value="מקוון">מקוון</option>
                  <option value="היברידי">היברידי</option>
                </select>
              </div>

              <div className="input-group">
                <label>מספר חברים מקסימלי</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={formData.maxMembers}
                  onChange={(e) => handleInputChange("maxMembers", e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>מיקום</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="כתובת או לינק לזום"
              />
            </div>

            <div className="input-group">
              <label>שעה מועדפת</label>
              <input
                type="time"
                value={formData.preferredTime}
                onChange={(e) => handleInputChange("preferredTime", e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>ימי מפגש</h3>
            <div className="days-grid">
              {meetingDays.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`day-btn ${formData.meetingDays.includes(day) ? 'selected' : ''}`}
                  onClick={() => handleDayToggle(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>תגיות</h3>
            <div className="tags-grid">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${formData.tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="dialog-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              ביטול
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.title.trim() || !formData.course.trim() || isLoading}
            >
              {isLoading ? "יוצר..." : "צור קבוצה"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyGroupDialog;