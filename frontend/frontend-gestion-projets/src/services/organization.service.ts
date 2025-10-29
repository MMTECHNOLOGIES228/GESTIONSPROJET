import { projectApiClient } from './api/api';
import { Organization } from '../types/organization.types';

export interface CreateOrganizationData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  settings?: {
    theme?: string;
    language?: string;
  };
}

export interface InviteMemberData {
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface UpdateMemberRoleData {
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions?: {
    can_create_projects?: boolean;
    can_invite_members?: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  permissions: any;
  user: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    profilePic?: string;
  };
  joined_at: string;
}

export const organizationService = {
  // Récupérer toutes les organisations de l'utilisateur
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    const response = await projectApiClient.get('/organizations');
    return response.data;
  },

  // Récupérer une organisation par ID
  async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    const response = await projectApiClient.get(`/organizations/${id}`);
    return response.data;
  },

  // Créer une nouvelle organisation
  async createOrganization(orgData: CreateOrganizationData): Promise<ApiResponse<Organization>> {
    const response = await projectApiClient.post('/organizations', orgData);
    return response.data;
  },

  // Mettre à jour une organisation
  async updateOrganization(id: string, orgData: UpdateOrganizationData): Promise<ApiResponse<Organization>> {
    const response = await projectApiClient.put(`/organizations/${id}`, orgData);
    return response.data;
  },

  // Supprimer une organisation
  async deleteOrganization(id: string): Promise<ApiResponse<void>> {
    const response = await projectApiClient.delete(`/organizations/${id}`);
    return response.data;
  },

  // Récupérer les membres d'une organisation
  async getOrganizationMembers(organizationId: string, page: number = 1, limit: number = 50): Promise<ApiResponse<OrganizationMember[]>> {
    const response = await projectApiClient.get('/members', {
      params: { organization_id: organizationId, page, limit }
    });
    return response.data;
  },

  // Récupérer les informations de membership de l'utilisateur courant
  async getMyMembership(): Promise<ApiResponse<OrganizationMember>> {
    const response = await projectApiClient.get('/members/me');
    return response.data;
  },

  // Ajouter un membre à l'organisation
  async addMember(organizationId: string, userId: string, role: 'owner' | 'admin' | 'member' | 'viewer' = 'member'): Promise<ApiResponse<OrganizationMember>> {
    const response = await projectApiClient.post('/members', {
      user_id: userId,
      role
    });
    return response.data;
  },

  // Inviter un membre par email
  async inviteMember(email: string, role: 'owner' | 'admin' | 'member' | 'viewer' = 'member'): Promise<ApiResponse<void>> {
    const response = await projectApiClient.post('/members/invite', {
      email,
      role
    });
    return response.data;
  },

  // Mettre à jour le rôle d'un membre
  async updateMemberRole(memberId: string, roleData: UpdateMemberRoleData): Promise<ApiResponse<OrganizationMember>> {
    const response = await projectApiClient.put(`/members/${memberId}`, roleData);
    return response.data;
  },

  // Supprimer un membre de l'organisation
  async removeMember(memberId: string): Promise<ApiResponse<void>> {
    const response = await projectApiClient.delete(`/members/${memberId}`);
    return response.data;
  }
};