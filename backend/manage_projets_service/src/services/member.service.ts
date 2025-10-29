import { Op } from 'sequelize';
import { Member, Organization } from '../db/sequelize';
import { IMember, IMemberCreate, IMemberInvite, IMemberUpdate, MemberRole } from '../interfaces/member.interface';
import { IPagination, IApiResponse } from '../interfaces/api.interface';




export class MemberService {
  /**
   * Get all members of an organization with pagination
   */
  async getOrganizationMembers(
    organizationId: string, 
    userId: string,
    pagination: IPagination = { page: 1, limit: 50 }
  ): Promise<IApiResponse<IMember[]>> {
    try {
      // Verify user has access to organization
      const userMembership = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: userId 
        }
      });

      if (!userMembership) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows } = await Member.findAndCountAll({
        where: { organization_id: organizationId },
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'slug']
          }
        ],
        order: [
          ['role', 'ASC'], // Owners first, then admins, then members
          ['joined_at', 'ASC']
        ],
        limit,
        offset
      });

      // In a real implementation, you would join with auth-service to get user details
      const membersWithUserInfo = rows.map(member => {
        const memberData = member.toJSON();
        // These would come from auth-service in real implementation
        return {
          ...memberData,
          user_email: `user-${memberData.user_id}@example.com`, // Mock data
          user_name: `User ${memberData.user_id.substring(0, 8)}`, // Mock data
          user_avatar: null // Mock data
        };
      });

      return {
        success: true,
        message: 'Members retrieved successfully',
        data: membersWithUserInfo,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting organization members:', error);
      return {
        success: false,
        message: 'Failed to retrieve members',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Add a member to organization
   */
  async addMember(data: IMemberCreate, requestingUserId: string): Promise<IApiResponse<IMember>> {
    try {
      // Check if requesting user has permission to add members
      const requestingMember = await Member.findOne({
        where: { 
          organization_id: data.organization_id, 
          user_id: requestingUserId 
        }
      });

      if (!requestingMember) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      const permissions = requestingMember.permissions as any;
      if (!permissions.can_invite_members && 
          requestingMember.role !== 'owner' && 
          requestingMember.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient permissions to add members'
        };
      }

      // Check if member already exists
      const existingMember = await Member.findOne({
        where: { 
          organization_id: data.organization_id, 
          user_id: data.user_id 
        }
      });

      if (existingMember) {
        return {
          success: false,
          message: 'User is already a member of this organization'
        };
      }

      // Prevent adding members with higher role than requester
      if (this.isHigherRole(data.role, requestingMember.role)) {
        return {
          success: false,
          message: 'Cannot assign a role higher than your own'
        };
      }

      const member = await Member.create(data);

      const createdMember = await Member.findByPk(member.id, {
        include: [{
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'slug']
        }]
      });

      return {
        success: true,
        message: 'Member added successfully',
        data: {
          ...createdMember!.toJSON(),
          user_email: `user-${data.user_id}@example.com`, // Mock data
          user_name: `User ${data.user_id.substring(0, 8)}`, // Mock data
        }
      };
    } catch (error) {
      console.error('Error adding member:', error);
      return {
        success: false,
        message: 'Failed to add member',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update member role and permissions
   */
  async updateMember(
    memberId: string, 
    organizationId: string, 
    data: IMemberUpdate, 
    requestingUserId: string
  ): Promise<IApiResponse<IMember>> {
    try {
      // Check if requesting user has permission to update members
      const requestingMember = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: requestingUserId 
        }
      });

      if (!requestingMember) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      // Find the member to update
      const memberToUpdate = await Member.findOne({
        where: { 
          id: memberId, 
          organization_id: organizationId 
        }
      });

      if (!memberToUpdate) {
        return {
          success: false,
          message: 'Member not found'
        };
      }

      // Prevent users from modifying their own role
      if (memberToUpdate.user_id === requestingUserId) {
        return {
          success: false,
          message: 'Cannot modify your own membership'
        };
      }

      // Check permissions based on role
      const permissions = requestingMember.permissions as any;
      const canUpdateMembers = permissions.can_remove_members || 
                               requestingMember.role === 'owner' || 
                               requestingMember.role === 'admin';

      if (!canUpdateMembers) {
        return {
          success: false,
          message: 'Insufficient permissions to update members'
        };
      }

      // Prevent promoting members to higher role than requester
      if (data.role && this.isHigherRole(data.role, requestingMember.role)) {
        return {
          success: false,
          message: 'Cannot assign a role higher than your own'
        };
      }

      // Prevent demoting the last owner
      if (data.role && data.role !== 'owner' && memberToUpdate.role === 'owner') {
        const ownerCount = await Member.count({
          where: { 
            organization_id: organizationId, 
            role: 'owner' 
          }
        });

        if (ownerCount <= 1) {
          return {
            success: false,
            message: 'Cannot remove the last owner from organization'
          };
        }
      }

      await Member.update(data, {
        where: { 
          id: memberId, 
          organization_id: organizationId 
        }
      });

      const updatedMember = await Member.findByPk(memberId, {
        include: [{
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'slug']
        }]
      });

      return {
        success: true,
        message: 'Member updated successfully',
        data: {
          ...updatedMember!.toJSON(),
          user_email: `user-${memberToUpdate.user_id}@example.com`,
          user_name: `User ${memberToUpdate.user_id.substring(0, 8)}`,
        }
      };
    } catch (error) {
      console.error('Error updating member:', error);
      return {
        success: false,
        message: 'Failed to update member',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Remove member from organization
   */
  async removeMember(
    memberId: string, 
    organizationId: string, 
    requestingUserId: string
  ): Promise<IApiResponse> {
    try {
      // Check if requesting user has permission to remove members
      const requestingMember = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: requestingUserId 
        }
      });

      if (!requestingMember) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      // Find the member to remove
      const memberToRemove = await Member.findOne({
        where: { 
          id: memberId, 
          organization_id: organizationId 
        }
      });

      if (!memberToRemove) {
        return {
          success: false,
          message: 'Member not found'
        };
      }

      // Prevent users from removing themselves
      if (memberToRemove.user_id === requestingUserId) {
        return {
          success: false,
          message: 'Cannot remove yourself from organization'
        };
      }

      // Check permissions based on role
      const permissions = requestingMember.permissions as any;
      const canRemoveMembers = permissions.can_remove_members || 
                               requestingMember.role === 'owner' || 
                               requestingMember.role === 'admin';

      if (!canRemoveMembers) {
        return {
          success: false,
          message: 'Insufficient permissions to remove members'
        };
      }

      // Prevent removing members with higher role
      if (this.isHigherRole(memberToRemove.role, requestingMember.role)) {
        return {
          success: false,
          message: 'Cannot remove members with higher role than your own'
        };
      }

      // Prevent removing the last owner
      if (memberToRemove.role === 'owner') {
        const ownerCount = await Member.count({
          where: { 
            organization_id: organizationId, 
            role: 'owner' 
          }
        });

        if (ownerCount <= 1) {
          return {
            success: false,
            message: 'Cannot remove the last owner from organization'
          };
        }
      }

      await Member.destroy({
        where: { 
          id: memberId, 
          organization_id: organizationId 
        }
      });

      return {
        success: true,
        message: 'Member removed successfully'
      };
    } catch (error) {
      console.error('Error removing member:', error);
      return {
        success: false,
        message: 'Failed to remove member',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Invite member via email (would integrate with auth service)
   */
  async inviteMember(inviteData: IMemberInvite, requestingUserId: string): Promise<IApiResponse> {
    try {
      // Check if requesting user has permission to invite members
      const requestingMember = await Member.findOne({
        where: { 
          organization_id: inviteData.organization_id, 
          user_id: requestingUserId 
        }
      });

      if (!requestingMember) {
        return {
          success: false,
          message: 'Access denied to organization'
        };
      }

      const permissions = requestingMember.permissions as any;
      if (!permissions.can_invite_members && 
          requestingMember.role !== 'owner' && 
          requestingMember.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient permissions to invite members'
        };
      }

      // Prevent inviting with higher role than requester
      if (this.isHigherRole(inviteData.role, requestingMember.role)) {
        return {
          success: false,
          message: 'Cannot assign a role higher than your own'
        };
      }

      // In a real implementation, you would:
      // 1. Check if user exists in auth service by email
      // 2. If user exists, add them directly
      // 3. If user doesn't exist, send invitation email
      // 4. Create invitation record in database

      // Mock implementation - always assume user needs to be invited
      console.log(`Invitation sent to ${inviteData.email} for role ${inviteData.role}`);

      return {
        success: true,
        message: 'Invitation sent successfully'
      };
    } catch (error) {
      console.error('Error inviting member:', error);
      return {
        success: false,
        message: 'Failed to send invitation',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get member by user ID and organization ID
   */
  async getMemberByUser(organizationId: string, userId: string): Promise<IApiResponse<IMember>> {
    try {
      const member = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: userId 
        },
        include: [{
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'slug']
        }]
      });

      if (!member) {
        return {
          success: false,
          message: 'Membership not found'
        };
      }

      return {
        success: true,
        message: 'Membership retrieved successfully',
        data: {
          ...member.toJSON(),
          user_email: `user-${userId}@example.com`,
          user_name: `User ${userId.substring(0, 8)}`,
        }
      };
    } catch (error) {
      console.error('Error getting member:', error);
      return {
        success: false,
        message: 'Failed to retrieve membership',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if a role is higher than another
   */
  private isHigherRole(role1: MemberRole, role2: MemberRole): boolean {
    const roleHierarchy = ['viewer', 'member', 'admin', 'owner'];
    return roleHierarchy.indexOf(role1) > roleHierarchy.indexOf(role2);
  }

  /**
   * Check if user has specific permission in organization
   */
  async checkUserPermission(
    organizationId: string, 
    userId: string, 
    permission: string
  ): Promise<boolean> {
    try {
      const member = await Member.findOne({
        where: { 
          organization_id: organizationId, 
          user_id: userId 
        }
      });

      if (!member) {
        return false;
      }

      // Owners and admins have all permissions
      if (member.role === 'owner' || member.role === 'admin') {
        return true;
      }

      const permissions = member.permissions as any;
      return permissions[permission] === true;
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }
}