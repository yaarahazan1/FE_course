import React, { useState } from "react";
import AddTaskDialog from "../../components/AddTaskDialog";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/course-management/SearchBar";
import Footer from "../../components/course-management/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import AddCourseDialog from "../../components/course-management/AddCourseDialog";
import AddProjectDialog from "../../components/course-management/AddProjectDialog";
import ProjectsTab from "../../components/course-management/ProjectsTab";
import TasksTab from "../../components/course-management/TasksTab";
import CoursesTab from "../../components/course-management/CoursesTab";
import './CourseManagement.css';

const CourseManagement = () => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // Projects data
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
          message: "בוקר טוב לכם! זוכרים שהמשימה - 'בניית טופס בחירת מצב רוח' צריכה להיות מוגשת עד סוף השבוע",
          time: "09:30",
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
          time: "10:15",
        }
      ]
    }
  ]);

  return (
    <div className="container">
      <PageHeader />

      <div className="header">
        <div>
          <h1 className="title">מנהל פרויקטים ומשימות</h1>
          <p className="subtitle">ניהול קורסים, פרויקטים ומשימות במקום אחד</p>
        </div>
      </div>

      <SearchBar 
        onAddCourse={() => setIsAddCourseDialogOpen(true)}
        onAddProject={() => setIsAddProjectDialogOpen(true)}
      />
      
      <Tabs defaultValue="projects" className="tabs">
        <TabsList className="tabsList">
          <TabsTrigger value="projects" className="tabsTrigger">
            פרויקטים
          </TabsTrigger>
          <TabsTrigger value="tasks" className="tabsTrigger">
            משימות
          </TabsTrigger>
          <TabsTrigger value="courses" className="tabsTrigger">
            קורסים
          </TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <ProjectsTab 
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            onAddProject={() => setIsAddProjectDialogOpen(true)}
          />
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <TasksTab onAddTask={() => setIsAddTaskDialogOpen(true)} />
        </TabsContent>
        
        {/* Courses Tab */}
        <TabsContent value="courses">
          <CoursesTab onAddCourse={() => setIsAddCourseDialogOpen(true)} />
        </TabsContent>
      </Tabs>

      <AddTaskDialog 
        isOpen={isAddTaskDialogOpen} 
        onClose={() => setIsAddTaskDialogOpen(false)} 
        onAddSuccess={() => {
          setIsAddTaskDialogOpen(false);
          // Here you could refresh the task list or update state
        }} 
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

      <Footer />
    </div>
  );
};

export default CourseManagement;