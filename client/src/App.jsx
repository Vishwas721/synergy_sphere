import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts & Protected Route
import AppLayout from './pages/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProjectDetailPage from './pages/ProjectDetailPage';
// Page Components
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProjectsPage from './pages/ProjectsPage';
import MyTasksPage from './pages/MyTasksPage';
import SettingsPage from './pages/SettingsPage';
import PublicLayout from './pages/PublicLayout'; // 1. Import PublicLayout

// Page Components
import HomePage from './pages/HomePage'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
           <Route path="/" element={<HomePage />} />
          {/* Protected routes that use the main app layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/mytasks" element={<MyTasksPage />} />
              {/* Add other protected routes here in the future */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            </Route>
          </Route>

          {/* Redirect from the root path to the projects page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;