import { Op } from 'sequelize';
import { ITask, ITaskCreate, ITaskFilter, ITaskUpdate } from '../interfaces/task.interface';
import { IApiResponse, IPagination } from '../interfaces/api.interface';
import { Task, Project, Organization, Member } from "../db/sequelize";



export class TaskService {
  /**
   * Create a new task
   */
  async createTask(data: ITaskCreate, userId: string): Promise<IApiResponse<ITask>> {
    try {
      // Verify user has access to project and organization
      const project = await Project.findOne({
        include: [{
          model: Organization,
          as: 'organization',
          include: [{
            model: Member,
            as: 'members',
            where: { user_id: userId },
            required: true
          }]
        }],
        where: { id: data.project_id }
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found or access denied'
        };
      }

      // Get next position in the project
      const lastTask = await Task.findOne({
        where: { project_id: data.project_id },
        order: [['position', 'DESC']]
      });

      const position = lastTask ? lastTask.position + 1 : 0;

      const task = await Task.create({
        ...data,
        position,
        created_by: userId
      });

      const createdTask = await Task.findByPk(task.id, {
        include: ['project']
      });

      return {
        success: true,
        message: 'Task created successfully',
        data: createdTask!.toJSON()
      };
    } catch (error) {
      console.error('Error creating task:', error);
      return {
        success: false,
        message: 'Failed to create task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get task by ID with access control
   */
  async getTaskById(id: string, userId: string): Promise<IApiResponse<ITask>> {
    try {
      const task = await Task.findOne({
        include: [{
          model: Project,
          as: 'project',
          include: [{
            model: Organization,
            as: 'organization',
            include: [{
              model: Member,
              as: 'members',
              where: { user_id: userId },
              required: true
            }]
          }]
        }],
        where: { id }
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found or access denied'
        };
      }

      return {
        success: true,
        message: 'Task retrieved successfully',
        data: task.toJSON()
      };
    } catch (error) {
      console.error('Error getting task:', error);
      return {
        success: false,
        message: 'Failed to retrieve task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get tasks for a project with filtering and pagination
   */
  async getProjectTasks(
    projectId: string, 
    userId: string,
    filters: ITaskFilter = {},
    pagination: IPagination = { page: 1, limit: 20 }
  ): Promise<IApiResponse<ITask[]>> {
    try {
      // Verify user has access to project
      const project = await Project.findOne({
        include: [{
          model: Organization,
          as: 'organization',
          include: [{
            model: Member,
            as: 'members',
            where: { user_id: userId },
            required: true
          }]
        }],
        where: { id: projectId }
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found or access denied'
        };
      }

      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      // Build where clause for filters
      const where: any = { project_id: projectId };

      if (filters.status) {
        where.status = Array.isArray(filters.status) 
          ? { [Op.in]: filters.status } 
          : filters.status;
      }

      if (filters.priority) {
        where.priority = Array.isArray(filters.priority) 
          ? { [Op.in]: filters.priority } 
          : filters.priority;
      }

      if (filters.assignee_id) {
        where.assignee_id = Array.isArray(filters.assignee_id) 
          ? { [Op.in]: filters.assignee_id } 
          : filters.assignee_id;
      }

      if (filters.due_date_from || filters.due_date_to) {
        where.due_date = {};
        if (filters.due_date_from) where.due_date[Op.gte] = filters.due_date_from;
        if (filters.due_date_to) where.due_date[Op.lte] = filters.due_date_to;
      }

      if (filters.tags && filters.tags.length > 0) {
        where.tags = { [Op.overlap]: filters.tags };
      }

      const { count, rows } = await Task.findAndCountAll({
        where,
        order: [
          ['position', 'ASC'],
          ['created_at', 'DESC']
        ],
        limit,
        offset
      });

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: rows.map(task => task.toJSON()),
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting project tasks:', error);
      return {
        success: false,
        message: 'Failed to retrieve tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update task
   */
  async updateTask(
    id: string, 
    data: ITaskUpdate, 
    userId: string
  ): Promise<IApiResponse<ITask>> {
    try {
      const task = await Task.findOne({
        include: [{
          model: Project,
          as: 'project',
          include: [{
            model: Organization,
            as: 'organization',
            include: [{
              model: Member,
              as: 'members',
              where: { user_id: userId },
              required: true
            }]
          }]
        }],
        where: { id }
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found or access denied'
        };
      }

      await Task.update(data, { where: { id } });
      const updatedTask = await Task.findByPk(id, {
        include: ['project']
      });

      return {
        success: true,
        message: 'Task updated successfully',
        data: updatedTask!.toJSON()
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return {
        success: false,
        message: 'Failed to update task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update task position (for drag & drop)
   */
  async updateTaskPosition(
    id: string, 
    position: number, 
    userId: string
  ): Promise<IApiResponse<ITask>> {
    try {
      const task = await Task.findOne({
        include: [{
          model: Project,
          as: 'project',
          include: [{
            model: Organization,
            as: 'organization',
            include: [{
              model: Member,
              as: 'members',
              where: { user_id: userId },
              required: true
            }]
          }]
        }],
        where: { id }
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found or access denied'
        };
      }

      await Task.update({ position }, { where: { id } });
      const updatedTask = await Task.findByPk(id);

      return {
        success: true,
        message: 'Task position updated successfully',
        data: updatedTask!.toJSON()
      };
    } catch (error) {
      console.error('Error updating task position:', error);
      return {
        success: false,
        message: 'Failed to update task position',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: string, userId: string): Promise<IApiResponse> {
    try {
      const task = await Task.findOne({
        include: [{
          model: Project,
          as: 'project',
          include: [{
            model: Organization,
            as: 'organization',
            include: [{
              model: Member,
              as: 'members',
              where: { user_id: userId },
              required: true
            }]
          }]
        }],
        where: { id }
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found or access denied'
        };
      }

      await Task.destroy({ where: { id } });

      return {
        success: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      return {
        success: false,
        message: 'Failed to delete task',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search tasks across organization
   */
  async searchTasks(
    organizationId: string,
    userId: string,
    query: string,
    pagination: IPagination = { page: 1, limit: 20 }
  ): Promise<IApiResponse<ITask[]>> {
    try {
      // Verify user has access to organization
      const member = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: userId 
        }
      });

      if (!member) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows } = await Task.findAndCountAll({
        where: {
          organization_id: organizationId,
          [Op.or]: [
            { title: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { tags: { [Op.contains]: [query] } }
          ]
        },
        include: [{
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        }],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      return {
        success: true,
        message: 'Tasks search completed',
        data: rows.map(task => task.toJSON()),
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error searching tasks:', error);
      return {
        success: false,
        message: 'Failed to search tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}