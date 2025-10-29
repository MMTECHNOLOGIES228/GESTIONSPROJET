import { Op } from 'sequelize';
import { Permission } from '../db/sequelize';
import { PermissionAttributes } from '../interfaces/permissionAttributes';

export class PermissionService {
    /**
     * Créer une nouvelle permission
     */
    async createPermission(permissionData: PermissionAttributes): Promise<PermissionAttributes> {
        try {
            const permission = await Permission.create(permissionData);
            return permission.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la création de la permission: ${error}`);
        }
    }

    /**
     * Récupérer toutes les permissions
     */
    async getAllPermissions(): Promise<PermissionAttributes[]> {
        try {
            const permissions = await Permission.findAll({
                order: [['createdAt', 'DESC']]
            });
            return permissions.map(permission => permission.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des permissions: ${error}`);
        }
    }

    /**
     * Récupérer une permission par son ID
     */
    async getPermissionById(id: string): Promise<PermissionAttributes | null> {
        try {
            const permission = await Permission.findByPk(id);
            return permission ? permission.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de la permission: ${error}`);
        }
    }

    /**
     * Récupérer une permission par son nom
     */
    async getPermissionByName(permName: string): Promise<PermissionAttributes | null> {
        try {
            const permission = await Permission.findOne({
                where: { perm_name: permName }
            });
            return permission ? permission.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la recherche de la permission: ${error}`);
        }
    }

    /**
     * Mettre à jour une permission
     */
    async updatePermission(id: string, permissionData: Partial<PermissionAttributes>): Promise<PermissionAttributes | null> {
        try {
            const permission = await Permission.findByPk(id);
            if (!permission) {
                return null;
            }

            await permission.update(permissionData);
            return permission.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la permission: ${error}`);
        }
    }

    /**
     * Supprimer une permission
     */
    async deletePermission(id: string): Promise<boolean> {
        try {
            const permission = await Permission.findByPk(id);
            if (!permission) {
                return false;
            }

            await permission.destroy();
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la permission: ${error}`);
        }
    }

    /**
     * Vérifier si une permission existe
     */
    async permissionExists(id: string): Promise<boolean> {
        try {
            const permission = await Permission.findByPk(id);
            return !!permission;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification de la permission: ${error}`);
        }
    }

    /**
     * Rechercher des permissions par terme
     */
    async searchPermissions(searchTerm: string): Promise<PermissionAttributes[]> {
        try {
            const permissions = await Permission.findAll({
                where: {
                    [Op.or]: [
                        { perm_name: { [Op.iLike]: `%${searchTerm}%` } },
                        { perm_description: { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
            return permissions.map(permission => permission.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de la recherche des permissions: ${error}`);
        }
    }

    /**
     * Récupérer les permissions avec pagination
     */
    async getPermissionsPaginated(page: number = 1, limit: number = 10): Promise<{ permissions: PermissionAttributes[], total: number, totalPages: number }> {
        try {
            const offset = (page - 1) * limit;
            
            const { count, rows } = await Permission.findAndCountAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                permissions: rows.map(permission => permission.toJSON()),
                total: count,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération paginée des permissions: ${error}`);
        }
    }
}

export default new PermissionService();