import { Request, Response } from 'express';
import roleService from '../services/role.Service';
import { RoleAttributes } from 'src/interfaces/roleAttributes';



export class RoleController {
    /**
     * Créer un nouveau rôle
     */
    async createRole(req: Request, res: Response) {
        try {
            const { role_name, role_description } = req.body;

            // Validation des données
            if (!role_name || !role_description) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom et la description du rôle sont requis'
                });
            }

            // Vérifier si le rôle existe déjà
            const existingRole = await roleService.getRoleByName(role_name);
            if (existingRole) {
                return res.status(409).json({
                    success: false,
                    message: 'Un rôle avec ce nom existe déjà'
                });
            }

            const roleData: RoleAttributes = {
                role_name,
                role_description
            };

            const role = await roleService.createRole(roleData);

            return res.status(201).json({
                success: true,
                message: 'Rôle créé avec succès',
                data: role
            });
        } catch (error) {
            console.error('Erreur création rôle:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer tous les rôles
     */
    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await roleService.getAllRoles();

            return res.status(200).json({
                success: true,
                message: 'Rôles récupérés avec succès',
                data: roles,
                count: roles.length
            });
        } catch (error) {
            console.error('Erreur récupération rôles:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer un rôle par son ID
     */
    async getRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const role = await roleService.getRoleById(id);
            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Rôle non trouvé'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Rôle récupéré avec succès',
                data: role
            });
        } catch (error) {
            console.error('Erreur récupération rôle:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Mettre à jour un rôle
     */
    async updateRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { role_name, role_description } = req.body;

            // Vérifier si le rôle existe
            const roleExists = await roleService.roleExists(id);
            if (!roleExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Rôle non trouvé'
                });
            }

            // Vérifier si le nouveau nom est déjà utilisé par un autre rôle
            if (role_name) {
                const existingRole = await roleService.getRoleByName(role_name);
                if (existingRole && existingRole.id !== id) {
                    return res.status(409).json({
                        success: false,
                        message: 'Un rôle avec ce nom existe déjà'
                    });
                }
            }

            const updateData = {
                ...(role_name && { role_name }),
                ...(role_description && { role_description })
            };

            const updatedRole = await roleService.updateRole(id, updateData);

            return res.status(200).json({
                success: true,
                message: 'Rôle mis à jour avec succès',
                data: updatedRole
            });
        } catch (error) {
            console.error('Erreur mise à jour rôle:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Supprimer un rôle
     */
    async deleteRole(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Vérifier si le rôle existe
            const roleExists = await roleService.roleExists(id);
            if (!roleExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Rôle non trouvé'
                });
            }

            await roleService.deleteRole(id);

            return res.status(200).json({
                success: true,
                message: 'Rôle supprimé avec succès'
            });
        } catch (error) {
            console.error('Erreur suppression rôle:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

export default new RoleController();