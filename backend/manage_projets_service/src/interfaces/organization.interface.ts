export interface IOrganization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string; // Reference to auth-service user
  settings: {
    theme?: string;
    language?: string;
    timezone?: string;
    allow_registration?: boolean;
    max_projects?: number;
    max_members?: number;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IOrganizationCreate {
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  settings?: Partial<IOrganization['settings']>;
}

export interface IOrganizationUpdate {
  name?: string;
  description?: string;
  settings?: Partial<IOrganization['settings']>;
}