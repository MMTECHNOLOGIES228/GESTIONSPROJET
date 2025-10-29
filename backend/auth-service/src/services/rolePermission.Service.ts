import { Role, Permission, RolePermission } from '../db/sequelize';
import { RolePermissionAttributes } from '../interfaces/rolepermissionAttributes';

export class RolePermissionService {
    /**
     * Ajouter une permission à un rôle
     */
    async addPermissionToRole(roleId: string, permId: string): Promise<RolePermissionAttributes> {
        try {
            // Vérifier si le rôle existe
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Rôle non trouvé');
            }

            // Vérifier si la permission existe
            const permission = await Permission.findByPk(permId);
            if (!permission) {
                throw new Error('Permission non trouvée');
            }

            // Vérifier si l'association existe déjà
            const existingAssociation = await RolePermission.findOne({
                where: { roleId, permId }
            });

            if (existingAssociation) {
                throw new Error('Cette permission est déjà associée au rôle');
            }

            // Créer l'association
            const rolePermission = await RolePermission.create({
                roleId,
                permId
            });

            return rolePermission.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout de la permission au rôle: ${error}`);
        }
    }

    /**
     * Ajouter plusieurs permissions à un rôle
     */
    async addPermissionsToRole(roleId: string, permIds: string[]): Promise<RolePermissionAttributes[]> {
        try {
            // Vérifier si le rôle existe
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new Error('Rôle non trouvé');
            }

            // Vérifier si les permissions existent
            const permissions = await Permission.findAll({
                where: { id: permIds }
            });

            if (permissions.length !== permIds.length) {
                throw new Error('Une ou plusieurs permissions non trouvées');
            }

            // Vérifier les associations existantes
            const existingAssociations = await RolePermission.findAll({
                where: {
                    roleId,
                    permId: permIds
                }
            });

            const existingPermIds = existingAssociations.map(assoc => assoc.permId);
            const newPermIds = permIds.filter(permId => !existingPermIds.includes(permId));

            if (newPermIds.length === 0) {
                throw new Error('Toutes ces permissions sont déjà associées au rôle');
            }

            // Créer les nouvelles associations
            const rolePermissions = await Promise.all(
                newPermIds.map(permId =>
                    RolePermission.create({ roleId, permId })
                )
            );

            return rolePermissions.map(rp => rp.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de l'ajout des permissions au rôle: ${error}`);
        }
    }

    /**
     * Récupérer toutes les permissions d'un rôle
     */
    async getRolePermissions(roleId: string): Promise<any> {
        try {
            const role = await Role.findByPk(roleId, {
                include: [{
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] } // Exclure les attributs de la table de liaison
                }]
            });

            if (!role) {
                throw new Error('Rôle non trouvé');
            }

            return role;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des permissions du rôle: ${error}`);
        }
    }

    /**
     * Supprimer une permission d'un rôle
     */
    async removePermissionFromRole(roleId: string, permId: string): Promise<boolean> {
        try {
            const rolePermission = await RolePermission.findOne({
                where: { roleId, permId }
            });

            if (!rolePermission) {
                throw new Error('Association rôle-permission non trouvée');
            }

            await rolePermission.destroy();
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la permission du rôle: ${error}`);
        }
    }

    /**
     * Supprimer plusieurs permissions d'un rôle
     */
    async removePermissionsFromRole(roleId: string, permIds: string[]): Promise<boolean> {
        try {
            const result = await RolePermission.destroy({
                where: {
                    roleId,
                    permId: permIds
                }
            });

            if (result === 0) {
                throw new Error('Aucune association rôle-permission trouvée pour suppression');
            }

            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression des permissions du rôle: ${error}`);
        }
    }

    /**
     * Récupérer tous les rôles avec leurs permissions
     */
    async getAllRolesWithPermissions(): Promise<any[]> {
        try {
            const roles = await Role.findAll({
                include: [{
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }],
                order: [['createdAt', 'DESC']]
            });

            return roles;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des rôles avec permissions: ${error}`);
        }
    }
}

export default new RolePermissionService();