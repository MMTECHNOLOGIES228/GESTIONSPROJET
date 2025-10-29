export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  estimatedHours?: number;
  projectId: string;
  project?: {
    id: string;
    name: string;
  };
  assigneeId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}