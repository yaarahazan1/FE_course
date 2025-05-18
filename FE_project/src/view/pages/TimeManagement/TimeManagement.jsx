import React, { useState } from "react";
import AddTask from "../AddTask/AddTask";
import "./TimeManagement.css";
import {
  EventType,
  sampleTasks,
  getMonthDays,
  getWeekDays,
} from "../../utils/TimeManagementUtils";
import TasksSidebar from "../../components/TimeManagementHelper/TasksSidebar/TasksSidebar";
import CalendarHeader from "../../components/TimeManagementHelper/CalendarHeader/CalendarHeader";
import MonthView from "../../components/TimeManagementHelper/MonthView/MonthView";
import WeekView from "../../components/TimeManagementHelper/WeekView/WeekView";
import TaskList from "../../components/TimeManagementHelper/TaskList/TaskList";


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
    <div className="time-wrapper">
      <header className="time-header">
        <h1>ניהול זמנים</h1>
        <p>נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים שלך בצורה חכמה ויעילה</p>
      </header>

      <div className="time-layout">
        <aside className="profile-panel">
          <div className="profile-box">
            <div className="profile-icon">י"כ</div>
            <h3>יעל כהן</h3>
            <p>מדעי ההתנהגות</p>
          </div>
          <div className="suggestions-box">
            <div className="suggestions">
              <h2>הצעות למידה</h2>
            </div>
            <div className="tasks-sidebar">
              <TasksSidebar 
                tasks={filteredTasks} 
              />
            </div>
          </div>
        </aside>

        <main className="tasks-panel">
          <div className="calendar-container">
            <div className="calendar-header-wrapper">
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

            <div className="calendar-body-wrapper">
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

          <div className="task-box">
              <div className="task-box-header">משימות קרובות</div>
              <div className="task-box-body">
                <TaskList 
                  filteredTasks={filteredTasks} 
                  onAddTask={() => setIsAddTaskDialogOpen(true)} 
                />
              </div>
            </div>
        </main>
      </div>

      <AddTask 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddSuccess={handleAddTaskSuccess} 
      />    </div>
  );
};

export default TimeManagement;
