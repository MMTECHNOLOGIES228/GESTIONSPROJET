import { projectApiClient } from './api/api';
import { Project } from '../types/project.types';

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  budget?: number;
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  budget?: number;
  tags?: string[];
  progress?: number;
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  planning: number;
}

export const projectService = {
  // Récupérer tous les projets
  async getProjects(filters: ProjectFilters = {}): Promise<ApiResponse<Project[]>> {
    const response = await projectApiClient.get('/projects', { params: filters });
    return response.data;
  },

  // Récupérer les statistiques des projets
  async getProjectStats(): Promise<ApiResponse<ProjectStats>> {
    const response = await projectApiClient.get('/projects/stats');
    return response.data;
  },

  // Récupérer un projet par ID
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    const response = await projectApiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Créer un nouveau projet
  async createProject(projectData: CreateProjectData): Promise<ApiResponse<Project>> {
    const response = await projectApiClient.post('/projects', projectData);
    return response.data;
  },

  // Mettre à jour un projet
  async updateProject(id: string, projectData: UpdateProjectData): Promise<ApiResponse<Project>> {
    const response = await projectApiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Supprimer un projet
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    const response = await projectApiClient.delete(`/projects/${id}`);
    return response.data;
  },

  // Récupérer les membres d'un projet
  async getProjectMembers(projectId: string): Promise<ApiResponse<any[]>> {
    const response = await projectApiClient.get(`/projects/${projectId}/members`);
    return response.data;
  },

  // Ajouter un membre à un projet
  async addProjectMember(projectId: string, userId: string, role: string = 'member'): Promise<ApiResponse<any>> {
    const response = await projectApiClient.post(`/projects/${projectId}/members`, {
      user_id: userId,
      role
    });
    return response.data;
  },

  // Supprimer un membre d'un projet
  async removeProjectMember(projectId: string, userId: string): Promise<ApiResponse<void>> {
    const response = await projectApiClient.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  }
};