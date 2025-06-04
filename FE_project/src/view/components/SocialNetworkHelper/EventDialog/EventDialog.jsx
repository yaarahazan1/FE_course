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

  const eventTypes = [
    { value: "אקדמי", emoji: "🎓", color: "#007bff" },
    { value: "חברתי", emoji: "🎉", color: "#28a745" },
    { value: "ספורט", emoji: "🏃", color: "#fd7e14" },
    { value: "תרבות", emoji: "🎭", color: "#6f42c1" },
    { value: "מזון", emoji: "🍕", color: "#dc3545" },
    { value: "עבודה", emoji: "💼", color: "#6c757d" }
  ];

  const availableTags = [
    "מבחן", "פרויקט", "הרצאה", "סדנה", "מפגש", "חגיגה", 
    "יום הולדת", "אימון", "משחק", "קונצרט", "סרט", "ארוחה"
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

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || isLoading) return;

    setIsLoading(true);
    try {
      // Create event date with time
      const eventDate = new Date(formData.date);
      if (formData.startTime) {
        const [hours, minutes] = formData.startTime.split(':');
        eventDate.setHours(parseInt(hours), parseInt(minutes));
      }

      // Create end date if end time provided
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
        eventTypeColor: selectedEventType?.color || "#007bff",
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
      
      // Reset form
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
      
      onClose();
      alert("האירוע נוצר בהצלחה!");
      
    } catch (error) {
      console.error("Error creating event:", error);
      alert("שגיאה ביצירת האירוע. נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="event-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>צור אירוע חדש</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-section">
            <h3>פרטי האירוע</h3>
            
            <div className="input-group">
              <label>כותרת האירוע *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="למשל: 'מפגש לימוד לקראת המבחן'"
                required
              />
            </div>

            <div className="input-group">
              <label>תיאור האירוע</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="תאר את האירוע, מה יקרה, מה צריך להביא..."
                rows={3}
              />
            </div>

            <div className="input-group">
              <label>סוג האירוע</label>
              <div className="event-types-grid">
                {eventTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`event-type-btn ${formData.eventType === type.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange("eventType", type.value)}
                    style={{
                      borderColor: formData.eventType === type.value ? type.color : undefined,
                      backgroundColor: formData.eventType === type.value ? type.color : undefined,
                      color: formData.eventType === type.value ? 'white' : undefined
                    }}
                  >
                    {type.emoji} {type.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>זמן ומקום</h3>
            
            <div className="form-row">
              <div className="input-group">
                <label>תאריך *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={getMinDate()}
                  required
                />
              </div>
              <div className="input-group">
                <label>שעת התחלה</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>שעת סיום</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  min={formData.startTime}
                />
              </div>
              <div className="input-group">
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

            <div className="input-group">
              <label>מיקום</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="כתובת, חדר, או לינק למפגש מקוון"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>הגדרות נוספות</h3>
            
            <div className="form-row">
              <div className="input-group">
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
              <div className="input-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                  />
                  <span className="checkbox-text">אירוע ציבורי</span>
                </label>
                <small>אירועים ציבוריים נראים לכל המשתמשים</small>
              </div>
            </div>

            <div className="input-group">
              <label>תגיות</label>
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
              disabled={!formData.title.trim() || !formData.date || isLoading}
            >
              {isLoading ? "יוצר..." : "צור אירוע"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventDialog; 