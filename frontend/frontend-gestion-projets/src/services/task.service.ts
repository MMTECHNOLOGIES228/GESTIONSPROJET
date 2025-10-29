import { projectApiClient } from './api/api';
import { Task } from '../types/task.types';

export interface CreateTaskData {
  project_id: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours?: number;
  assignee_id?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours?: number;
  assignee_id?: string;
  tags?: string[];
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignee_id?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export const taskService = {
  // Récupérer toutes les tâches
  async getTasks(filters: TaskFilters = {}): Promise<ApiResponse<Task[]>> {
    const response = await projectApiClient.get('/tasks', { params: filters });
    return response.data;
  },

  // Rechercher des tâches
  async searchTasks(query: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Task[]>> {
    const response = await projectApiClient.get('/tasks/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Récupérer les tâches d'un projet
  async getProjectTasks(projectId: string, filters: TaskFilters = {}): Promise<ApiResponse<Task[]>> {
    const response = await projectApiClient.get(`/projects/${projectId}/tasks`, {
      params: filters
    });
    return response.data;
  },

  // Récupérer une tâche par ID
  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await projectApiClient.get(`/tasks/${id}`);
    return response.data;
  },

  // Créer une nouvelle tâche
  async createTask(taskData: CreateTaskData): Promise<ApiResponse<Task>> {
    const response = await projectApiClient.post('/tasks', taskData);
    return response.data;
  },

  // Mettre à jour une tâche
  async updateTask(id: string, taskData: UpdateTaskData): Promise<ApiResponse<Task>> {
    const response = await projectApiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Supprimer une tâche
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await projectApiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  // Mettre à jour la position d'une tâche
  async updateTaskPosition(id: string, position: number): Promise<ApiResponse<Task>> {
    const response = await projectApiClient.patch(`/tasks/${id}/position`, { position });
    return response.data;
  }
};