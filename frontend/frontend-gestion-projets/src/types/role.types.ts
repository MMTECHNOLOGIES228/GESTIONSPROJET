// types/role.types.ts
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