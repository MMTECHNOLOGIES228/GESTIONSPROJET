import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { IAuthRequest, ITenantRequest } from '../interfaces/api.interface';
import { IOrganizationCreate, IOrganizationUpdate } from '../interfaces/organization.interface';

export class OrganizationController {
    private organizationService: OrganizationService;

    constructor() {
        this.organizationService = new OrganizationService();
    }

    /**
     * Create a new organization
     */
    createOrganization = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const organizationData: IOrganizationCreate = req.body;
            const userId = req.user.id;

            const result = await this.organizationService.createOrganization(organizationData, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch (error) {
            console.error('Error in createOrganization controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Get organization by ID
     */
    getOrganization = async (req: ITenantRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await this.organizationService.getOrganizationById(id, userId);

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getOrganization controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Get all organizations for current user
     */
    getUserOrganizations = async (req: IAuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const result = await this.organizationService.getUserOrganizations(userId);

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in getUserOrganizations controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Update organization
     */
    updateOrganization = async (req: ITenantRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData: IOrganizationUpdate = req.body;
            const userId = req.user.id;

            const result = await this.organizationService.updateOrganization(id, updateData, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in updateOrganization controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    /**
     * Delete organization
     */
    deleteOrganization = async (req: ITenantRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await this.organizationService.deleteOrganization(id, userId);

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Error in deleteOrganization controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}