import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  Timestamp 
} from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./EventList.css";

const EventList = ({ currentUser, onCreateEvent}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: ""
  });

  useEffect(() => {
    // Get events from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "socialEvents"),
      where("eventDate", ">=", Timestamp.fromDate(today)),
      orderBy("eventDate", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        eventDate: doc.data().eventDate?.toDate() || new Date()
      }));
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    try {
      const eventDateTime = new Date(newEvent.date);
      if (newEvent.time) {
        const [hours, minutes] = newEvent.time.split(':');
        eventDateTime.setHours(parseInt(hours), parseInt(minutes));
      }

      const eventData = {
        title: newEvent.title.trim(),
        description: newEvent.description.trim(),
        location: newEvent.location.trim(),
        eventDate: Timestamp.fromDate(eventDateTime),
        time: newEvent.time,
        date: newEvent.date,
        createdBy: currentUser?.uid || "anonymous",
        createdByName: currentUser?.displayName || "משתמש אנונימי",
        attendees: [],
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "socialEvents"), eventData);
      
      // Reset form
      setNewEvent({
        title: "",
        date: "",
        time: "",
        description: "",
        location: ""
      });
      setShowAddForm(false);
      
    } catch (error) {
      console.error("Error adding event:", error);
      alert("שגיאה ביצירת האירוע. נסה שוב.");
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את האירוע "${eventTitle}"?`
    );
    
    if (!confirmDelete) return;

    setDeletingEvent(eventId);
    
    try {
      await deleteDoc(doc(db, "socialEvents", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("שגיאה במחיקת האירוע. נסה שוב.");
    } finally {
      setDeletingEvent(null);
    }
  };

  const formatEventDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventDate = date instanceof Date ? date : new Date(date);
    
    if (eventDate.toDateString() === today.toDateString()) {
      return "היום";
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return "מחר";
    } else {
      return eventDate.toLocaleDateString('he-IL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const formatEventTime = (time) => {
    if (!time) return "";
    return time;
  };

  const getEventIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('פגישה') || lowerTitle.includes('ישיבה')) return '🤝';
    if (lowerTitle.includes('מבחן') || lowerTitle.includes('בחינה')) return '📝';
    if (lowerTitle.includes('הרצאה') || lowerTitle.includes('שיעור')) return '🎓';
    if (lowerTitle.includes('יום הולדת') || lowerTitle.includes('חגיגה')) return '🎉';
    if (lowerTitle.includes('אימון') || lowerTitle.includes('ספורט')) return '🏃';
    return '📅';
  };

  if (loading) {
    return (
      <div className="event-box">
        <div className="event-header">אירועים קרובים</div>
        <div className="event-loading">
          <div className="loading-spinner"></div>
          <p>טוען אירועים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-box">
      <div className="event-header">
        <span>אירועים קרובים</span>
        <button 
          className="add-event-btn"
          onClick={onCreateEvent}
          title="הוסף אירוע חדש"
        >
          {showAddForm ? '✕' : '+'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-event-form">
          <form onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="כותרת האירוע"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
              required
            />
            <div className="form-row">
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({...prev, date: e.target.value}))}
                required
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({...prev, time: e.target.value}))}
              />
            </div>
            <input
              type="text"
              placeholder="מיקום (אופציונלי)"
              value={newEvent.location}
              onChange={(e) => setNewEvent(prev => ({...prev, location: e.target.value}))}
            />
            <textarea
              placeholder="תיאור האירוע (אופציונלי)"
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
              rows={3}
            />
            <div className="form-actions">
              <button type="submit" className="submit-btn">הוסף אירוע</button>
              <button 
                type="button" 
                className="cancel-btn-event-list"
                onClick={() => setShowAddForm(false)}
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📅</div>
            <p>אין אירועים קרובים</p>
            <small>לחץ על + כדי להוסיף אירוע חדש</small>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-content">
                <div className="event-icon">
                  {getEventIcon(event.title)}
                </div>
                <div className="event-details">
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">
                    {formatEventTime(event.time) && <span>{formatEventTime(event.time)} • </span>}
                    {formatEventDate(event.eventDate)}
                  </div>
                  {event.location && (
                    <div className="event-location">
                      📍 {event.location}
                    </div>
                  )}
                  {event.description && (
                    <div className="event-description">
                      {event.description}
                    </div>
                  )}
                  <div className="event-creator">
                    נוצר על ידי {event.createdByName}
                  </div>
                </div>
              </div>
              {/* Show delete button for all events temporarily to debug */}
              <div className="event-actions">
                <button
                  className="delete-event-btn"
                  onClick={() => handleDeleteEvent(event.id, event.title)}
                  disabled={deletingEvent === event.id}
                  title="מחק אירוע"
                >
                  {deletingEvent === event.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;