import React from "react";
import "./EventList.css";

const EventList = ({ events }) => {
  return (
    <div className="event-box">
      <div className="event-header">אירועים קרובים</div>
      <div className="event-list">
        {events.map((event) => (
          <div key={event.id} className="event-item">
            <div className="event-icon">📅</div>
            <div className="event-details">
              <div className="event-title">{event.title}</div>
              <div className="event-time">
                {event.time && <span>{event.time} • </span>}
                {event.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
