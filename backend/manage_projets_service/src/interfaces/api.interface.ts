import { Request } from 'express';

// Common API responses
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IAuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    organization_id?: string;
  };
}

export interface ITenantRequest extends IAuthRequest {
  tenant: {
    organization_id: string;
    user_id: string;
    user_role: string;
  };
}

// Pagination interface
export interface IPagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Search interface
export interface ISearchParams {
  query: string;
  fields: string[];
}