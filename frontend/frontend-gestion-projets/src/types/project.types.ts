export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  startDate?: string;
  endDate?: string;
  budget?: number;
  tags?: string[];
  tasksCount?: number;
  createdAt: string;
  updatedAt: string;
}