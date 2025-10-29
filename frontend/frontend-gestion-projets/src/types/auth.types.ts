export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role?: Role;
  profilePic?: string;
  status: 'actif' | 'inactif' | 'en_attente';
  phone?: string;
  authMethod: 'email' | 'phone' | 'google';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[]; // Ajoutez cette ligne
}

export interface LoginCredentials {
    identifier: string;
    password: string;
    authMethod?: 'email' | 'phone';
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    permissions: string[];
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

export interface Role {
  id: string;
  role_name: string;
  role_description: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  perm_name: string;
  perm_description: string;
  createdAt: string;
  updatedAt: string;
}