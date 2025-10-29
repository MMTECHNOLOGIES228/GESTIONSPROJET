// services/role.service.ts
import { authApiClient } from './api/api';

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

export interface CreateRoleData {
  role_name: string;
  role_description: string;
}

export interface UpdateRoleData {
  role_name?: string;
  role_description?: string;
}

export interface CreatePermissionData {
  perm_name: string;
  perm_description: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export const roleService = {
  // Rôles
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await authApiClient.get('/roles');
    return response.data;
  },

  async getRoleById(id: string): Promise<ApiResponse<Role>> {
    const response = await authApiClient.get(`/roles/${id}`);
    return response.data;
  },

  async createRole(roleData: CreateRoleData): Promise<ApiResponse<Role>> {
    const response = await authApiClient.post('/roles', roleData);
    return response.data;
  },

  async updateRole(id: string, roleData: UpdateRoleData): Promise<ApiResponse<Role>> {
    const response = await authApiClient.put(`/roles/${id}`, roleData);
    return response.data;
  },

  async deleteRole(id: string): Promise<ApiResponse<void>> {
    const response = await authApiClient.delete(`/roles/${id}`);
    return response.data;
  },

  // Permissions
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await authApiClient.get('/permissions');
    return response.data;
  },

  async createPermission(permissionData: CreatePermissionData): Promise<ApiResponse<Permission>> {
    const response = await authApiClient.post('/permissions', permissionData);
    return response.data;
  },

  async updatePermission(id: string, permissionData: CreatePermissionData): Promise<ApiResponse<Permission>> {
    const response = await authApiClient.put(`/permissions/${id}`, permissionData);
    return response.data;
  },

  async deletePermission(id: string): Promise<ApiResponse<void>> {
    const response = await authApiClient.delete(`/permissions/${id}`);
    return response.data;
  },

  // Gestion des permissions des rôles
  async getRolePermissions(roleId: string): Promise<ApiResponse<Role>> {
    const response = await authApiClient.get(`/rolesPermission/roles/${roleId}/permissions`);
    return response.data;
  },

  async addPermissionToRole(roleId: string, permId: string): Promise<ApiResponse<any>> {
    const response = await authApiClient.post('/rolesPermission', {
      roleId,
      permId
    });
    return response.data;
  },

  async addPermissionsToRole(roleId: string, permIds: string[]): Promise<ApiResponse<any[]>> {
    const response = await authApiClient.post(`/rolesPermission/roles/${roleId}/permissions`, {
      permIds
    });
    return response.data;
  },

  async removePermissionFromRole(roleId: string, permId: string): Promise<ApiResponse<void>> {
    const response = await authApiClient.delete(`/rolesPermission/roles/${roleId}/permissions/${permId}`);
    return response.data;
  },

  async removePermissionsFromRole(roleId: string, permIds: string[]): Promise<ApiResponse<void>> {
    const response = await authApiClient.delete(`/rolesPermission/roles/${roleId}/permissions`, {
      data: { permIds }
    });
    return response.data;
  },

  async getRolesWithPermissions(): Promise<ApiResponse<Role[]>> {
    const response = await authApiClient.get('/rolesPermission/roles-with-permissions');
    return response.data;
  }
};