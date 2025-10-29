export interface User {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    profilePic?: string;
    status: 'actif' | 'inactif' | 'en_attente';
    phone?: string;
    authMethod: 'email' | 'phone' | 'google';
    emailVerified?: boolean;
    phoneVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
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