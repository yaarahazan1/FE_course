import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  onSnapshot,
  query,
  where,
  orderBy 
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// יצירת Context
const FirebaseDataContext = createContext();

// Hook לשימוש ב-Context
export const useFirebaseData = () => {
  const context = useContext(FirebaseDataContext);
  if (!context) {
    throw new Error('useFirebaseData must be used within a FirebaseDataProvider');
  }
  return context;
};

// Provider Component
export const FirebaseDataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Refs לשמירת מצב הנתונים הקודמים
  const prevTasksRef = useRef(new Map());
  const prevCoursesRef = useRef(new Map());
  const prevProjectsRef = useRef(new Map());

  // פונקציה לקבלת ID המשתמש הנוכחי
  const getCurrentUserId = () => {
    return user?.uid || auth.currentUser?.uid || "demo-user";
  };

  // פונקציה להמרת תאריכים מ-Firebase
  const convertFirebaseDate = (firebaseDate) => {
    if (!firebaseDate) return null;
    
    if (firebaseDate.toDate) {
      return firebaseDate.toDate();
    } else if (typeof firebaseDate === 'string') {
      return new Date(firebaseDate);
    } else if (firebaseDate instanceof Date) {
      return firebaseDate;
    }
    
    return null;
  };

  // פונקציה משופרת להסרת כפילויות עם בדיקה מקיפה
  const removeDuplicatesAdvanced = (items, type) => {
    const uniqueMap = new Map();
    const seenUniqueIds = new Set();
    const seenFirebaseIds = new Set();
    
    items.forEach(item => {
      let shouldAdd = true;
      let uniqueKey = null;
      
      // בדיקה לפי uniqueId
      if (item.uniqueId) {
        if (seenUniqueIds.has(item.uniqueId)) {
          console.warn(`🚫 Duplicate ${type} found by uniqueId:`, item.uniqueId);
          shouldAdd = false;
        } else {
          seenUniqueIds.add(item.uniqueId);
          uniqueKey = item.uniqueId;
        }
      }
      
      // בדיקה לפי Firebase ID
      if (shouldAdd && item.id) {
        if (seenFirebaseIds.has(item.id)) {
          console.warn(`🚫 Duplicate ${type} found by Firebase ID:`, item.id);
          shouldAdd = false;
        } else {
          seenFirebaseIds.add(item.id);
          if (!uniqueKey) uniqueKey = item.id;
        }
      }
      
      // בדיקה לפי תוכן (fallback)
      if (shouldAdd && !uniqueKey) {
        const contentKey = `${item.name || item.title || ''}_${item.createdAt?.getTime() || 0}`;
        if (uniqueMap.has(contentKey)) {
          console.warn(`🚫 Duplicate ${type} found by content:`, contentKey);
          shouldAdd = false;
        } else {
          uniqueKey = contentKey;
        }
      }
      
      if (shouldAdd && uniqueKey) {
        uniqueMap.set(uniqueKey, {
          ...item,
          uniqueKey
        });
      }
    });
    
    const result = Array.from(uniqueMap.values());
    console.log(`✅ ${type} after duplicate removal: ${items.length} → ${result.length}`);
    return result;
  };

  // פונקציה לבדיקת שינויים והמרת נתונים
  const processAndUpdateData = (newData, type, currentMap, setState) => {
    try {
      const processedData = newData.map(doc => {
        const data = doc.data();
        const processedItem = {
          id: doc.id,
          ...data,
          createdAt: convertFirebaseDate(data.createdAt) || new Date(),
          updatedAt: convertFirebaseDate(data.updatedAt) || new Date()
        };

        // הוספת שדות ספציפיים לפי סוג הנתונים
        if (type === 'tasks') {
          processedItem.title = data.name || data.title;
          processedItem.dueDate = convertFirebaseDate(data.dueDate);
          processedItem.deadline = convertFirebaseDate(data.dueDate);
        } else if (type === 'projects') {
          processedItem.messages = data.messages || [];
          processedItem.newMessage = "";
        }

        return processedItem;
      });

      // הסרת כפילויות
      const uniqueData = removeDuplicatesAdvanced(processedData, type);
      
      // בדיקה אם יש שינוי בנתונים
      const newDataMap = new Map(uniqueData.map(item => [item.id, item]));
      
      // השוואה עם הנתונים הקודמים
      let hasChanges = newDataMap.size !== currentMap.current.size;
      
      if (!hasChanges) {
        for (const [id, item] of newDataMap) {
          const prevItem = currentMap.current.get(id);
          if (!prevItem || prevItem.updatedAt?.getTime() !== item.updatedAt?.getTime()) {
            hasChanges = true;
            break;
          }
        }
      }
      
      if (hasChanges) {
        console.log(`🔄 ${type} data changed, updating state`);
        currentMap.current = newDataMap;
        setState(uniqueData);
      } else {
        console.log(`⏺️ ${type} data unchanged, skipping update`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${type} data:`, error);
      setError(`שגיאה בעיבוד נתוני ${type}: ${error.message}`);
    }
  };

  // useEffect למעקב אחר שינויי אימות
  useEffect(() => {
    console.log("🟢 Setting up auth listener");
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("👤 Auth state changed:", currentUser ? "User logged in" : "User logged out");
      setUser(currentUser);
    });

    return () => {
      console.log("🔴 Cleaning up auth listener");
      unsubscribeAuth();
    };
  }, []);

  // useEffect לטעינת נתונים כאשר המשתמש משתנה
  useEffect(() => {
    if (user === null && auth.currentUser === null) {
      console.log("⏳ Waiting for auth state to be determined");
      return;
    }

    const userId = getCurrentUserId();
    console.log("🟢 FirebaseDataProvider - initializing listeners for user:", userId);
    
    let unsubscribeTasks = null;
    let unsubscribeCourses = null;
    let unsubscribeProjects = null;

    // איפוס המפות הקודמות
    prevTasksRef.current.clear();
    prevCoursesRef.current.clear();
    prevProjectsRef.current.clear();

    // Setup Tasks Listener
    const setupTasksListener = () => {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
          console.log("📊 Tasks data received:", querySnapshot.docs.length);
          processAndUpdateData(querySnapshot.docs, 'tasks', prevTasksRef, setTasks);
        }, (error) => {
          console.error("❌ Tasks listener error:", error);
          setError("שגיאה בטעינת המשימות: " + error.message);
        });
      } catch (error) {
        console.error("❌ Setup tasks listener error:", error);
        setError("שגיאה בהגדרת מאזין משימות: " + error.message);
      }
    };

    // Setup Courses Listener
    const setupCoursesListener = () => {
      try {
        const coursesQuery = query(
          collection(db, "courses"),
          where("userId", "==", userId)
        );
        
        unsubscribeCourses = onSnapshot(coursesQuery, (querySnapshot) => {
          console.log("📊 Courses data received:", querySnapshot.docs.length);
          processAndUpdateData(querySnapshot.docs, 'courses', prevCoursesRef, setCourses);
        }, (error) => {
          console.error("❌ Courses listener error:", error);
          setError("שגיאה בטעינת הקורסים: " + error.message);
        });
      } catch (error) {
        console.error("❌ Setup courses listener error:", error);
        setError("שגיאה בהגדרת מאזין קורסים: " + error.message);
      }
    };

    // Setup Projects Listener
    const setupProjectsListener = () => {
      try {
        const projectsQuery = query(
          collection(db, "projects"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        unsubscribeProjects = onSnapshot(projectsQuery, (querySnapshot) => {
          console.log("📊 Projects data received:", querySnapshot.docs.length);
          processAndUpdateData(querySnapshot.docs, 'projects', prevProjectsRef, setProjects);
        }, (error) => {
          console.error("❌ Projects listener error:", error);
          setError("שגיאה בטעינת הפרויקטים: " + error.message);
        });
      } catch (error) {
        console.error("❌ Setup projects listener error:", error);
        setError("שגיאה בהגדרת מאזין פרויקטים: " + error.message);
      }
    };

    // Initialize all listeners
    setupTasksListener();
    setupCoursesListener();
    setupProjectsListener();
    
    // הגדרת loading כ-false רק לאחר הגדרת כל הליסנרים
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Cleanup function
    return () => {
      console.log("🔴 FirebaseDataProvider - cleaning up all listeners");
      clearTimeout(timer);
      
      if (unsubscribeTasks && typeof unsubscribeTasks === 'function') {
        unsubscribeTasks();
      }
      if (unsubscribeCourses && typeof unsubscribeCourses === 'function') {
        unsubscribeCourses();
      }
      if (unsubscribeProjects && typeof unsubscribeProjects === 'function') {
        unsubscribeProjects();
      }
    };
  }, [user]);

  // פונקציות לניהול נתונים
  const addTask = async (taskData) => {
    try {
      const userId = getCurrentUserId();
      const uniqueId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTaskData = {
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
        uniqueId
      };
      
      console.log("➕ Adding task:", newTaskData);
      await addDoc(collection(db, "tasks"), newTaskData);
      console.log("✅ Task added successfully");
    } catch (error) {
      console.error("❌ Error adding task:", error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      console.log("🔄 Updating task:", taskId, updates);
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log("✅ Task updated successfully");
    } catch (error) {
      console.error("❌ Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log("🗑️ Deleting task:", taskId);
      await deleteDoc(doc(db, "tasks", taskId));
      console.log("✅ Task deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }
  };

  const archiveTask = async (taskId) => {
    try {
      await updateTask(taskId, { isArchived: true });
    } catch (error) {
      console.error("❌ Error archiving task:", error);
      throw error;
    }
  };

  const addCourse = async (courseData) => {
    try {
      const userId = getCurrentUserId();
      const uniqueId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newCourseData = {
        ...courseData,
        userId,
        semester: "סמסטר ב'",
        credits: 3,
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        uniqueId
      };
      
      console.log("➕ Adding course:", newCourseData);
      await addDoc(collection(db, "courses"), newCourseData);
      console.log("✅ Course added successfully");
    } catch (error) {
      console.error("❌ Error adding course:", error);
      throw error;
    }
  };

  const addProject = async (projectData) => {
    try {
      const userId = getCurrentUserId();
      const uniqueId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newProjectData = {
        ...projectData,
        userId,
        status: "חדש",
        tasks: 0,
        teamMembers: [],
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        uniqueId
      };
      
      console.log("➕ Adding project:", newProjectData);
      await addDoc(collection(db, "projects"), newProjectData);
      console.log("✅ Project added successfully");
    } catch (error) {
      console.error("❌ Error adding project:", error);
      throw error;
    }
  };

  const sendMessage = async (projectId, message) => {
    if (!message.trim()) return;
    
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const newMessage = {
        id: (project.messages?.length || 0) + 1,
        sender: "משתמש נוכחי",
        senderAvatar: "ME",
        message: message,
        timestamp: new Date().getTime()
      };

      const updatedMessages = [...(project.messages || []), newMessage];
      
      console.log("💬 Sending message to project:", projectId);
      await updateDoc(doc(db, "projects", projectId), {
        messages: updatedMessages,
        updatedAt: new Date()
      });
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  };

  // פונקציה לעדכון הודעה חדשה בפרויקט (local state)
  const updateProjectMessage = (projectId, message) => {
    setProjects(prevProjects => prevProjects.map(project => 
      project.id === projectId ? { ...project, newMessage: message } : project
    ));
  };

  const value = {
    // State
    tasks,
    courses,
    projects,
    loading,
    error,
    user,
    
    // Actions
    addTask,
    updateTask,
    deleteTask,
    archiveTask,
    addCourse,
    addProject,
    sendMessage,
    updateProjectMessage
  };

  return (
    <FirebaseDataContext.Provider value={value}>
      {children}
    </FirebaseDataContext.Provider>
  );
};