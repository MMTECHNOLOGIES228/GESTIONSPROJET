export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  USERS: '/users',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  ORGANIZATIONS: '/organizations',
};

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ORGANIZATION_OWNER: 'Organization Owner',
  ORGANIZATION_ADMIN: 'Organization Admin',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_LEAD: 'Team Lead',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
};

export default { API_ENDPOINTS, ROLES }; // ← AJOUTER CETTE LIGNE