

// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse, LoginCredentials } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => Promise<void>; // Ajout de refreshUser
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Erreur de vérification auth:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  // Implémentation de refreshUser
  const refreshUser = async () => {
    try {
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      logout();
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const authResponse: AuthResponse = await authService.login(credentials);

      if (authResponse.accessToken) {
        localStorage.setItem('token', authResponse.accessToken);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        setUser(authResponse.user);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    authService.logout();
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return user?.role?.role_name === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};