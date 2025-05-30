import React, { useState, useMemo } from "react";
import { useFirebaseData } from "../../../contexts/FirebaseDataContext";
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

  // קבלת נתונים ופונקציות מהקונטקסט
  const {
    tasks,
    courses,
    projects,
    loading,
    error,
    addTask,
    addCourse,
    addProject,
    sendMessage,
    updateProjectMessage
  } = useFirebaseData();

  // הוספת לוגים לבדיקה
  console.log("CourseManagement - tasks:", tasks?.length || 0, tasks);
  console.log("CourseManagement - courses:", courses?.length || 0, courses);
  console.log("CourseManagement - projects:", projects?.length || 0, projects);

  // עיבוד הנתונים עם מפתחות ייחודיים
  const processedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    const processed = tasks
      .filter(task => !task.isArchived) // רק משימות לא מאורכבות
      .map((task, index) => ({
        ...task,
        // יצירת מפתח ייחודי
        uniqueKey: task.uniqueId || `task-${task.id}-${index}`,
        title: task.name || task.title,
        deadline: task.dueDate || task.deadline
      }));
    
    console.log("CourseManagement - processed tasks:", processed.length, processed);
    return processed;
  }, [tasks]);

  const processedCourses = useMemo(() => {
    if (!courses || courses.length === 0) return [];
    
    const processed = courses.map((course, index) => ({
      ...course,
      // יצירת מפתח ייחודי
      uniqueKey: course.uniqueId || `course-${course.id}-${index}`
    }));
    
    console.log("CourseManagement - processed courses:", processed.length, processed);
    return processed;
  }, [courses]);

  const processedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    const processed = projects.map((project, index) => ({
      ...project,
      // יצירת מפתח ייחודי
      uniqueKey: project.uniqueId || `project-${project.id}-${index}`,
      messages: project.messages || [],
      newMessage: project.newMessage || ""
    }));
    
    console.log("CourseManagement - processed projects:", processed.length, processed);
    return processed;
  }, [projects]);

  // הוספת משימה חדשה
  const handleAddTask = async (newTask) => {
    try {
      await addTask(newTask);
      setIsAddTaskDialogOpen(false);
      console.log("משימה נוספה בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת משימה:", error);
      alert("שגיאה בהוספת המשימה");
    }
  };

  // הוספת קורס חדש
  const handleAddCourse = async (newCourse) => {
    try {
      await addCourse(newCourse);
      setIsAddCourseDialogOpen(false);
      console.log("קורס נוסף בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת קורס:", error);
      alert("שגיאה בהוספת הקורס");
    }
  };

  // הוספת פרויקט חדש
  const handleAddProject = async (newProject) => {
    try {
      await addProject(newProject);
      setIsAddProjectDialogOpen(false);
      console.log("פרויקט נוסף בהצלחה");
    } catch (error) {
      console.error("שגיאה בהוספת פרויקט:", error);
      alert("שגיאה בהוספת הפרויקט");
    }
  };

  // שליחת הודעה חדשה בצ'אט פרויקט
  const handleSendMessage = async (projectId, message) => {
    try {
      await sendMessage(projectId, message);
      // ניקוי השדה לאחר שליחה מוצלחת
      updateProjectMessage(projectId, "");
    } catch (error) {
      console.error("שגיאה בשליחת הודעה:", error);
      alert("שגיאה בשליחת ההודעה");
    }
  };

  // עדכון ערך הודעה חדשה בשדה הקלט
  const handleMessageChange = (projectId, value) => {
    updateProjectMessage(projectId, value);
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

  if (error) {
    return (
      <div className="course-management-container">
        <div className="error-message">
          <p>שגיאה: {error}</p>
          <button onClick={() => window.location.reload()}>
            נסה שוב
          </button>
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
            פרויקטים ({processedProjects.length})
          </button>
          <button 
            className={`tab-button-course ${activeTab === "tasks" ? "active" : ""}`} 
            onClick={() => setActiveTab("tasks")}
          >
            משימות ({processedTasks.length})
          </button>
          <button 
            className={`tab-button-course ${activeTab === "courses" ? "active" : ""}`} 
            onClick={() => setActiveTab("courses")}
          >
            קורסים ({processedCourses.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "projects" && (
            <ProjectsTab 
              projects={processedProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              onSendMessage={handleSendMessage}
              onMessageChange={handleMessageChange}
            />
          )}
          {activeTab === "tasks" && (
            <TasksTab tasks={processedTasks} />
          )}
          {activeTab === "courses" && (
            <CoursesTab courses={processedCourses} />
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