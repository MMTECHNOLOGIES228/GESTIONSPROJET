import { Op } from 'sequelize';
import { Role } from '../db/sequelize';
import { RoleAttributes } from '../interfaces/roleAttributes';



export class RoleService {
    /**
     * Créer un nouveau rôle
     */
    async createRole(roleData: RoleAttributes): Promise<RoleAttributes> {
        try {
            const role = await Role.create(roleData);
            return role.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la création du rôle: ${error}`);
        }
    }

    /**
     * Récupérer tous les rôles
     */
    async getAllRoles(): Promise<RoleAttributes[]> {
        try {
            const roles = await Role.findAll({
                order: [['createdAt', 'DESC']]
            });
            return roles.map(role => role.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des rôles: ${error}`);
        }
    }

    /**
     * Récupérer un rôle par son ID
     */
    async getRoleById(id: string): Promise<RoleAttributes | null> {
        try {
            const role = await Role.findByPk(id);
            return role ? role.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du rôle: ${error}`);
        }
    }

    /**
     * Récupérer un rôle par son nom
     */
    async getRoleByName(roleName: string): Promise<RoleAttributes | null> {
        try {
            const role = await Role.findOne({
                where: { role_name: roleName }
            });
            return role ? role.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la recherche du rôle: ${error}`);
        }
    }

    /**
     * Mettre à jour un rôle
     */
    async updateRole(id: string, roleData: Partial<RoleAttributes>): Promise<RoleAttributes | null> {
        try {
            const role = await Role.findByPk(id);
            if (!role) {
                return null;
            }

            await role.update(roleData);
            return role.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du rôle: ${error}`);
        }
    }

    /**
     * Supprimer un rôle
     */
    async deleteRole(id: string): Promise<boolean> {
        try {
            const role = await Role.findByPk(id);
            if (!role) {
                return false;
            }

            await role.destroy();
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du rôle: ${error}`);
        }
    }

    /**
     * Vérifier si un rôle existe
     */
    async roleExists(id: string): Promise<boolean> {
        try {
            const role = await Role.findByPk(id);
            return !!role;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification du rôle: ${error}`);
        }
    }
}

export default new RoleService();