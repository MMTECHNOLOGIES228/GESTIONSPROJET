export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  membersCount?: number;
  projectsCount?: number;
  createdAt: string;
  updatedAt: string;
}