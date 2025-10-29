import { authApiClient, projectApiClient } from './api/api';
import { User } from '../types/auth.types';

export interface CreateUserData {
  role_name: string;
  email: string;
  nom: string;
  prenom: string;
  phone?: string;
  profilePic?: string;
  status?: 'actif' | 'inactif';
}

export interface UpdateUserData {
  roleId?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  phone?: string;
  profilePic?: string;
  status?: 'actif' | 'inactif';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

export const userService = {
  // Récupérer tous les utilisateurs
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await authApiClient.get('/users');
    return response.data;
  },

  // Récupérer les utilisateurs avec pagination
  async getUsersPaginated(page: number = 1, limit: number = 10): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    const response = await authApiClient.get('/users/paginated', {
      params: { page, limit }
    });
    return response.data;
  },

  // Rechercher des utilisateurs
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    const response = await authApiClient.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  },

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await authApiClient.get(`/users/${id}`);
    return response.data;
  },

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserData): Promise<ApiResponse<{ user: User; temporaryPassword?: string }>> {
    const response = await authApiClient.post('/users', userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await authApiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await authApiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Changer le statut d'un utilisateur
  async updateUserStatus(id: string, status: 'actif' | 'inactif'): Promise<ApiResponse<User>> {
    const response = await authApiClient.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  // Réinitialiser le mot de passe (admin)
  async resetUserPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    const response = await authApiClient.post(`/users/${id}/reset-password`);
    return response.data;
  },

  // Changer le mot de passe
  async changeUserPassword(id: string, currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    const response = await authApiClient.post(`/users/${id}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};