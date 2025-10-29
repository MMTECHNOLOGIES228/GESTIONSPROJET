export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

export interface IProject {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  progress: number; // 0-100
  settings: {
    is_public?: boolean;
    allow_guest_comments?: boolean;
    task_approval_required?: boolean;
    default_task_status?: string;
  };
  tags: string[];
  created_by: string; // Reference to auth-service user
  created_at: Date;
  updated_at: Date;
  
  // Statistics (virtual/computed)
  total_tasks?: number;
  completed_tasks?: number;
  overdue_tasks?: number;
}

export interface IProjectCreate {
  organization_id: string;
  name: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  settings?: Partial<IProject['settings']>;
  tags?: string[];
  created_by: string;
}

export interface IProjectUpdate {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  progress?: number;
  settings?: Partial<IProject['settings']>;
  tags?: string[];
}

export interface IProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
}