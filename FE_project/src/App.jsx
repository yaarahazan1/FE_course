import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./view/pages/HomePage/HomePage"; 
import Login from "./view/pages/Login/Login"; 
import Signup from "./view/pages/Signup/Signup"; 
import AcademicWriting from "./view/pages/AcademicWriting/AcademicWriting"; 
import CourseManagement from "./view/pages/CourseManagement/CourseManagement"; 
import SocialNetwork from "./view/pages/SocialNetwork/SocialNetwork"; 
import Dashboard from "./view/pages/Dashboard/Dashboard"; 
import NotFound from "./view/pages/NotFound/NotFound"; 
import SummaryLibrary from "./view/pages/SummaryLibrary/SummaryLibrary"; 
import TimeManagement from "./view/pages/TimeManagement/TimeManagement"; 

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/TimeManagement" element={<TimeManagement />} />
      <Route path="/SummaryLibrary" element={<SummaryLibrary />} />
      <Route path="/CourseManagement" element={<CourseManagement />} />
      <Route path="/AcademicWriting" element={<AcademicWriting />} />
      <Route path="/SocialNetwork" element={<SocialNetwork />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/NotFound" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;

