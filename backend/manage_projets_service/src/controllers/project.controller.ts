import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { ITenantRequest } from '../interfaces/api.interface';
import { IProjectCreate, IProjectUpdate } from '../interfaces/project.interface';
import { IPagination } from '../interfaces/api.interface';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  /**
   * Create a new project
   */
  createProject = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const projectData: IProjectCreate = req.body;
      const userId = req.user.id;

      // Ensure organization_id matches the tenant context
      projectData.organization_id = req.tenant.organization_id;

      const result = await this.projectService.createProject(projectData, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createProject controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get project by ID
   */
  getProject = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.projectService.getProjectById(id, userId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getProject controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get all projects for current organization
   */
  getOrganizationProjects = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.tenant.organization_id;
      const userId = req.user.id;
      
      const pagination: IPagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC'
      };

      const result = await this.projectService.getOrganizationProjects(
        organizationId, 
        userId, 
        pagination
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getOrganizationProjects controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Update project
   */
  updateProject = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: IProjectUpdate = req.body;
      const userId = req.user.id;

      const result = await this.projectService.updateProject(id, updateData, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateProject controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Delete project
   */
  deleteProject = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.projectService.deleteProject(id, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in deleteProject controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get project statistics for organization
   */
  getProjectStats = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.tenant.organization_id;
      const userId = req.user.id;

      const result = await this.projectService.getProjectStats(organizationId, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getProjectStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}