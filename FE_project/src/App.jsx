import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../src/view/layouts/MainLayout/MainLayout';
import HomePage from '../src/view/pages/HomePage/HomePage';
import HelpSettings from '../src/view/pages/HelpSettings/HelpSettings';
import TimeManagement from '../src/view/pages/TimeManagement/TimeManagement';
import SummaryLibrary from '../src/view/pages/SummaryLibrary/SummaryLibrary';
import AcademicWriting from '../src/view/pages/AcademicWriting/AcademicWriting';
import CourseManagement from '../src/view/pages/CourseManagement/CourseManagement';
import Dashboard from '../src/view/pages/Dashboard/Dashboard';
import SocialNetwork from '../src/view/pages/SocialNetwork/SocialNetwork';
import Login from '../src/view/pages/Login/Login';
import Signup from '../src/view/pages/Signup/Signup';
import AdminManagement from '../src/view/pages/AdminManagement/AdminManagement';
import NotFound from '../src/view/pages/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            
            {/* דפים שדורשים אימות */}
            <Route 
              path="/HelpSettings" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <HelpSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/TimeManagement" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <TimeManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/SummaryLibrary" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <SummaryLibrary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/AcademicWriting" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AcademicWriting />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/CourseManagement" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <CourseManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/Dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/SocialNetwork" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <SocialNetwork />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/AdminManagement" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AdminManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* דפים שלא דורשים אימות (אם המשתמש כבר מחובר, ינותב לדף הבית) */}
            <Route 
              path="/Login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/Signup" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Signup />
                </ProtectedRoute>
              } 
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;