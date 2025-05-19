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

  const [projects] = useState([
    {
      id: 1,
      name: "SnackMatch",
      description: "אפליקציה שמתאימה חטיפים לפי מצב הרוח",
      status: "פעיל",
      tasks: 7,
      teamMembers: [
        { id: 1, name: "רונית כהן גולדמן", role: "מנהלת צוות" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות" },
        { id: 3, name: "יעל אבוטבול", role: "חברת צוות" }
      ],
      messages: [
        {
          id: 1,
          sender: "רונית",
          message: "בוקר טוב! זוכרים שהמשימה - 'בניית טופס בחירת מצב רוח' צריכה להיות מוגשת עד סוף השבוע",
          time: "09:30"
        }
      ]
    },
    {
      id: 2,
      name: "מחקר מגמות דיגיטליות",
      description: "ניתוח מגמות בשוק הדיגיטלי",
      status: "בתהליך",
      tasks: 4,
      teamMembers: [
        { id: 3, name: "שמחה ליאון סויסה", role: "מנהל צוות" },
        { id: 2, name: "משה לוינסקי", role: "חבר צוות" },
        { id: 4, name: "נועה ברק", role: "חברת צוות" }
      ],
      messages: [
        {
          id: 1,
          sender: "שמחה",
          message: "שלחתי לכם מסמך עם הממצאים הראשוניים של הסקר",
          time: "10:15"
        }
      ]
    }
  ]);

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
      />

      <div className="tabs">
        <div className="tabs-list">
          <button 
            className={`tab-button ${activeTab === "projects" ? "active" : ""}`} 
            onClick={() => setActiveTab("projects")}
          >
            פרויקטים
          </button>
          <button 
            className={`tab-button ${activeTab === "tasks" ? "active" : ""}`} 
            onClick={() => setActiveTab("tasks")}
          >
            משימות
          </button>
          <button 
            className={`tab-button ${activeTab === "courses" ? "active" : ""}`} 
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
            />
          )}
          {activeTab === "tasks" && (
            <TasksTab />
          )}
          {activeTab === "courses" && (
            <CoursesTab />
          )}
        </div>
      </div>

      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)} 
        onAddSuccess={() => setIsAddTaskDialogOpen(false)} 
      />

      <AddCourseDialog 
        isOpen={isAddCourseDialogOpen} 
        onClose={() => setIsAddCourseDialogOpen(false)} 
        onAddSuccess={() => setIsAddCourseDialogOpen(false)} 
      />

      <AddProjectDialog 
        isOpen={isAddProjectDialogOpen} 
        onClose={() => setIsAddProjectDialogOpen(false)} 
        onAddSuccess={() => setIsAddProjectDialogOpen(false)} 
      />

    </div>
  );
};

export default CourseManagement;
