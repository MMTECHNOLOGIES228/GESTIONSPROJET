// hooks/useAuth.ts
import { useAuth as useAuthContext } from '../contexts/AuthContext';

// hooks/useAuth.ts
export const useAuth = () => {
  const context = useAuthContext();

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading, // Doit être 'isLoading'
    login: context.login,
    logout: context.logout,
    hasPermission: context.hasPermission,
    hasRole: context.hasRole
  };
};