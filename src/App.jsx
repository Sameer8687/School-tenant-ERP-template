import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import AcademicsPage from './pages/AcademicsPage';
import AttendancePage from './pages/AttendancePage';
import FeesPage from './pages/FeesPage';
import ExaminationsPage from './pages/ExaminationsPage';
import StaffPage from './pages/StaffPage';
import TransportPage from './pages/TransportPage';
import LibraryPage from './pages/LibraryPage';
import ReportsPage from './pages/ReportsPage';
import SchoolSettingsPage from './pages/SchoolSettingsPage';
import PlatformAdminPage from './pages/PlatformAdminPage';
import AdmissionsPage from './pages/AdmissionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/academics" element={<AcademicsPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/fees" element={<FeesPage />} />
              <Route path="/examinations" element={<ExaminationsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/school-settings" element={<SchoolSettingsPage />} />
              <Route path="/settings" element={<Navigate to="/school-settings" replace />} />
              <Route path="/platform-preview" element={<PlatformAdminPage />} />
              <Route path="/admissions" element={<AdmissionsPage />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
