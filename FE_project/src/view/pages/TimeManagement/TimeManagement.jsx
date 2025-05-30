import React, { useState, useMemo } from "react";
import { useFirebaseData } from "../../../contexts/FirebaseDataContext";
import AddTaskDialog from "../../components/CourseManagementHelper/AddTaskDialog/AddTaskDialog";
import "./TimeManagement.css";
import { getMonthDays, getWeekDays } from "../../utils/TimeManagementUtils";
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

  // קבלת נתונים ופונקציות מהקונטקסט
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    archiveTask
  } = useFirebaseData();

  // הוספת לוגים לבדיקה
  console.log("TimeManagement - tasks:", tasks?.length || 0, tasks);

  // פונקציה להמרת קטגוריה לסוג עבור הקומפוננטות הקיימות
  const mapCategoryToType = (category) => {
    if (!category) return "אישי";
    
    switch (category) {
      case "אקדמי":
      case "בחינה":
      case "לימודים":
        return "לימודים";
      case "עבודה":
        return "עבודה";
      case "אישי":
      case "כללי":
        return "אישי";
      case "פרויקט":
        return "פרויקט";
      default:
        return "אישי";
    }
  };

  // עיבוד המשימות להתאמה לקומפוננטות TimeManagement
  const processedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    const processed = tasks
      .filter(task => !task.isArchived) // רק משימות לא מאורכבות
      .map((task, index) => ({
        ...task,
        type: mapCategoryToType(task.category || task.type),
        title: task.name || task.title,
        deadline: task.dueDate || task.deadline,
        course: task.description || "",
        priority: task.priority || "בינונית",
        // מפתח ייחודי לוודא שלא יהיו כפילויות ב-React
        uniqueKey: task.uniqueId || `task-${task.id}-${index}`
      }));
    
    console.log("TimeManagement - processed tasks:", processed.length, processed);
    return processed;
  }, [tasks]);

  // הכנת נתוני לוח השנה על בסיס התצוגה הנבחרת
  const currentWeekDays = getWeekDays(date);
  const daysInMonth = getMonthDays(date);

  // סינון משימות על בסיס סוג האירוע הנבחר
  const filteredTasks = useMemo(() => {
    if (eventType === "הכל") return processedTasks;
    return processedTasks.filter(task => task.type === eventType);
  }, [processedTasks, eventType]);

  console.log("TimeManagement - filtered tasks:", filteredTasks?.length || 0, filteredTasks);

  // פונקציה לטיפול בהוספת משימה מוצלחת
  const handleAddTaskSuccess = async (newTask) => {
    try {
      await addTask(newTask);
      setIsAddTaskDialogOpen(false);
      console.log("משימה נוספה בהצלחה:", newTask);
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
      alert("שגיאה בהוספת המשימה");
    }
  };

  // Wrapper functions לפונקציות הקונטקסט
  const handleUpdateTask = async (taskId, updates) => {
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      console.error("שגיאה בעדכון משימה:", error);
      alert("שגיאה בעדכון המשימה");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("שגיאה במחיקת משימה:", error);
      alert("שגיאה במחיקת המשימה");
    }
  };

  const handleArchiveTask = async (taskId) => {
    try {
      await archiveTask(taskId);
    } catch (error) {
      console.error("שגיאה בארכוב משימה:", error);
      alert("שגיאה בארכוב המשימה");
    }
  };

  if (loading) {
    return (
      <div className="time-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>טוען משימות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="time-wrapper">
        <div className="error-container">
          <p>שגיאה: {error}</p>
          <button onClick={() => window.location.reload()}>
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

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
              <TasksSidebar tasks={filteredTasks} />
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
            <div className="task-box-header">
              משימות קרובות ({filteredTasks?.length || 0})
            </div>
            <div className="task-box-body">
              <TaskList 
                filteredTasks={filteredTasks} 
                onAddTask={() => setIsAddTaskDialogOpen(true)}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onArchiveTask={handleArchiveTask}
              />
            </div>
          </div>
        </main>
      </div>

      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)} 
        onAddSuccess={handleAddTaskSuccess} 
      />
    </div>
  );
};

export default TimeManagement;