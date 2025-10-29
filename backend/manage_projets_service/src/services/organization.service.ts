import { Op } from 'sequelize';
import { IOrganization, IOrganizationCreate, IOrganizationUpdate } from '../interfaces/organization.interface';
import { IApiResponse } from '../interfaces/api.interface';
import { Organization, Member } from '../db/sequelize';

export class OrganizationService {
  /**
   * Create a new organization
   */
  async createOrganization(data: IOrganizationCreate, ownerId: string): Promise<IApiResponse<IOrganization>> {
    try {
      // Check if slug is already taken
      const existingOrg = await Organization.findOne({
        where: { slug: data.slug }
      });

      if (existingOrg) {
        return {
          success: false,
          message: 'Organization slug already exists'
        };
      }

      const organization = await Organization.create({
        ...data,
        owner_id: ownerId
      });

      // Add owner as first member with owner role
      await Member.create({
        organization_id: organization.id,
        user_id: ownerId,
        role: 'owner',
        permissions: {
          can_create_projects: true,
          can_edit_projects: true,
          can_delete_projects: true,
          can_invite_members: true,
          can_remove_members: true,
          can_manage_tasks: true
        }
      });

      return {
        success: true,
        message: 'Organization created successfully',
        data: organization.toJSON()
      };
    } catch (error) {
      console.error('Error creating organization:', error);
      return {
        success: false,
        message: 'Failed to create organization',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get organization by ID with member access check
   */
  async getOrganizationById(id: string, userId: string): Promise<IApiResponse<IOrganization>> {
    try {
      const organization = await Organization.findOne({
        include: [{
          model: Member,
          as: 'members',
          where: { user_id: userId },
          required: true
        }],
        where: { id }
      });

      if (!organization) {
        return {
          success: false,
          message: 'Organization not found or access denied'
        };
      }

      return {
        success: true,
        message: 'Organization retrieved successfully',
        data: organization.toJSON()
      };
    } catch (error) {
      console.error('Error getting organization:', error);
      return {
        success: false,
        message: 'Failed to retrieve organization',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<IApiResponse<IOrganization[]>> {
    try {
      const organizations = await Organization.findAll({
        include: [{
          model: Member,
          as: 'members',
          where: { user_id: userId },
          attributes: ['role', 'permissions', 'joined_at']
        }],
        order: [['created_at', 'DESC']]
      });

      return {
        success: true,
        message: 'Organizations retrieved successfully',
        data: organizations.map(org => org.toJSON())
      };
    } catch (error) {
      console.error('Error getting user organizations:', error);
      return {
        success: false,
        message: 'Failed to retrieve organizations',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: string, 
    data: IOrganizationUpdate, 
    userId: string
  ): Promise<IApiResponse<IOrganization>> {
    try {
      // Check if user is owner or admin
      const member = await Member.findOne({
        where: { 
          organization_id: id, 
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!member) {
        return {
          success: false,
          message: 'Insufficient permissions to update organization'
        };
      }

      const [affectedCount] = await Organization.update(data, {
        where: { id }
      });

      if (affectedCount === 0) {
        return {
          success: false,
          message: 'Organization not found'
        };
      }

      const updatedOrganization = await Organization.findByPk(id);
      return {
        success: true,
        message: 'Organization updated successfully',
        data: updatedOrganization!.toJSON()
      };
    } catch (error) {
      console.error('Error updating organization:', error);
      return {
        success: false,
        message: 'Failed to update organization',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete organization (only for owner)
   */
  async deleteOrganization(id: string, userId: string): Promise<IApiResponse> {
    try {
      // Check if user is owner
      const member = await Member.findOne({
        where: { 
          organization_id: id, 
          user_id: userId,
          role: 'owner'
        }
      });

      if (!member) {
        return {
          success: false,
          message: 'Only organization owner can delete the organization'
        };
      }

      const deletedCount = await Organization.destroy({
        where: { id }
      });

      if (deletedCount === 0) {
        return {
          success: false,
          message: 'Organization not found'
        };
      }

      return {
        success: true,
        message: 'Organization deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting organization:', error);
      return {
        success: false,
        message: 'Failed to delete organization',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}