import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./StudyGroupDialog.css";

const StudyGroupDialog = ({ isOpen, onClose, currentUser }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
    { key: "sunday", label: "ראשון" },
    { key: "monday", label: "שני" },
    { key: "tuesday", label: "שלישי" },
    { key: "wednesday", label: "רביעי" },
    { key: "thursday", label: "חמישי" },
    { key: "friday", label: "שישי" },
    { key: "saturday", label: "שבת" }
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
      meetingDays: prev.meetingDays.includes(day.label)
        ? prev.meetingDays.filter(d => d !== day.label)
        : [...prev.meetingDays, day.label]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedFromStep1 = formData.title.trim() && formData.course.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canProceedFromStep1 || isLoading) return;

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
      setCurrentStep(1);
      
      onClose();
      
      // Success notification
      const successDiv = document.createElement('div');
      successDiv.className = 'success-notification';
      successDiv.innerHTML = `
        <div class="notification-content">
          <span>✅ קבוצת הלימוד נוצרה בהצלחה!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (error) {
      console.error("Error creating study group:", error);
      
      // Error notification
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-notification';
      errorDiv.innerHTML = `
        <div class="notification-content">
          <span>❌ שגיאה ביצירת קבוצת הלימוד. נסה שוב.</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay-study" onClick={onClose}>
      <div className="study-group-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="dialog-header">
          <h2>צור קבוצת לימוד</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          </div>
          <div className="progress-line">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="study-group-form">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>פרטים בסיסיים</h3>
              
              <div className="input-group">
                <label>שם הקבוצה *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="למשל: קבוצת לימוד מתמטיקה"
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label>קורס/מקצוע *</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  placeholder="למשל: מתמטיקה דיסקרטית"
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <label>תיאור הקבוצה</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="תאר את מטרות הקבוצה ואת סגנון הלימוד..."
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Meeting Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>פרטי מפגש</h3>
              
              <div className="form-row">
                <div className="input-group">
                  <label>סוג מפגש</label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => handleInputChange("meetingType", e.target.value)}
                    className="form-select"
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
                    className="form-input"
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
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <label>שעה מועדפת</label>
                <input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                  className="form-input time-input"
                />
              </div>

              <div className="input-group">
                <label>ימי מפגש</label>
                <div className="days-grid">
                  {meetingDays.map(day => (
                    <button
                      key={day.key}
                      type="button"
                      className={`day-btn ${formData.meetingDays.includes(day.label) ? 'selected' : ''}`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tags */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>תגיות</h3>
              <p className="step-description">בחר תגיות שמתאימות לקבוצת הלימוד שלך</p>
              
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
          )}

          {/* Navigation Buttons */}
          <div className="dialog-actions">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="nav-btn prev-btn"
                onClick={prevStep}
              >
                ← קודם
              </button>
            )}
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              ביטול
            </button>
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                className="nav-btn next-btn"
                onClick={nextStep}
                disabled={currentStep === 1 && !canProceedFromStep1}
              >
                הבא →
              </button>
            ) : (
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!canProceedFromStep1 || isLoading}
              >
                {isLoading ? 'יוצר...' : 'צור קבוצה'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyGroupDialog;