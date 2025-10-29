import { Request, Response } from 'express';
import rolePermissionService from '../services/rolePermission.Service';

export class RolePermissionController {
    /**
     * Ajouter une permission à un rôle
     */
    async addPermissionToRole(req: Request, res: Response) {
        try {
            const { roleId, permId } = req.body;

            // Validation des données
            if (!roleId || !permId) {
                return res.status(400).json({
                    success: false,
                    message: 'L\'ID du rôle et l\'ID de la permission sont requis'
                });
            }

            const rolePermission = await rolePermissionService.addPermissionToRole(roleId, permId);

            return res.status(201).json({
                success: true,
                message: 'Permission ajoutée au rôle avec succès',
                data: rolePermission
            });
        } catch (error: any) {
            console.error('Erreur ajout permission au rôle:', error);

            if (error.message.includes('non trouvé') || error.message.includes('déjà associée')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Ajouter plusieurs permissions à un rôle
     */
    async addPermissionsToRole(req: Request, res: Response) {
        try {
            const { roleId } = req.params;
            const { permIds } = req.body;

            // Validation des données
            if (!roleId || !permIds || !Array.isArray(permIds) || permIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'L\'ID du rôle et un tableau d\'IDs de permissions sont requis'
                });
            }

            const rolePermissions = await rolePermissionService.addPermissionsToRole(roleId, permIds);

            return res.status(201).json({
                success: true,
                message: `${rolePermissions.length} permission(s) ajoutée(s) au rôle avec succès`,
                data: rolePermissions,
                count: rolePermissions.length
            });
        } catch (error: any) {
            console.error('Erreur ajout permissions au rôle:', error);

            if (error.message.includes('non trouvé') || error.message.includes('déjà associée')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer toutes les permissions d'un rôle
     */
    async getRolePermissions(req: Request, res: Response) {
        try {
            const { roleId } = req.params;

            const roleWithPermissions = await rolePermissionService.getRolePermissions(roleId);

            return res.status(200).json({
                success: true,
                message: 'Permissions du rôle récupérées avec succès',
                data: roleWithPermissions
            });
        } catch (error: any) {
            console.error('Erreur récupération permissions du rôle:', error);

            if (error.message.includes('non trouvé')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Supprimer une permission d'un rôle
     */
    async removePermissionFromRole(req: Request, res: Response) {
        try {
            const { roleId, permId } = req.params;

            await rolePermissionService.removePermissionFromRole(roleId, permId);

            return res.status(200).json({
                success: true,
                message: 'Permission retirée du rôle avec succès'
            });
        } catch (error: any) {
            console.error('Erreur suppression permission du rôle:', error);

            if (error.message.includes('non trouvée')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Supprimer plusieurs permissions d'un rôle
     */
    async removePermissionsFromRole(req: Request, res: Response) {
        try {
            const { roleId } = req.params;
            const { permIds } = req.body;

            // Validation des données
            if (!permIds || !Array.isArray(permIds) || permIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Un tableau d\'IDs de permissions est requis'
                });
            }

            await rolePermissionService.removePermissionsFromRole(roleId, permIds);

            return res.status(200).json({
                success: true,
                message: 'Permissions retirées du rôle avec succès'
            });
        } catch (error: any) {
            console.error('Erreur suppression permissions du rôle:', error);

            if (error.message.includes('non trouvée')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer tous les rôles avec leurs permissions
     */
    async getAllRolesWithPermissions(req: Request, res: Response) {
        try {
            const roles = await rolePermissionService.getAllRolesWithPermissions();

            return res.status(200).json({
                success: true,
                message: 'Rôles avec permissions récupérés avec succès',
                data: roles,
                count: roles.length
            });
        } catch (error) {
            console.error('Erreur récupération rôles avec permissions:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

export default new RolePermissionController();