import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import FolderPage from './pages/FolderPage';
import DrivePage from './pages/DrivePage';
import QuizPage from './pages/QuizPage';
import MidPage from './pages/MidPage';
import FinalPage from './pages/FinalPage';
import MarksPage from './pages/MarksPage';
import CGPAPage from './pages/CGPAPage';
import FacultyPage from './pages/FacultyPage';
import SettingsPage from './pages/SettingsPage';
import NoticeBoardPage from './pages/NoticeBoardPage';
import AttendancePage from './pages/AttendancePage';
import ProfilePage from './pages/ProfilePage';
import LibraryPage from './pages/LibraryPage';
import AboutUs from './pages/AboutUs';
import NotificationsPage from './pages/NotificationsPage';
// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageFaculty from './pages/Admin/ManageFaculty';
import ManageDocuments from './pages/Admin/ManageDocuments';
import ManageMarks from './pages/Admin/ManageMarks';
import ManageNotices from './pages/Admin/ManageNotices';

import ManageRoutine from './pages/Admin/ManageRoutine';
import ManageAttendance from './pages/Admin/ManageAttendance';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="notifications" element={<NotificationsPage />} />
              <Route index element={<DashboardHome />} />
              <Route path="notice-board" element={<NoticeBoardPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="folders" element={<FolderPage />} />
              <Route path="drive/:semesterId" element={<DrivePage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="mid" element={<MidPage />} />
              <Route path="final" element={<FinalPage />} />
              <Route path="marks" element={<MarksPage />} />
              <Route path="cgpa" element={<CGPAPage />} />
              <Route path="faculty" element={<FacultyPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin/notices" element={<ProtectedRoute adminOnly><ManageNotices /></ProtectedRoute>} />
              <Route path="admin/routine" element={<ProtectedRoute adminOnly><ManageRoutine /></ProtectedRoute>} />
              <Route path="admin/attendance" element={<ProtectedRoute adminOnly><ManageAttendance /></ProtectedRoute>} />
              {/* Admin routes */}
              <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/courses" element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
              <Route path="admin/students" element={<ProtectedRoute adminOnly><ManageStudents /></ProtectedRoute>} />
              <Route path="admin/faculty" element={<ProtectedRoute adminOnly><ManageFaculty /></ProtectedRoute>} />
              <Route path="admin/documents" element={<ProtectedRoute adminOnly><ManageDocuments /></ProtectedRoute>} />
              <Route path="admin/marks" element={<ProtectedRoute adminOnly><ManageMarks /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;