
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./view/pages/HomePage/HomePage";
import NotFound from "./view/pages/NotFound/NotFound";
import HelpSettings from "./view/pages/HelpSettings/HelpSettings";
import TimeManagement from "./view/pages/TimeManagement/TimeManagement";
import SummaryLibrary from "./view/pages/SummaryLibrary/SummaryLibrary";
import CourseManagement from "./view/pages/CourseManagement/CourseManagement";
import AcademicWriting from "./view/pages/AcademicWriting/AcademicWriting";
import Login from "./view/pages/Login/Login";
import Signup from "./view/pages/Signup/Signup";
import AddTask from "./view/pages/AddTask/AddTask";
import SocialNetwork from "./view/pages/SocialNetwork/SocialNetwork";
import AdminManagement from "./view/pages/AdminManagement/AdminManagement";
import Dashboard from "./view/pages/Dashboard/Dashboard";

import MainLayout from "./view/layouts/MainLayout/MainLayout";


document.documentElement.dir = "rtl";
document.documentElement.lang = "he";

const App = () => (
    <BrowserRouter>
      <Routes>
      <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/HelpSettings" element={<HelpSettings />} />
          <Route path="/TimeManagement" element={<TimeManagement />} />
          <Route path="/SummaryLibrary" element={<SummaryLibrary />} />
          <Route path="/AcademicWriting" element={<AcademicWriting />} />
          <Route path="/CourseManagement" element={<CourseManagement />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/SocialNetwork" element={<SocialNetwork />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/AddTask" element={<AddTask />} />
          <Route path="/AdminManagement" element={<AdminManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
);

export default App;
