import { Request, Response } from 'express';
import userService from '../services/user.Service';
import { UtilisateurAttributes } from '../interfaces/utilisateurAttributes';
import { AuthenticatedRequest } from '../middlewares/auth';

export class UserController {
    /**
     * Créer un nouvel utilisateur
     */
    async createUser(req: Request, res: Response) {
        try {
            const {
                role_name,
                email,
                nom,
                prenom,
                phone,
                profilePic,
                status = 'actif'
            } = req.body;

            // Validation des données
            if (!role_name || !email || !nom || !prenom) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs obligatoires doivent être remplis'
                });
            }

            // Validation de l'email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Format d\'email invalide'
                });
            }

            const userData: UtilisateurAttributes = {
                roleId: '', // Le roleId sera déterminé dans le service en fonction de role_name
                email,
                password: 'temporary', // Sera remplacé par un mot de passe temporaire
                nom,
                prenom,
                phone: phone || null,
                profilePic: profilePic || null,
                status: status as 'actif' | 'inactif',
                authMethod: 'email'
            };

            const result = await userService.createUser(userData, role_name);

            return res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                data: {
                    user: {
                        id: result.id,
                        roleId: result.roleId,
                        email: result.email,
                        nom: result.nom,
                        prenom: result.prenom,
                        phone: result.phone,
                        profilePic: result.profilePic,
                        status: result.status,
                        passwordChanged: result.passwordChanged,
                    },
                    temporaryPassword: result.temporaryPassword
                }
            });
        } catch (error: any) {
            console.error('Erreur création utilisateur:', error);

            if (error.message.includes('existe déjà') || error.message.includes('non trouvé')) {
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

    // ... Le reste du contrôleur reste inchangé
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();

            return res.status(200).json({
                success: true,
                message: 'Utilisateurs récupérés avec succès',
                data: users,
                count: users.length
            });
        } catch (error) {
            console.error('Erreur récupération utilisateurs:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await userService.getUserById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Utilisateur récupéré avec succès',
                data: user
            });
        } catch (error) {
            console.error('Erreur récupération utilisateur:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { roleId, email, nom, prenom, phone, profilePic, status } = req.body;

            // Vérifier si l'utilisateur existe
            const userExists = await userService.userExists(id);
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            const updateData = {
                ...(roleId && { roleId }),
                ...(email && { email }),
                ...(nom && { nom }),
                ...(prenom && { prenom }),
                ...(phone !== undefined && { phone }),
                ...(profilePic !== undefined && { profilePic }),
                ...(status && { status })
            };

            const updatedUser = await userService.updateUser(id, updateData);

            return res.status(200).json({
                success: true,
                message: 'Utilisateur mis à jour avec succès',
                data: updatedUser
            });
        } catch (error: any) {
            console.error('Erreur mise à jour utilisateur:', error);

            if (error.message.includes('existe déjà') || error.message.includes('non trouvé')) {
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

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Vérifier si l'utilisateur existe
            const userExists = await userService.userExists(id);
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            await userService.deleteUser(id);

            return res.status(200).json({
                success: true,
                message: 'Utilisateur supprimé avec succès'
            });
        } catch (error) {
            console.error('Erreur suppression utilisateur:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;

            // Validation des données
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel et nouveau mot de passe sont requis'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
                });
            }

            await userService.changePassword(id, currentPassword, newPassword);

            return res.status(200).json({
                success: true,
                message: 'Mot de passe changé avec succès'
            });
        } catch (error: any) {
            console.error('Erreur changement mot de passe:', error);

            if (error.message.includes('incorrect') || error.message.includes('non trouvé')) {
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

    async resetPassword(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await userService.resetPassword(id);

            return res.status(200).json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès',
                data: {
                    temporaryPassword: result.temporaryPassword
                }
            });
        } catch (error: any) {
            console.error('Erreur réinitialisation mot de passe:', error);

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

    async updateUserStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status || !['actif', 'inactif'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Statut invalide. Doit être "actif" ou "inactif"'
                });
            }

            const updatedUser = await userService.updateUserStatus(id, status as 'actif' | 'inactif');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Utilisateur ${status === 'actif' ? 'activé' : 'désactivé'} avec succès`,
                data: updatedUser
            });
        } catch (error) {
            console.error('Erreur changement statut utilisateur:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async searchUsers(req: Request, res: Response) {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Le terme de recherche est requis'
                });
            }

            const users = await userService.searchUsers(q);

            return res.status(200).json({
                success: true,
                message: 'Résultats de recherche récupérés avec succès',
                data: users,
                count: users.length
            });
        } catch (error) {
            console.error('Erreur recherche utilisateurs:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    async getUsersPaginated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            if (page < 1 || limit < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Les paramètres page et limit doivent être supérieurs à 0'
                });
            }

            const result = await userService.getUsersPaginated(page, limit);

            return res.status(200).json({
                success: true,
                message: 'Utilisateurs récupérés avec succès',
                data: result.users,
                pagination: {
                    currentPage: page,
                    totalPages: result.totalPages,
                    totalItems: result.total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error('Erreur récupération paginée utilisateurs:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}

export default new UserController();