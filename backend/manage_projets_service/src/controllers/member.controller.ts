import { Request, Response } from 'express';
import { MemberService } from '../services/member.service';
import { ITenantRequest } from '../interfaces/api.interface';
import { IPagination } from '../interfaces/api.interface';
import { IMemberCreate, IMemberUpdate, IMemberInvite } from '../interfaces/member.interface';

export class MemberController {
    private memberService: MemberService;

    constructor() {
        this.memberService = new MemberService();
    }

    /**
     * Get all members for current organization
     */
     async getOrganizationMembers (req: ITenantRequest, res: Response) {
        try {
            const organizationId = req.tenant.organization_id;
            const userId = req.user.id;

            const pagination: IPagination = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 50
            };

            const result = await this.memberService.getOrganizationMembers(
                organizationId,
                userId,
                pagination
            );

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getOrganizationMembers controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Add member to organization
     */
    async addMember  (req: ITenantRequest, res: Response) {
        try {
            const memberData: IMemberCreate = req.body;
            const userId = req.user.id;

            // Ensure organization_id matches the tenant context
            memberData.organization_id = req.tenant.organization_id;

            const result = await this.memberService.addMember(memberData, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch (error) {
            console.error('Error in addMember controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Update member role and permissions
     */
    async updateMember  (req: ITenantRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData: IMemberUpdate = req.body;
            const userId = req.user.id;
            const organizationId = req.tenant.organization_id;

            const result = await this.memberService.updateMember(
                id,
                organizationId,
                updateData,
                userId
            );

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in updateMember controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Remove member from organization
     */
   async removeMember  (req: ITenantRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const organizationId = req.tenant.organization_id;

            const result = await this.memberService.removeMember(id, organizationId, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in removeMember controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Invite member to organization via email
     */
    async inviteMember   (req: ITenantRequest, res: Response) {
        try {
            const inviteData: IMemberInvite = req.body;
            const userId = req.user.id;

            // Ensure organization_id matches the tenant context
            inviteData.organization_id = req.tenant.organization_id;
            inviteData.invited_by = userId;

            const result = await this.memberService.inviteMember(inviteData, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch (error) {
            console.error('Error in inviteMember controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Get current user's membership info
     */
   async getMyMembership  (req: ITenantRequest, res: Response)  {
        try {
            const organizationId = req.tenant.organization_id;
            const userId = req.user.id;

            const result = await this.memberService.getMemberByUser(organizationId, userId);

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getMyMembership controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}