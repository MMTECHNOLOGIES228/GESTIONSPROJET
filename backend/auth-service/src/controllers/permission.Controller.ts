import { Request, Response } from 'express';
import permissionService from '../services/permission.Service';
import { PermissionAttributes } from '../interfaces/permissionAttributes';

export class PermissionController {
    /**
     * Créer une nouvelle permission
     */
    async createPermission(req: Request, res: Response) {
        try {
            const { perm_name, perm_description } = req.body;

            // Validation des données
            if (!perm_name || !perm_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom et la description de la permission sont requis'
                });
            }

            // Vérifier si la permission existe déjà
            const existingPermission = await permissionService.getPermissionByName(perm_name);
            if (existingPermission) {
                return res.status(409).json({
                    success: false,
                    message: 'Une permission avec ce nom existe déjà'
                });
            }

            const permissionData: PermissionAttributes = {
                perm_name,
                perm_description
            };

            const permission = await permissionService.createPermission(permissionData);

            return res.status(201).json({
                success: true,
                message: 'Permission créée avec succès',
                data: permission
            });
        } catch (error) {
            console.error('Erreur création permission:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer toutes les permissions
     */
    async getAllPermissions(req: Request, res: Response) {
        try {
            const permissions = await permissionService.getAllPermissions();

            return res.status(200).json({
                success: true,
                message: 'Permissions récupérées avec succès',
                data: permissions,
                count: permissions.length
            });
        } catch (error) {
            console.error('Erreur récupération permissions:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer une permission par son ID
     */
    async getPermissionById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const permission = await permissionService.getPermissionById(id);
            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'Permission non trouvée'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Permission récupérée avec succès',
                data: permission
            });
        } catch (error) {
            console.error('Erreur récupération permission:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Mettre à jour une permission
     */
    async updatePermission(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { perm_name, perm_description } = req.body;

            // Vérifier si la permission existe
            const permissionExists = await permissionService.permissionExists(id);
            if (!permissionExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Permission non trouvée'
                });
            }

            // Vérifier si le nouveau nom est déjà utilisé par une autre permission
            if (perm_name) {
                const existingPermission = await permissionService.getPermissionByName(perm_name);
                if (existingPermission && existingPermission.id !== id) {
                    return res.status(409).json({
                        success: false,
                        message: 'Une permission avec ce nom existe déjà'
                    });
                }
            }

            const updateData = {
                ...(perm_name && { perm_name }),
                ...(perm_description && { perm_description })
            };

            const updatedPermission = await permissionService.updatePermission(id, updateData);

            return res.status(200).json({
                success: true,
                message: 'Permission mise à jour avec succès',
                data: updatedPermission
            });
        } catch (error) {
            console.error('Erreur mise à jour permission:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Supprimer une permission
     */
    async deletePermission(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Vérifier si la permission existe
            const permissionExists = await permissionService.permissionExists(id);
            if (!permissionExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Permission non trouvée'
                });
            }

            await permissionService.deletePermission(id);

            return res.status(200).json({
                success: true,
                message: 'Permission supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur suppression permission:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Rechercher des permissions
     */
    async searchPermissions(req: Request, res: Response) {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Le terme de recherche est requis'
                });
            }

            const permissions = await permissionService.searchPermissions(q);

            return res.status(200).json({
                success: true,
                message: 'Résultats de recherche récupérés avec succès',
                data: permissions,
                count: permissions.length
            });
        } catch (error) {
            console.error('Erreur recherche permissions:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer les permissions avec pagination
     */
    async getPermissionsPaginated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (page < 1 || limit < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Les paramètres page et limit doivent être supérieurs à 0'
                });
            }

            const result = await permissionService.getPermissionsPaginated(page, limit);

            return res.status(200).json({
                success: true,
                message: 'Permissions récupérées avec succès',
                data: result.permissions,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalItems: result.total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error('Erreur récupération paginée permissions:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

export default new PermissionController();