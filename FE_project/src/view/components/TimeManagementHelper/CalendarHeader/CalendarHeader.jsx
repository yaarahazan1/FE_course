import React, { useState } from 'react';
import './CalendarHeader.css';
import { format } from "date-fns";

const CalendarHeader = ({
  date,
  setDate,
  view,
  setView,
  eventType,
  setEventType,
  currentWeekDays
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const formatMonthYear = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatWeekRange = (weekDays) => {
    return ` ${format(weekDays[6], 'dd/MM')} - ${format(weekDays[0], 'dd/MM')}`;
  };

  // הגדרת קטגוריות הסינון עם אייקונים
  const eventTypes = [
    { key: "הכל", label: "הכל", icon: null },
    { 
      key: "לימודים", 
      label: "לימודים", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    { 
      key: "עבודה", 
      label: "עבודה", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    { 
      key: "אישי", 
      label: "אישי", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    { 
      key: "פרויקט", 
      label: "פרויקט", 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M9 9h6v6H9z"></path>
        </svg>
      )
    }
  ];

  const CalendarPopup = () => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const today = new Date();

    const goToPreviousMonth = () => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      setDate(newDate);
    };

    const goToNextMonth = () => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      setDate(newDate);
    };

    const getDaysInMonth = () => {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const days = [];

      const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({
          day: prevMonthDays - i,
          currentMonth: false,
          date: new Date(currentYear, currentMonth - 1, prevMonthDays - i)
        });
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          day: i,
          currentMonth: true,
          date: new Date(currentYear, currentMonth, i),
          isToday:
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        });
      }

      const totalDaysNeeded = 42;
      const remainingDays = totalDaysNeeded - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          currentMonth: false,
          date: new Date(currentYear, currentMonth + 1, i)
        });
      }

      return days;
    };

    const days = getDaysInMonth();

    const handleDayClick = (date) => {
      setDate(date);
      setShowCalendar(false);
    };

    return (
      <div className="calendar-popup">
        <div className="calendar-popup-header">
          <button onClick={goToPreviousMonth} className="calendar-nav-button">
            &lt;
          </button>
          <span>{format(date, "MMMM yyyy")}</span>
          <button onClick={goToNextMonth} className="calendar-nav-button">
            &gt;
          </button>
        </div>

        <div className="weekdays">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>

        <div className="days-grid">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`day-cell ${day.currentMonth ? 'current-month' : 'other-month'} ${day.isToday ? 'today' : ''}`}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-header-container">
      <div className="date-selector-container">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="date-selector-button"
        >
          <span className="date-selector-arrow">⟨</span>
          <span>
            {view === "חודשי"
              ? formatMonthYear(date)
              : formatWeekRange(currentWeekDays)}
          </span>
        </button>

        {showCalendar && <CalendarPopup />}
      </div>

      <div className="filters-container">
        <div className="event-filter">
          {eventTypes.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setEventType(key)}
              className={`event-filter-button ${eventType === key ? 'active' : ''}`}
            >
              {icon && icon}
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="view-toggle">
          <button
            onClick={() => setView("חודשי")}
            className={`view-toggle-button ${view === "חודשי" ? 'active' : ''}`}
          >
            <span className="view-toggle-text">חודשי</span>
          </button>

          <button
            onClick={() => setView("שבועי")}
            className={`view-toggle-button ${view === "שבועי" ? 'active' : ''}`}
          >
            <span className="view-toggle-text">שבועי</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;