import React, { useState } from "react";
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
  
  // מידע חדש - משימות
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "הגשת מטלה בסטטיסטיקה",
      description: "לסיים את כל התרגילים בפרק 5",
      dueDate: new Date(2025, 5, 15).toISOString().split('T')[0],
      priority: "גבוהה",
      status: "ממתין",
      projectName: "לימודים",
      course: "סטטיסטיקה"
    },
    {
      id: 2,
      name: "מבחן אמצע סמסטר",
      description: "לסכם את כל החומר עד כה",
      dueDate: new Date(2025, 4, 20).toISOString().split('T')[0],
      priority: "גבוהה",
      status: "בתהליך",
      projectName: "לימודים",
      course: "פסיכולוגיה חברתית"
    },
    {
      id: 3,
      name: "פגישה עם המנחה",
      description: "להכין שאלות ונושאים לשיחה",
      dueDate: new Date(2025, 5, 18).toISOString().split('T')[0],
      priority: "בינונית",
      status: "ממתין",
      projectName: "לימודים"
    },
    {
      id: 4,
      name: "הכנת מצגת",
      description: "לסיים את המצגת לקורס שיטות מחקר",
      dueDate: new Date(2025, 4, 25).toISOString().split('T')[0],
      priority: "נמוכה",
      status: "בתהליך",
      projectName: "לימודים",
      course: "שיטות מחקר"
    },
    {
      id: 5,
      name: "פגישה משפחתית",
      description: "ארוחת ערב משפחתית",
      dueDate: new Date(2025, 4, 17).toISOString().split('T')[0],
      priority: "בינונית",
      status: "ממתין",
      projectName: "אישי"
    },
    {
      id: 6,
      name: "תור לרופא",
      description: "בדיקה שנתית",
      dueDate: new Date(2025, 5, 22).toISOString().split('T')[0],
      priority: "בינונית",
      status: "ממתין",
      projectName: "אישי"
    }
  ]);

  // מידע חדש - קורסים
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "פסיכולוגיה חברתית",
      lecturer: "דר. פטריק גינזבורג",
      semester: "סמסטר ב'",
      credits: 3,
      assignments: [
        { name: "מבחן אמצע סמסטר", dueDate: "20/05/2025", isCompleted: false },
        { name: "עבודת סיום", dueDate: "01/07/2025", isCompleted: false }
      ]
    },
    {
      id: 2,
      name: "שיטות מחקר מתקדמות",
      lecturer: "פרופ. אלישע",
      semester: "סמסטר ב'",
      credits: 4,
      assignments: [
        { name: "הכנת מצגת", dueDate: "25/04/2025", isCompleted: false },
        { name: "הצגת פרויקט", dueDate: "10/06/2025", isCompleted: false },
        { name: "עבודה סופית", dueDate: "20/07/2025", isCompleted: false }
      ]
    },
    {
      id: 3,
      name: "סטטיסטיקה יישומית",
      lecturer: "דר. רונית כהן",
      semester: "סמסטר ב'",
      credits: 3,
      assignments: [
        { name: "הגשת מטלה", dueDate: "15/06/2025", isCompleted: false },
        { name: "תרגיל 1", dueDate: "01/05/2025", isCompleted: true },
        { name: "תרגיל 2", dueDate: "15/05/2025", isCompleted: false },
        { name: "מבחן סופי", dueDate: "10/07/2025", isCompleted: false }
      ]
    }
  ]);

  // המידע של הפרויקטים עם תמיכה בצ'אט
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "SnackMatch",
      dueDate: '2025-07-31',
      description: "אפליקציה שמתאימה חטיפים לפי מצב הרוח",
      status: "פעיל",
      tasks: 7,
      teamMembers: [
        { id: 1, name: "רונית כהן גולדמן", role: "מנהלת צוות", avatar: "RC" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות", avatar: "ML" },
        { id: 3, name: "יעל אבוטבול", role: "חברת צוות", avatar: "YA" }
      ],
      messages: [
        {
          id: 1,
          sender: "רונית כהן גולדמן",
          senderAvatar: "RC",
          message: "בוקר טוב! זוכרים שהמשימה - 'בניית טופס בחירת מצב רוח' צריכה להיות מוגשת עד סוף השבוע",
          timestamp: new Date(2025, 4, 15, 9, 30).getTime()
        },
        {
          id: 2,
          sender: "משה לוינסקי",
          senderAvatar: "ML",
          message: "התחלתי לעבוד על הטופס, אסיים עד יום חמישי.",
          timestamp: new Date(2025, 4, 15, 10, 15).getTime()
        },
        {
          id: 3,
          sender: "יעל אבוטבול",
          senderAvatar: "YA",
          message: "אני אעבור על הטופס אחרי שתסיים בבקשה. הכנתי כבר את העיצוב.",
          timestamp: new Date(2025, 4, 15, 11, 5).getTime()
        }
      ],
      newMessage: ""
    },
    {
      id: 2,
      name: "מחקר מגמות דיגיטליות",
      dueDate: '2025-07-01',
      description: "ניתוח מגמות בשוק הדיגיטלי",
      status: "בתהליך",
      tasks: 4,
      teamMembers: [
        { id: 3, name: "שמחה ליאון סויסה", role: "מנהל צוות", avatar: "SL" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות", avatar: "ML" },
        { id: 4, name: "נועה ברק", role: "חברת צוות", avatar: "NB" }
      ],
      messages: [
        {
          id: 1,
          sender: "שמחה ליאון סויסה",
          senderAvatar: "SL",
          message: "שלחתי לכם מסמך עם הממצאים הראשוניים של הסקר",
          timestamp: new Date(2025, 4, 14, 10, 15).getTime()
        },
        {
          id: 2,
          sender: "נועה ברק",
          senderAvatar: "NB",
          message: "תודה שמחה, אני מתחילה לעבור עליו. נראה מעניין מאוד!",
          timestamp: new Date(2025, 4, 14, 13, 30).getTime()
        }
      ],
      newMessage: ""
    }
  ]);

  // טיפול בהוספת משימה חדשה
  const handleAddTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: tasks.length + 1
    };
    setTasks([...tasks, taskWithId]);
  };

  // טיפול בהוספת קורס חדש
  const handleAddCourse = (newCourse) => {
    const courseWithId = {
      ...newCourse,
      id: courses.length + 1,
      semester: "סמסטר ב'",
      credits: 3,
      assignments: []
    };
    setCourses([...courses, courseWithId]);
  };

  // טיפול בהוספת פרויקט חדש
  const handleAddProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: projects.length + 1,
      status: "חדש",
      tasks: 0,
      teamMembers: [],
      messages: [],
      newMessage: ""
    };
    setProjects([...projects, projectWithId]);
  };

  // טיפול בשליחת הודעה חדשה בצ'אט של פרויקט
  const handleSendMessage = (projectId, message) => {
    if (!message.trim()) return;
    
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newMessage = {
          id: project.messages.length + 1,
          sender: "משתמש נוכחי", // בפרויקט אמיתי זה יהיה שם המשתמש המחובר
          senderAvatar: "ME",
          message: message,
          timestamp: new Date().getTime()
        };
        
        return {
          ...project,
          messages: [...project.messages, newMessage],
          newMessage: ""
        };
      }
      return project;
    }));
  };

  // עדכון ערך הודעה חדשה בשדה הקלט
  const handleMessageChange = (projectId, value) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, newMessage: value } : project
    ));
  };

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
            פרויקטים
          </button>
          <button 
            className={`tab-button-course ${activeTab === "tasks" ? "active" : ""}`} 
            onClick={() => setActiveTab("tasks")}
          >
            משימות
          </button>
          <button 
            className={`tab-button-course ${activeTab === "courses" ? "active" : ""}`} 
            onClick={() => setActiveTab("courses")}
          >
            קורסים
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