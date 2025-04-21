import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import MonthView from "../../components/time-managmenet/MonthView";
import TaskList from "../../components/time-managmenet/TaskList";
import CalendarHeader from "../../components/time-managmenet/CalendarHeader";
import TasksSidebar from "../../components/time-managmenet/TasksSidebar";
import AddTaskDialog from "../../components/AddTaskDialog";
// import AdminBadge from "../../components/AdminBadge";
import WeekView from "../../components/time-managmenet/WeekView";
import { Link } from "react-router-dom";
import {
  sampleTasks,
  getMonthDays,
  getWeekDays
} from "../../components/time-managmenet/timeManagementUtils";
import "./TimeManagement.css";

const TimeManagement = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("חודשי");
  const [eventType, setEventType] = useState("הכל");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  // Prepare calendar data based on the selected view
  const currentWeekDays = getWeekDays(date);
  const daysInMonth = getMonthDays(date);

  // Filter tasks based on selected event type
  const filteredTasks = sampleTasks.filter(
    task => eventType === "הכל" || task.type === eventType
  );

  const handleAddTaskSuccess = () => {
    setIsAddTaskDialogOpen(false);
  };

  return (
    <div className="time-management-container">
      {/* <AdminBadge /> */}
      
      <div className="container">
        <PageHeader />
        
        <div className="page-title">
          <h1>ניהול זמנים</h1>
          <p>
            נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים שלך בצורה חכמה ויעילה
          </p>
        </div>
        
        <div className="content-grid">
          <div className="sidebar">
            <div className="card profile-card">
              <div className="card-content">
                <div className="profile-container">
                  <div className="profile-image">
                    <span>פרופיל</span>
                  </div>
                  <span className="profile-name">יעל כהן</span>
                  <span className="profile-title">מדעי ההתנהגות</span>
                </div>
              </div>
            </div>
            <div className="suggestions-card">
              <div className="suggestions-header">
                <h2>הצעות למידה</h2>
              </div>
              <div className="suggestions-content">
                <TasksSidebar 
                  tasks={filteredTasks} 
                />
              </div>
            </div>
          </div>
          <div className="main-content">
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <CalendarHeader
                  date={date}
                  view={view}
                  eventType={eventType}
                  currentWeekDays={currentWeekDays}
                  setDate={setDate}
                  setView={setView}
                  setEventType={setEventType}
                />
              </div>
              
              <div className="calendar-card">
                {view === "חודשי" ? (
                  <MonthView 
                    date={date} 
                    daysInMonth={daysInMonth} 
                    filteredTasks={filteredTasks} 
                  />
                ) : (
                  <WeekView 
                    currentWeekDays={currentWeekDays} 
                    filteredTasks={filteredTasks} 
                  />
                )}
              </div>
            </div>
            
            <div className="tasks-card">
              <div className="tasks-header">
                <h2>משימות קרובות</h2>
              </div>
              <div className="tasks-content">
                <TaskList 
                  filteredTasks={filteredTasks} 
                  onAddTask={() => setIsAddTaskDialogOpen(true)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/help-settings" className="footer-link">
              עזרה והגדרות
            </Link>
            <span className="footer-divider">|</span>
            <div className="footer-link">
              תנאי שימוש
            </div>
            <span className="footer-divider">|</span>
            <div className="footer-link">
              מדיניות פרטיות
            </div>
          </div>
        </div>
      </footer>
      
      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddSuccess={handleAddTaskSuccess} 
      />
    </div>
  );
};

export default TimeManagement;