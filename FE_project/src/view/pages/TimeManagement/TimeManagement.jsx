import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import AddTaskDialog from "../../components/CourseManagementHelper/AddTaskDialog/AddTaskDialog";
import "./TimeManagement.css";
import {
  EventType,
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
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // טעינת משימות מ-Firebase
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tasksCollection = collection(db, "tasks");
      const tasksQuery = query(tasksCollection, orderBy("dueDate", "asc"));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const tasksList = tasksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // המרת Timestamp ל-Date אם צריך
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate),
          deadline: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate), // הוספת deadline לתאימות
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
        };
      });
      
      setTasks(tasksList);
      console.log("נטענו משימות:", tasksList); // לדיבוג
    } catch (error) {
      console.error("שגיאה בטעינת המשימות:", error);
      setError("שגיאה בטעינת המשימות: " + error.message);
      
      // במקרה של שגיאה, הוסף משימות לדוגמה
      const sampleTasks = [
        {
          id: "sample1",
          title: "הכנה למבחן במתמטיקה",
          type: "לימודים",
          course: "מתמטיקה",
          priority: "דחוף",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          completed: false
        },
        {
          id: "sample2",
          title: "כתיבת עבודה בהיסטוריה",
          type: "לימודים",
          course: "היסטוריה",
          priority: "חשוב",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          completed: false
        }
      ];
      setTasks(sampleTasks);
    } finally {
      setLoading(false);
    }
  };

  // הוספת משימה חדשה - פונקציה שתתקרא מהדיאלוג
  const handleAddTaskSuccess = async (taskData) => {
    try {
      const newTask = {
        ...taskData,
        createdAt: Timestamp.now(),
        dueDate: Timestamp.fromDate(new Date(taskData.dueDate)),
        completed: false,
        userId: "current_user_id" // תחליף עם ה-ID האמיתי של המשתמש
      };

      const docRef = await addDoc(collection(db, "tasks"), newTask);
      
      const addedTask = {
        id: docRef.id,
        ...newTask,
        dueDate: newTask.dueDate.toDate(),
        deadline: newTask.dueDate.toDate(), // הוספת deadline לתאימות
        createdAt: newTask.createdAt.toDate()
      };

      setTasks(prev => [...prev, addedTask]);
      setIsAddTaskDialogOpen(false);
      
    } catch (error) {
      console.error("שגיאה בהוספת המשימה:", error);
      alert("אירעה שגיאה בהוספת המשימה. אנא נסה שוב.");
    }
  };

  // Prepare calendar data based on the selected view
  const currentWeekDays = getWeekDays(date);
  const daysInMonth = getMonthDays(date);
  
  // Filter tasks based on selected event type
  const filteredTasks = tasks.filter(
    task => eventType === "הכל" || task.type === eventType
  );

  if (loading) {
    return (
      <div className="time-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>טוען משימות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="time-wrapper">
      <header className="time-header">
        <h1>ניהול זמנים</h1>
        <p>נהל את לוח הזמנים שלך עם כל המשימות והפרויקטים שלך בצורה חכמה ויעילה</p>
        {error && <div className="error-message">{error}</div>}
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

      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddSuccess={handleAddTaskSuccess} 
      />    
    </div>
  );
};

export default TimeManagement;