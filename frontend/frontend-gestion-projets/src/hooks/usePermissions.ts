// hooks/usePermissions.ts
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user, hasPermission, hasRole } = useAuth();

  // Permissions de base
  const canCreateProject = hasPermission('project:create');
  const canReadProject = hasPermission('project:read');
  const canEditProject = hasPermission('project:write');
  const canDeleteProject = hasPermission('project:delete');
  const canManageProjectMembers = hasPermission('project:manage_members');

  const canCreateTask = hasPermission('task:create');
  const canReadTask = hasPermission('task:read');
  const canEditTask = hasPermission('task:write');
  const canDeleteTask = hasPermission('task:delete');
  const canAssignTask = hasPermission('task:assign');

  const canReadOrganization = hasPermission('organization:read');
  const canEditOrganization = hasPermission('organization:write');
  const canDeleteOrganization = hasPermission('organization:delete');
  const canManageOrganizationMembers = hasPermission('organization:manage_members');

  // Rôles
  const isSuperAdmin = hasRole('Super Admin');
  const isOrganizationOwner = hasRole('Organization Owner');
  const isOrganizationAdmin = hasRole('Organization Admin');
  const isProjectManager = hasRole('Project Manager');
  const isTeamLead = hasRole('Team Lead');
  const isMember = hasRole('Member');
  const isViewer = hasRole('Viewer');

  // Permissions dérivées pour les menus
  const canAccessProjects = canReadProject || canCreateProject;
  const canAccessTasks = canReadTask || canCreateTask;
  const canAccessOrganization = canReadOrganization || canManageOrganizationMembers || isOrganizationOwner || isOrganizationAdmin;
  const canAccessReports = isProjectManager || isOrganizationOwner || isOrganizationAdmin || isTeamLead;
  const canAccessUsers = isSuperAdmin;

  return {
    // Permissions de base
    canCreateProject,
    canReadProject,
    canEditProject,
    canDeleteProject,
    canManageProjectMembers,
    
    canCreateTask,
    canReadTask,
    canEditTask,
    canDeleteTask,
    canAssignTask,
    
    canReadOrganization,
    canEditOrganization,
    canDeleteOrganization,
    canManageOrganizationMembers,
    
    // Rôles
    isSuperAdmin,
    isOrganizationOwner,
    isOrganizationAdmin,
    isProjectManager,
    isTeamLead,
    isMember,
    isViewer,
    
    // Permissions pour les menus
    canAccessProjects,
    canAccessTasks,
    canAccessOrganization,
    canAccessReports,
    canAccessUsers,
    
    // Fonctions utilitaires
    hasPermission,
    hasRole,
    user
  };
};