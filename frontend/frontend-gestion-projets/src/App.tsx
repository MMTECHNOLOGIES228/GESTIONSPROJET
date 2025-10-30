import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectsList from './pages/projects/ProjectsList';
import TasksList from './pages/tasks/TasksList';
import Organizations from './pages/organizations/Organizations';
import OrganizationSettings from './pages/organizations/OrganizationSettings';
import OrganizationMembers from './pages/organizations/OrganizationMembers';
import OrganizationBilling from './pages/organizations/OrganizationBilling';
import Users from './pages/users/Users';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import RolesPermissions from './pages/users/RolesPermissions';
import CreateProject from './pages/projects/CreateProject';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute requiredPermissions={['project:read']}>
                <ProjectsList />
              </ProtectedRoute>
            } />
            <Route path="/projects/create" element={
              <ProtectedRoute requiredPermissions={['project:create']}>
                <CreateProject />
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute requiredPermissions={['task:read']}>
                <TasksList />
              </ProtectedRoute>
            } />

            {/* Routes d'organisation */}
            <Route path="/organizations" element={
              <ProtectedRoute
                requiredPermissions={['organization:read']}
                requiredRole="Organization Owner"
              >
                <Organizations />
              </ProtectedRoute>
            } />

            <Route path="/organizations/settings" element={
              <ProtectedRoute
                requiredPermissions={['organization:write']}
                requiredRole="Organization Owner"
              >
                <OrganizationSettings />
              </ProtectedRoute>
            } />

            <Route path="/organizations/members" element={
              <ProtectedRoute
                requiredPermissions={['organization:members:manage']}
                requiredRole="Organization Owner"
              >
                <OrganizationMembers />
              </ProtectedRoute>
            } />

            <Route path="/organizations/billing" element={
              <ProtectedRoute
                requiredPermissions={['organization:billing:manage']}
                requiredRole="Organization Owner"
              >
                <OrganizationBilling />
              </ProtectedRoute>
            } />

            {/* Routes d'administration système */}
            <Route path="/users" element={
              <ProtectedRoute requiredRole="Super Admin">
                <Users />
              </ProtectedRoute>
            } />

            <Route path="/users/roles" element={
              <ProtectedRoute requiredRole="Super Admin">
                <RolesPermissions />
              </ProtectedRoute>
            } />

            {/* Routes par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;