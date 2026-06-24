import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout';

// Auth Pages
import { Login, Register } from './pages/auth';

// Admin Pages
import { AdminDashboard, ManageUsers, ManageJobs, Reports } from './pages/admin';

// Job Seeker Pages
import {
  JobSeekerDashboard,
  BrowseJobs,
  MyApplications,
  SavedJobs,
  JobSeekerProfile,
} from './pages/job-seeker';

// Recruiter Pages
import { RecruiterDashboard, MyJobs, Applicants, CompanyProfile } from './pages/recruiter';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard Router - Routes to appropriate dashboard based on role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'job_seeker':
      return <JobSeekerDashboard />;
    default:
      return <JobSeekerDashboard />;
  }
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'recruiter', 'job_seeker']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRouter />} />

        {/* Admin Routes */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Job Seeker Routes */}
        <Route
          path="jobs"
          element={
            <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="applications"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved-jobs"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <JobSeekerProfile />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="my-jobs"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="applicants"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="company-profile"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
