import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./EventDialog.css";

const EventDialog = ({ isOpen, onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    eventType: "אקדמי",
    maxAttendees: "",
    isPublic: true,
    tags: [],
    reminderTime: "15"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const eventTypes = [
    { value: "אקדמי", emoji: "🎓", color: "#3B82F6" },
    { value: "חברתי", emoji: "🎉", color: "#10B981" },
    { value: "ספורט", emoji: "🏃", color: "#EF4444" },
    { value: "תרבות", emoji: "🎭", color: "#8B5CF6" },
    { value: "מזון", emoji: "🍕", color: "#F59E0B" },
    { value: "עבודה", emoji: "💼", color: "#6B7280" }
  ];

  const availableTags = [
    { name: "מבחן", color: "#EF4444" },
    { name: "פרויקט", color: "#3B82F6" },
    { name: "הרצאה", color: "#8B5CF6" },
    { name: "סדנה", color: "#10B981" },
    { name: "מפגש", color: "#F59E0B" },
    { name: "חגיגה", color: "#EC4899" }
  ];

  const reminderOptions = [
    { value: "5", label: "5 דקות לפני" },
    { value: "15", label: "15 דקות לפני" },
    { value: "30", label: "30 דקות לפני" },
    { value: "60", label: "שעה לפני" },
    { value: "1440", label: "יום לפני" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName) 
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || isLoading) return;

    setIsLoading(true);
    try {
      const eventDate = new Date(formData.date);
      if (formData.startTime) {
        const [hours, minutes] = formData.startTime.split(':');
        eventDate.setHours(parseInt(hours), parseInt(minutes));
      }

      let endDateTime = null;
      if (formData.endTime) {
        endDateTime = new Date(formData.date);
        const [endHours, endMinutes] = formData.endTime.split(':');
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
      }

      const selectedEventType = eventTypes.find(type => type.value === formData.eventType);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: Timestamp.fromDate(eventDate),
        endDate: endDateTime ? Timestamp.fromDate(endDateTime) : null,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location.trim(),
        eventType: formData.eventType,
        eventTypeEmoji: selectedEventType?.emoji || "📅",
        eventTypeColor: selectedEventType?.color || "#3B82F6",
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        isPublic: formData.isPublic,
        tags: formData.tags,
        reminderTime: parseInt(formData.reminderTime),
        createdBy: currentUser?.uid || "anonymous",
        createdByName: currentUser?.displayName || "משתמש אנונימי",
        attendees: [currentUser?.uid || "anonymous"],
        attendeeNames: [currentUser?.displayName || "משתמש אנונימי"],
        status: "active",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      await addDoc(collection(db, "socialEvents"), eventData);
      
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        eventType: "אקדמי",
        maxAttendees: "",
        isPublic: true,
        tags: [],
        reminderTime: "15"
      });
      
      setCurrentStep(1);
      onClose();
      
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.eventType;
      case 2:
        return formData.date;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay-event-dialog" onClick={onClose}>
      <div className="event-dialog" onClick={(e) => e.stopPropagation()}>
        
        <div className="dialog-header">
          <h2>יצירת אירוע חדש</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="steps-indicator">
          <div className="steps-container">
            {[1, 2, 3].map(step => (
              <div key={step} className={`step-event-dialog ${currentStep >= step ? 'active' : ''}`}>
                <span className="step-number">{step}</span>
                <span className="step-label">
                  {step === 1 && "פרטים בסיסיים"}
                  {step === 2 && "זמן ומקום"}
                  {step === 3 && "הגדרות"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          
          {/* שלב 1: פרטים בסיסיים */}
          {currentStep === 1 && (
            <div className="form-step-event-dialog">
              <div className="form-group-event-dialog">
                <label>שם האירוע *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="הזן שם לאירוע"
                  required
                />
              </div>

              <div className="form-group-event-dialog">
                <label>תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="תאר את האירוע (אופציונלי)"
                  rows={3}
                />
              </div>

              <div className="form-group-event-dialog">
                <label>סוג האירוע *</label>
                <div className="event-types">
                  {eventTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`event-type ${formData.eventType === type.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange("eventType", type.value)}
                      style={{ '--type-color': type.color }}
                    >
                      <span className="type-emoji">{type.emoji}</span>
                      <span className="type-name">{type.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* שלב 2: זמן ומקום */}
          {currentStep === 2 && (
            <div className="form-step-event-dialog">
              <div className="form-row">
                <div className="form-group-event-dialog">
                  <label>תאריך *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getMinDate()}
                    required
                  />
                </div>

                <div className="form-group-event-dialog">
                  <label>שעת התחלה</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group-event-dialog">
                  <label>שעת סיום</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    min={formData.startTime}
                  />
                </div>

                <div className="form-group-event-dialog">
                  <label>תזכורת</label>
                  <select
                    value={formData.reminderTime}
                    onChange={(e) => handleInputChange("reminderTime", e.target.value)}
                  >
                    {reminderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group-event-dialog">
                <label>מיקום</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="איפה האירוע יתקיים?"
                />
              </div>
            </div>
          )}

          {/* שלב 3: הגדרות */}
          {currentStep === 3 && (
            <div className="form-step-event-dialog">
              <div className="form-row">
                <div className="form-group-event-dialog">
                  <label>מספר משתתפים מקסימלי</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                    placeholder="ללא הגבלה"
                  />
                </div>

                <div className="form-group-event-dialog">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                    />
                    אירוע ציבורי
                  </label>
                </div>
              </div>

              <div className="form-group-event-dialog">
                <label>תגים</label>
                <div className="tags-container">
                  {availableTags.map(tag => (
                    <button
                      key={tag.name}
                      type="button"
                      className={`tag ${formData.tags.includes(tag.name) ? 'selected' : ''}`}
                      onClick={() => handleTagToggle(tag.name)}
                      style={{ '--tag-color': tag.color }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* כפתורי ניווט */}
          <div className="form-actions">
            <div className="actions-left">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  קודם
                </button>
              )}
            </div>
            
            <div className="actions-right">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={onClose}
                disabled={isLoading}
              >
                ביטול
              </button>
              
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  הבא
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!formData.title.trim() || !formData.date || isLoading}
                >
                  {isLoading ? "יוצר..." : "צור אירוע"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventDialog;