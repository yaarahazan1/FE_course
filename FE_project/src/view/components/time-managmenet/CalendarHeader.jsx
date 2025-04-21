import React from "react";
import { format } from "date-fns";
import { Bookmark, ChevronLeft, User } from "lucide-react";
import "./CalendarHeader.css";

const CalendarHeader = ({
  date,
  view,
  eventType,
  currentWeekDays,
  setDate,
  setView,
  setEventType,
}) => {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  
  return (
    <div className="calendar-header">
      <h2 className="calendar-title">
        <div className="calendar-popover">
          <button 
            className="calendar-date-button"
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            {view === "חודשי"
              ? format(date, "MMMM yyyy")
              : `שבוע ${format(currentWeekDays[0], "dd/MM")} - ${format(currentWeekDays[6], "dd/MM")}`}
            <ChevronLeft className="icon-small" />
          </button>
          {calendarOpen && (
            <div className="calendar-popover-content">
              <div className="calendar-picker">
                {/* Simple calendar implementation */}
                <div className="calendar-picker-header">
                  <button 
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() - 1);
                      setDate(newDate);
                    }}
                  >
                    &lt;
                  </button>
                  <span>{format(date, "MMMM yyyy")}</span>
                  <button 
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() + 1);
                      setDate(newDate);
                    }}
                  >
                    &gt;
                  </button>
                </div>
                <div className="calendar-days">
                  {/* Simplified calendar representation */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = new Date(date.getFullYear(), date.getMonth(), i + 1);
                    if (day.getMonth() !== date.getMonth()) return null;
                    return (
                      <button 
                        key={i} 
                        className="calendar-day"
                        onClick={() => {
                          setDate(day);
                          setCalendarOpen(false);
                        }}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </h2>
      <div className="calendar-controls">
        <div className="calendar-tabs">
          <div className="tabs-list">
            <button 
              className={`tab-trigger ${eventType === "הכל" ? "tab-active" : ""}`}
              onClick={() => setEventType("הכל")}
            >
              הכל
            </button>
            <button 
              className={`tab-trigger ${eventType === "לימודים" ? "tab-active" : ""}`}
              onClick={() => setEventType("לימודים")}
            >
              <Bookmark className="icon-small" />
              לימודים
            </button>
            <button 
              className={`tab-trigger ${eventType === "אישי" ? "tab-active" : ""}`}
              onClick={() => setEventType("אישי")}
            >
              <User className="icon-small" />
              אישי
            </button>
          </div>
        </div>
        <div className="view-selector">
          <button 
            className={`view-button ${view === "חודשי" ? "view-active" : ""}`}
            onClick={() => setView("חודשי")}
          >
            <span className="view-text">חודשי</span>
          </button>
          <button 
            className={`view-button ${view === "שבועי" ? "view-active" : ""}`}
            onClick={() => setView("שבועי")}
          >
            <span className="view-text">שבועי</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;