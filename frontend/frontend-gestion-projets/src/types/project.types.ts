// types/project.types.ts - Assurez-vous d'avoir ces types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  startDate?: string;
  endDate?: string;
  budget?: number;
  tags?: string[];
  progress?: number;
  organization_id?: string;
  created_by?: string;
  createdAt?: string;
  updatedAt?: string;
}