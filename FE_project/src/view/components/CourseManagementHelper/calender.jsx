import React, { useState, useRef, useEffect } from "react";

// קבועים
export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// פונקציות עזר
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "בחר תאריך";
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL');
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay();
};

// Custom Hook ללוח שנה
export const useDatePicker = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dueDate, setDueDate] = useState("");
  const datePickerRef = useRef(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };
    
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day+1);
    const dateString = selectedDate.toISOString().split('T')[0];
    setDueDate(dateString);
    setIsDatePickerOpen(false);
  };

  const clearDate = () => {
    setDueDate("");
    setIsDatePickerOpen(false);
  };

  const selectToday = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    setDueDate(dateString);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setIsDatePickerOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Previous month's trailing days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${daysInPrevMonth - i}`} className="calendar-day-add-project prev-month">
          {daysInPrevMonth - i}
        </div>
      );
    }

    // Current month days
    const today = new Date();
    const selectedDate = dueDate ? new Date(dueDate) : null;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === currentMonth && 
                     today.getFullYear() === currentYear;
      
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth && 
                        selectedDate.getFullYear() === currentYear;
      days.push(
        <div 
          key={day} 
          className={`calendar-day-add-project current-month ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day-add-project next-month">
          {day}
        </div>
      );
    }
    return days;
  };

  return {
    isDatePickerOpen,
    setIsDatePickerOpen,
    currentMonth,
    currentYear,
    dueDate,
    setDueDate,
    datePickerRef,
    navigateMonth,
    handleDateSelect,
    clearDate,
    selectToday,
    renderCalendar
  };
};