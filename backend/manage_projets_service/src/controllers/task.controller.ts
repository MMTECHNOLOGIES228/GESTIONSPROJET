import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ITenantRequest } from '../interfaces/api.interface';
import { ITaskCreate, ITaskUpdate, ITaskFilter } from '../interfaces/task.interface';
import { IPagination } from '../interfaces/api.interface';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * Create a new task
   */
  createTask = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const taskData: ITaskCreate = req.body;
      const userId = req.user.id;

      // Ensure organization_id matches the tenant context
      taskData.organization_id = req.tenant.organization_id;

      const result = await this.taskService.createTask(taskData, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createTask controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get task by ID
   */
  getTask = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.taskService.getTaskById(id, userId);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getTask controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get tasks for a project
   */
  getProjectTasks = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Build filters from query parameters
      const filters: ITaskFilter = {
        status: req.query.status as any,
        priority: req.query.priority as any,
        assignee_id: req.query.assignee_id as any,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        due_date_from: req.query.due_date_from ? new Date(req.query.due_date_from as string) : undefined,
        due_date_to: req.query.due_date_to ? new Date(req.query.due_date_to as string) : undefined
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ITaskFilter] === undefined) {
          delete filters[key as keyof ITaskFilter];
        }
      });

      const pagination: IPagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC'
      };

      const result = await this.taskService.getProjectTasks(
        projectId, 
        userId, 
        filters, 
        pagination
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getProjectTasks controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Update task
   */
  updateTask = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: ITaskUpdate = req.body;
      const userId = req.user.id;

      const result = await this.taskService.updateTask(id, updateData, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateTask controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Update task position (for drag & drop)
   */
  updateTaskPosition = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { position } = req.body;
      const userId = req.user.id;

      if (typeof position !== 'number' || position < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid position value'
        });
        return;
      }

      const result = await this.taskService.updateTaskPosition(id, position, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateTaskPosition controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Delete task
   */
  deleteTask = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await this.taskService.deleteTask(id, userId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in deleteTask controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Search tasks across organization
   */
  searchTasks = async (req: ITenantRequest, res: Response): Promise<void> => {
    try {
      const organizationId = req.tenant.organization_id;
      const userId = req.user.id;
      const { q: query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const pagination: IPagination = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };

      const result = await this.taskService.searchTasks(
        organizationId,
        userId,
        query,
        pagination
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in searchTasks controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}