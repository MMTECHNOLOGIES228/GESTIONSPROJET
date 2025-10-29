export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface IMember {
  id: string;
  organization_id: string;
  user_id: string; // Reference to auth-service user
  role: MemberRole;
  permissions: {
    can_create_projects?: boolean;
    can_edit_projects?: boolean;
    can_delete_projects?: boolean;
    can_invite_members?: boolean;
    can_remove_members?: boolean;
    can_manage_tasks?: boolean;
  };
  joined_at: Date;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields from auth-service (virtual)
  user_email?: string;
  user_name?: string;
  user_avatar?: string;
}

export interface IMemberCreate {
  organization_id: string;
  user_id: string;
  role?: MemberRole;
  permissions?: Partial<IMember['permissions']>;
}

export interface IMemberUpdate {
  role?: MemberRole;
  permissions?: Partial<IMember['permissions']>;
}

export interface IMemberInvite {
  organization_id: string;
  email: string;
  role: MemberRole;
  invited_by: string;
}