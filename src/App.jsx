import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import QuizPage from './pages/QuizPage';
import MidPage from './pages/MidPage';
import FinalPage from './pages/FinalPage';
import MarksPage from './pages/MarksPage';
import CGPAPage from './pages/CGPAPage';
import FacultyPage from './pages/FacultyPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="mid" element={<MidPage />} />
          <Route path="final" element={<FinalPage />} />
          <Route path="marks" element={<MarksPage />} />
          <Route path="cgpa" element={<CGPAPage />} />
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all 404 - optional */}
        <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;