import { Op } from 'sequelize';
import { IProject, IProjectCreate, IProjectUpdate, IProjectStats } from '../interfaces/project.interface';
import { IApiResponse, IPagination } from '../interfaces/api.interface';
import { Organization, Member, Project, Task } from '../db/sequelize';

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(data: IProjectCreate, userId: string): Promise<IApiResponse<IProject>> {
    try {
      // Check if user has permission to create projects in this organization
      const member = await Member.findOne({
        where: { 
          organization_id: data.organization_id, 
          user_id: userId 
        }
      });

      if (!member) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      const permissions = member.permissions as any;
      if (!permissions.can_create_projects && member.role !== 'owner' && member.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient permissions to create projects'
        };
      }

      const project = await Project.create({
        ...data,
        created_by: userId
      });

      return {
        success: true,
        message: 'Project created successfully',
        data: project.toJSON()
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get project by ID with access control
   */
  async getProjectById(id: string, userId: string): Promise<IApiResponse<IProject>> {
    try {
      const project = await Project.findOne({
        include: [
          {
            model: Organization,
            as: 'organization',
            include: [{
              model: Member,
              as: 'members',
              where: { user_id: userId },
              required: true
            }]
          },
          {
            model: Task,
            as: 'tasks',
            limit: 50, // Limit tasks in project overview
            order: [['created_at', 'DESC']]
          }
        ],
        where: { id }
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found or access denied'
        };
      }

      return {
        success: true,
        message: 'Project retrieved successfully',
        data: project.toJSON()
      };
    } catch (error) {
      console.error('Error getting project:', error);
      return {
        success: false,
        message: 'Failed to retrieve project',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all projects for an organization with pagination
   */
  async getOrganizationProjects(
    organizationId: string, 
    userId: string,
    pagination: IPagination = { page: 1, limit: 10 }
  ): Promise<IApiResponse<IProject[]>> {
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

      const { count, rows } = await Project.findAndCountAll({
        where: { organization_id: organizationId },
        include: [{
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status'] // For task counts
        }],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      const projectsWithStats = rows.map(project => {
        const projectData = project.toJSON() as any;
        const tasks = projectData.tasks || [];
        
        projectData.total_tasks = tasks.length;
        projectData.completed_tasks = tasks.filter((task: any) => task.status === 'done').length;
        projectData.overdue_tasks = tasks.filter((task: any) => 
          task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
        ).length;

        delete projectData.tasks; // Remove tasks array to reduce payload
        return projectData;
      });

      return {
        success: true,
        message: 'Projects retrieved successfully',
        data: projectsWithStats,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting organization projects:', error);
      return {
        success: false,
        message: 'Failed to retrieve projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update project
   */
  async updateProject(
    id: string, 
    data: IProjectUpdate, 
    userId: string
  ): Promise<IApiResponse<IProject>> {
    try {
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
        where: { id }
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found or access denied'
        };
      }

      // Check edit permissions
      const member = (project as any).organization.members[0];
      const permissions = member.permissions as any;
      
      if (!permissions.can_edit_projects && member.role !== 'owner' && member.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient permissions to edit project'
        };
      }

      await Project.update(data, { where: { id } });
      const updatedProject = await Project.findByPk(id);

      return {
        success: true,
        message: 'Project updated successfully',
        data: updatedProject!.toJSON()
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete project
   */
  async deleteProject(id: string, userId: string): Promise<IApiResponse> {
    try {
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
        where: { id }
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found or access denied'
        };
      }

      // Check delete permissions
      const member = (project as any).organization.members[0];
      const permissions = member.permissions as any;
      
      if (!permissions.can_delete_projects && member.role !== 'owner' && member.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient permissions to delete project'
        };
      }

      await Project.destroy({ where: { id } });

      return {
        success: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get project statistics for organization
   */
  async getProjectStats(organizationId: string, userId: string): Promise<IApiResponse<IProjectStats>> {
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

      const projects = await Project.findAll({
        where: { organization_id: organizationId },
        include: [{
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status', 'due_date']
        }]
      });

      const allTasks = projects.flatMap(project => (project as any).tasks);
      
      const stats: IProjectStats = {
        total_projects: projects.length,
        active_projects: projects.filter(p => p.status === 'active').length,
        completed_projects: projects.filter(p => p.status === 'completed').length,
        total_tasks: allTasks.length,
        completed_tasks: allTasks.filter((task: any) => task.status === 'done').length,
        overdue_tasks: allTasks.filter((task: any) => 
          task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
        ).length
      };

      return {
        success: true,
        message: 'Project statistics retrieved successfully',
        data: stats
      };
    } catch (error) {
      console.error('Error getting project stats:', error);
      return {
        success: false,
        message: 'Failed to retrieve project statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}