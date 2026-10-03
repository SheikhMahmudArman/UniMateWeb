import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const FolderPage = lazy(() => import('./pages/FolderPage'));
const DrivePage = lazy(() => import('./pages/DrivePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const MidPage = lazy(() => import('./pages/MidPage'));
const FinalPage = lazy(() => import('./pages/FinalPage'));
const MarksPage = lazy(() => import('./pages/MarksPage'));
const CGPAPage = lazy(() => import('./pages/CGPAPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NoticeBoardPage = lazy(() => import('./pages/NoticeBoardPage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
// Admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const ManageCourses = lazy(() => import('./pages/Admin/ManageCourses'));
const ManageStudents = lazy(() => import('./pages/Admin/ManageStudents'));
const ManageFaculty = lazy(() => import('./pages/Admin/ManageFaculty'));
const ManageDocuments = lazy(() => import('./pages/Admin/ManageDocuments'));
const ManageMarks = lazy(() => import('./pages/Admin/ManageMarks'));
const ManageNotices = lazy(() => import('./pages/Admin/ManageNotices'));

const ManageRoutine = lazy(() => import('./pages/Admin/ManageRoutine'));
const ManageAttendance = lazy(() => import('./pages/Admin/ManageAttendance'));

const AcademicPage = lazy(() => import('./pages/AcademicPage'));
const ManageQuizzes = lazy(() => import('./pages/Admin/ManageQuizzes'));
const ManageAssignments = lazy(() => import('./pages/Admin/ManageAssignments'));
const ManageTopics = lazy(() => import('./pages/Admin/ManageTopics'));
const ManageLibrary = lazy(() => import('./pages/Admin/ManageLibrary'));
const ManageSemesters = lazy(() => import('./pages/Admin/ManageSemesters'));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Suspense fallback={<div className="p-4">Loading page…</div>}>
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
              <Route path="assignments" element={<AcademicPage key="assignments" resource="assignments" title="Assignments" />} />
              <Route path="topics" element={<AcademicPage key="topics" resource="topics" title="Course Topics" />} />
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
              <Route path="admin/quizzes" element={<ProtectedRoute adminOnly><ManageQuizzes /></ProtectedRoute>} />
              <Route path="admin/assignments" element={<ProtectedRoute adminOnly><ManageAssignments /></ProtectedRoute>} />
              <Route path="admin/topics" element={<ProtectedRoute adminOnly><ManageTopics /></ProtectedRoute>} />
              <Route path="admin/library" element={<ProtectedRoute adminOnly><ManageLibrary /></ProtectedRoute>} />
              <Route path="admin/semesters" element={<ProtectedRoute adminOnly><ManageSemesters /></ProtectedRoute>} />
              <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/courses" element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
              <Route path="admin/students" element={<ProtectedRoute adminOnly><ManageStudents /></ProtectedRoute>} />
              <Route path="admin/faculty" element={<ProtectedRoute adminOnly><ManageFaculty /></ProtectedRoute>} />
              <Route path="admin/documents" element={<ProtectedRoute adminOnly><ManageDocuments /></ProtectedRoute>} />
              <Route path="admin/marks" element={<ProtectedRoute adminOnly><ManageMarks /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;