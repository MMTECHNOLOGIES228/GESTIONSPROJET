export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITask {
  id: string;
  project_id: string;
  organization_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  assignee_id?: string; // Reference to auth-service user
  created_by: string; // Reference to auth-service user
  position: number; // For drag & drop ordering
  tags: string[];
  metadata: {
    parent_task_id?: string;
    is_subtask?: boolean;
    dependencies?: string[]; // Task IDs this task depends on
    attachments_count?: number;
    comments_count?: number;
  };
  created_at: Date;
  updated_at: Date;
  
  // Joined fields (virtual)
  project_name?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  creator_name?: string;
}

export interface ITaskCreate {
  project_id: string;
  organization_id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
  estimated_hours?: number;
  assignee_id?: string;
  created_by: string;
  position?: number;
  tags?: string[];
  metadata?: Partial<ITask['metadata']>;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  assignee_id?: string;
  position?: number;
  tags?: string[];
  metadata?: Partial<ITask['metadata']>;
}

export interface ITaskFilter {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignee_id?: string | string[];
  project_id?: string | string[];
  tags?: string[];
  due_date_from?: Date;
  due_date_to?: Date;
}