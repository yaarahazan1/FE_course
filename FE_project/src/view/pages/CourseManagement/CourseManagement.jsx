import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  getDocs,
  query,
  where,
  orderBy 
} from "firebase/firestore";
import { db, auth } from "../../../firebase/config"; 
import AddTaskDialog from "../../components/CourseManagementHelper/AddTaskDialog/AddTaskDialog";
import SearchBar from "../../components/CourseManagementHelper/SearchBar/SearchBar";
import AddCourseDialog from "../../components/CourseManagementHelper/AddCourseDialog/AddCourseDialog";
import AddProjectDialog from "../../components/CourseManagementHelper/AddProjectDialog/AddProjectDialog";
import ProjectsTab from "../../components/CourseManagementHelper/ProjectsTab/ProjectsTab";
import TasksTab from "../../components/CourseManagementHelper/TasksTab/TasksTab";
import CoursesTab from "../../components/CourseManagementHelper/CoursesTab/CoursesTab";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);
  
  // State לנתונים מFirebase
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || "demo-user"; // fallback למצב demo
  };

  useEffect(() => {
     loadTasks();
   }, []);
 
   const loadTasks = async () => {
     try {
       setLoading(true);
       
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

  // טעינת קורסים מFirebase
  const loadCourses = async () => {
    try {
      const userId = getCurrentUserId();
      const q = query(
        collection(db, "courses"),
        where("userId", "==", userId)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        setCourses(coursesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error("שגיאה בטעינת קורסים:", error);
      // נתונים דמה במקרה של שגיאה
      setCourses([
        {
          id: "demo-1",
          name: "פסיכולוגיה חברתית",
          lecturer: "דר. פטריק גינזבורג",
          semester: "סמסטר ב'",
          credits: 3,
          assignments: []
        }
      ]);
    }
  };

  // טעינת פרויקטים מFirebase
  const loadProjects = async () => {
    try {
      const userId = getCurrentUserId();
      const q = query(
        collection(db, "projects"),
        where("userId", "==", userId),
        orderBy("dueDate", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projectsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projectsData.push({ 
            id: doc.id, 
            ...data,
            messages: data.messages || [],
            newMessage: ""
          });
        });
        setProjects(projectsData);
      });

      return unsubscribe;
    } catch (error) {
      console.error("שגיאה בטעינת פרויקטים:", error);
      // נתונים דמה במקרה של שגיאה
      setProjects([
        {
          id: "demo-1",
          name: "SnackMatch",
          dueDate: '2025-07-31',
          description: "אפליקציה שמתאימה חטיפים לפי מצב הרוח",
          status: "פעיל",
          tasks: 7,
          teamMembers: [],
          messages: [],
          newMessage: ""
        }
      ]);
    }
  };

  // useEffect לטעינת כל הנתונים
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const unsubscribes = await Promise.all([
        loadTasks(),
        loadCourses(),
        loadProjects()
      ]);
      setLoading(false);

      // ניקוי listeners כשהקומפוננטה נמחקת
      return () => {
        unsubscribes.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    };

    loadAllData();
  }, []);

  // הוספת משימה חדשה לFirebase
  const handleAddTask = async (newTask) => {
    try {
      const userId = getCurrentUserId();
      const taskData = {
        ...newTask,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, "tasks"), taskData);
      console.log("משימה נוספה בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
      // במקרה של שגיאה, נוסיף לוקלית
      const taskWithId = {
        ...newTask,
        id: `local-${Date.now()}`,
        userId: getCurrentUserId()
      };
      setTasks([...tasks, taskWithId]);
    }
  };

  // הוספת קורס חדש לFirebase
  const handleAddCourse = async (newCourse) => {
    try {
      const userId = getCurrentUserId();
      const courseData = {
        ...newCourse,
        userId,
        semester: "סמסטר ב'",
        credits: 3,
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, "courses"), courseData);
      console.log("קורס נוסף בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת קורס:", error);
      // במקרה של שגיאה, נוסיף לוקלית
      const courseWithId = {
        ...newCourse,
        id: `local-${Date.now()}`,
        userId: getCurrentUserId(),
        semester: "סמסטר ב'",
        credits: 3,
        assignments: []
      };
      setCourses([...courses, courseWithId]);
    }
  };

  // הוספת פרויקט חדש לFirebase
  const handleAddProject = async (newProject) => {
    try {
      const userId = getCurrentUserId();
      const projectData = {
        ...newProject,
        userId,
        status: "חדש",
        tasks: 0,
        teamMembers: [],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, "projects"), projectData);
      console.log("פרויקט נוסף בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת פרויקט:", error);
      // במקרה של שגיאה, נוסיף לוקלית
      const projectWithId = {
        ...newProject,
        id: `local-${Date.now()}`,
        userId: getCurrentUserId(),
        status: "חדש",
        tasks: 0,
        teamMembers: [],
        messages: [],
        newMessage: ""
      };
      setProjects([...projects, projectWithId]);
    }
  };

  // שליחת הודעה חדשה בצ'אט פרויקט
  const handleSendMessage = async (projectId, message) => {
    if (!message.trim()) return;
    
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const newMessage = {
        id: (project.messages?.length || 0) + 1,
        sender: "משתמש נוכחי", // בפרויקט אמיתי זה יהיה שם המשתמש המחובר
        senderAvatar: "ME",
        message: message,
        timestamp: new Date().getTime()
      };

      const updatedMessages = [...(project.messages || []), newMessage];
      
      // עדכון ב-Firebase
      await updateDoc(doc(db, "projects", projectId), {
        messages: updatedMessages,
        updatedAt: new Date()
      });

      console.log("הודעה נשלחה בהצלחה");
    } catch (error) {
      console.error("שגיאה בשליחת הודעה:", error);
      // עדכון לוקלי במקרה של שגיאה
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          const newMessage = {
            id: (project.messages?.length || 0) + 1,
            sender: "משתמש נוכחי",
            senderAvatar: "ME",
            message: message,
            timestamp: new Date().getTime()
          };
          
          return {
            ...project,
            messages: [...(project.messages || []), newMessage],
            newMessage: ""
          };
        }
        return project;
      }));
    }
  };

  // עדכון ערך הודעה חדשה בשדה הקלט
  const handleMessageChange = (projectId, value) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, newMessage: value } : project
    ));
  };

  if (loading) {
    return (
      <div className="course-management-container">
        <div className="loading-spinner">
          <p>טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-management-container">
      <div className="course-management-header">
        <div>
          <h1 className="course-title">מנהל פרויקטים ומשימות</h1>
          <p className="course-subtitle">ניהול קורסים, פרויקטים ומשימות במקום אחד</p>
        </div>
      </div>

      <SearchBar 
        onAddCourse={() => setIsAddCourseDialogOpen(true)}
        onAddProject={() => setIsAddProjectDialogOpen(true)}
        onAddTask={() => setIsAddTaskDialogOpen(true)}
      />

      <div className="tabs">
        <div className="tabs-list-course">
          <button 
            className={`tab-button-course ${activeTab === "projects" ? "active" : ""}`} 
            onClick={() => setActiveTab("projects")}
          >
            פרויקטים ({projects.length})
          </button>
          <button 
            className={`tab-button-course ${activeTab === "tasks" ? "active" : ""}`} 
            onClick={() => setActiveTab("tasks")}
          >
            משימות ({tasks.length})
          </button>
          <button 
            className={`tab-button-course ${activeTab === "courses" ? "active" : ""}`} 
            onClick={() => setActiveTab("courses")}
          >
            קורסים ({courses.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "projects" && (
            <ProjectsTab 
              projects={projects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              onSendMessage={handleSendMessage}
              onMessageChange={handleMessageChange}
            />
          )}
          {activeTab === "tasks" && (
            <TasksTab tasks={tasks} />
          )}
          {activeTab === "courses" && (
            <CoursesTab courses={courses} />
          )}
        </div>
      </div>

      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)} 
        onAddSuccess={handleAddTask} 
      />

      <AddCourseDialog 
        isOpen={isAddCourseDialogOpen} 
        onClose={() => setIsAddCourseDialogOpen(false)} 
        onAddSuccess={handleAddCourse} 
      />

      <AddProjectDialog 
        isOpen={isAddProjectDialogOpen} 
        onClose={() => setIsAddProjectDialogOpen(false)} 
        onAddSuccess={handleAddProject} 
      />

    </div>
  );
};

export default CourseManagement;