// Events for inter-service communication
export interface IUserEvent {
  type: 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED';
  data: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    deleted_at?: Date;
  };
}

export interface IProjectEvent {
  type: 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_DELETED';
  data: {
    id: string;
    organization_id: string;
    name: string;
    created_by: string;
    deleted_at?: Date;
  };
}

export interface ITaskEvent {
  type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED' | 'TASK_ASSIGNED';
  data: {
    id: string;
    project_id: string;
    organization_id: string;
    title: string;
    assignee_id?: string;
    created_by: string;
    deleted_at?: Date;
  };
}