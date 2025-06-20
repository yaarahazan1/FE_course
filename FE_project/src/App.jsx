import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { FirebaseDataProvider } from './contexts/FirebaseDataContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from './view/layouts/MainLayout';
import HomePage from '../src/view/pages/HomePage/HomePage';
import LandingPage from '../src/view/pages/LandingPage/LandingPage';
import HelpSettings from '../src/view/pages/HelpSettings/HelpSettings';
import Support from '../src/view/pages/Support/Support';
import TimeManagement from '../src/view/pages/TimeManagement/TimeManagement';
import SummaryLibrary from '../src/view/pages/SummaryLibrary/SummaryLibrary';
import AcademicWriting from '../src/view/pages/AcademicWriting/AcademicWriting';
import CourseManagement from '../src/view/pages/CourseManagement/CourseManagement';
import Dashboard from '../src/view/pages/Dashboard/Dashboard';
import SocialNetwork from '../src/view/pages/SocialNetwork/SocialNetwork';
import Login from '../src/view/pages/Login/Login';
import Signup from '../src/view/pages/Signup/Signup';
import AdminManagement from '../src/view/pages/AdminManagement/AdminManagement';
import ForgotPassword from '../src/view/pages/ForgotPassword/ForgotPassword';
import NotFound from '../src/view/pages/NotFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <FirebaseDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Root route - shows LandingPage for non-authenticated users, HomePage for authenticated users */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireAuth={false} showHomeForAuth={true}>
                    <LandingPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Home page - only for authenticated users */}
              <Route 
                path="/Home" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/HelpSettings" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <HelpSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/Support" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Support />
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
              {/* תיקון: ForgotPassword לא צריך אימות */}
              <Route 
                path="/ForgotPassword" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPassword />
                  </ProtectedRoute>
                } 
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FirebaseDataProvider>
    </AuthProvider>
  );
}

export default App;