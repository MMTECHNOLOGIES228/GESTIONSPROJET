import { Request, Response } from 'express';
import authService from '../services/auth.Service';
import { AuthenticatedRequest } from '../middlewares/auth';
import otpService from '../services/otp.Service';
import { Permission, Role, Utilisateur } from '../db/sequelize';

export class AuthController {
    /**
     * Créer un nouvel utilisateur
     */
    async register(req: Request, res: Response) {
        try {
            const {
                role_name,
                email,
                phone,
                password,
                nom,
                prenom,
                profilePic,
                authMethod = 'email'
            } = req.body;

            // Validation des données selon la méthode d'authentification
            if (!role_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Le role name, est obligatoires'
                });
            }

            if (authMethod === 'email' && !email) {
                return res.status(400).json({
                    success: false,
                    message: 'L\'email est obligatoire pour l\'authentification par email'
                });
            }

            if (authMethod === 'phone' && !phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Le numéro de téléphone est obligatoire pour l\'authentification par téléphone'
                });
            }

            if (authMethod === 'google') {
                return res.status(400).json({
                    success: false,
                    message: 'L\'authentification Google doit utiliser la route dédiée'
                });
            }

            // Validation de l'email si fourni
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Format d\'email invalide'
                    });
                }
            }

            // Validation du mot de passe si fourni
            if (password && password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Le mot de passe doit contenir au moins 6 caractères'
                });
            }

            const userData = {
                roleId: '', // Le roleId sera déterminé dans le service en fonction de role_name
                email: email || null,
                phone: phone || null,
                password,
                nom,
                prenom,
                profilePic: profilePic || null,
                status: 'en_attente' as const,
                authMethod: authMethod as 'email' | 'phone',
                emailVerified: false,
                phoneVerified: false,
                passwordChanged: false
            };

            const user = await authService.createUser(userData, role_name);

            // Générer et envoyer OTP si nécessaire
            if (user.otpRequired) {
                const otpType = authMethod === 'email' ? 'email' : 'phone';
                const identifier = authMethod === 'email' ? email! : phone!;

                await otpService.generateAndSendOTP(user.id!, identifier, otpType);
            }

            return res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès. Vérification OTP requise.',
                data: user
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

    /**
     * Créer un utilisateur Google
     */
    async registerWithGoogle(req: Request, res: Response) {
        try {
            const {
                role_name,
                email,
                googleId,
                nom,
                prenom,
                profilePic
            } = req.body;

            if (!role_name || !email || !googleId || !nom || !prenom) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs obligatoires doivent être remplis'
                });
            }

            const userData = {
                roleId: '', // Le roleId sera déterminé dans le service en fonction de role_name
                email,
                googleId,
                nom,
                prenom,
                profilePic: profilePic || null,
                status: 'actif' as const,
                authMethod: 'google' as const,
                emailVerified: true,
                phoneVerified: false,
                passwordChanged: false
            };

            const user = await authService.createUser(userData, role_name);

            return res.status(201).json({
                success: true,
                message: 'Utilisateur Google créé avec succès',
                data: user
            });
        } catch (error: any) {
            console.error('Erreur création utilisateur Google:', error);

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



    // Dans AuthController - méthode login
    async login(req: Request, res: Response) {
        try {
            const { identifier, password, authMethod = 'email' } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifiant et mot de passe sont requis'
                });
            }

            const result = await authService.login(identifier, password, authMethod);

            if (result.requiresOTP) {
                return res.status(200).json({
                    success: true,
                    message: 'Vérification OTP requise',
                    data: {
                        userId: result.user.id,
                        requiresOTP: true,
                        authMethod
                    }
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Connexion réussie',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    role_name: result.role_name,
                    permissions: result.permissions
                }
            });
        } catch (error: any) {
            console.error('Erreur connexion:', error);

            if (error.message.includes('incorrect') || error.message.includes('désactivé') || error.message.includes('pas actif')) {
                return res.status(401).json({
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
     * Authentifier avec Google
     */
    async loginWithGoogle(req: Request, res: Response) {
        try {
            const { googleId } = req.body;

            if (!googleId) {
                return res.status(400).json({
                    success: false,
                    message: 'Google ID est requis'
                });
            }

            const result = await authService.loginWithGoogle(googleId);

            return res.status(200).json({
                success: true,
                message: 'Connexion Google réussie',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    permissions: result.permissions
                }
            });
        } catch (error: any) {
            console.error('Erreur connexion Google:', error);

            if (error.message.includes('non trouvé') || error.message.includes('désactivé')) {
                return res.status(401).json({
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
     * Vérifier OTP et activer le compte
     */
    async verifyOTP(req: Request, res: Response) {
        try {
            console.log('Requête verifyOTP reçue avec body:', req.body);

            const { userId, code, type } = req.body;

            if (!userId || !code || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID, code OTP et type sont requis'
                });
            }

            const result = await authService.verifyOTPAndActivate(userId, code, type);

            return res.status(200).json({
                success: true,
                message: 'Compte activé avec succès',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    permissions: result.permissions
                }
            });
        } catch (error: any) {
            console.error('Erreur vérification OTP:', error);

            if (error.message.includes('invalide') || error.message.includes('expiré')) {
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
     * Renvoyer OTP
     */
    async resendOTP(req: Request, res: Response) {
        try {
            const { userId, identifier, type } = req.body;

            if (!userId || !identifier || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID, identifiant et type sont requis'
                });
            }

            await otpService.generateAndSendOTP(userId, identifier, type);

            return res.status(200).json({
                success: true,
                message: 'OTP renvoyé avec succès'
            });
        } catch (error: any) {
            console.error('Erreur renvoi OTP:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Rafraîchir le token d'accès
     */
    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token requis'
                });
            }

            const tokens = await authService.refreshAccessToken(refreshToken);

            return res.status(200).json({
                success: true,
                message: 'Token rafraîchi avec succès',
                data: tokens
            });
        } catch (error: any) {
            console.error('Erreur rafraîchissement token:', error);

            if (error.message.includes('invalide') || error.message.includes('expiré')) {
                return res.status(401).json({
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
     * Déconnecter un utilisateur
     */
    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token requis'
                });
            }

            await authService.logout(refreshToken);

            return res.status(200).json({
                success: true,
                message: 'Déconnexion réussie'
            });
        } catch (error) {
            console.error('Erreur déconnexion:', error);
            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Récupérer le profil utilisateur
     */
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }

            const user = await authService.getUserProfile(userId);

            // Construire l'URL complète pour l'image de profil si elle existe
            if (user.profilePic) {
                user.profilePic = `${req.protocol}://${req.get('host')}${user.profilePic}`;
            }

            return res.status(200).json({
                success: true,
                message: 'Profil récupéré avec succès',
                data: user
            });
        } catch (error: any) {
            console.error('Erreur récupération profil:', error);

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
     * Changer le mot de passe
     */
    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const { currentPassword, newPassword } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }

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

            await authService.changePassword(userId, currentPassword, newPassword);

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

    // /**
    // * Mettre à jour le profil utilisateur avec image
    // */
    // async updateProfile(req: AuthenticatedRequest, res: Response) {
    //     try {
    //         const userId = req.user?.id;
    //         const updateData = req.body;

    //         if (!userId) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: 'Utilisateur non authentifié'
    //             });
    //         }

    //         // Nettoyer les données - supprimer les champs vides
    //         const cleanedData: any = {};
    //         Object.keys(updateData).forEach(key => {
    //             if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
    //                 cleanedData[key] = updateData[key];
    //             }
    //         });

    //         // Validation des données (uniquement si fournies et non vides)
    //         if (cleanedData.email) {
    //             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //             if (!emailRegex.test(cleanedData.email)) {
    //                 return res.status(400).json({
    //                     success: false,
    //                     message: 'Format d\'email invalide'
    //                 });
    //             }
    //         }

    //         if (cleanedData.phone) {
    //             const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    //             if (!phoneRegex.test(cleanedData.phone)) {
    //                 return res.status(400).json({
    //                     success: false,
    //                     message: 'Format de téléphone invalide'
    //                 });
    //             }
    //         }

    //         // Champs autorisés pour la mise à jour
    //         const allowedFields = ['nom', 'prenom', 'phone', 'email', 'authMethod'];
    //         const filteredUpdateData: any = {};

    //         allowedFields.forEach(field => {
    //             if (cleanedData[field] !== undefined) {
    //                 filteredUpdateData[field] = cleanedData[field];
    //             }
    //         });

    //         // Récupérer le fichier image s'il existe
    //         let profilePicFile = null;
    //         if (req.files && (req.files as any).profilePic) {
    //             profilePicFile = (req.files as any).profilePic;
    //         }

    //         // Vérifier s'il y a des données à mettre à jour
    //         if (Object.keys(filteredUpdateData).length === 0 && !profilePicFile) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Aucune donnée valide à mettre à jour'
    //             });
    //         }

    //         const updatedUser = await authService.updateUserProfile(
    //             userId,
    //             filteredUpdateData,
    //             profilePicFile
    //         );

    //         // Construire l'URL complète pour l'image de profil si elle existe
    //         if (updatedUser.profilePic) {
    //             updatedUser.profilePic = `${req.protocol}://${req.get('host')}${updatedUser.profilePic}`;
    //         }

    //         return res.status(200).json({
    //             success: true,
    //             message: 'Profil mis à jour avec succès',
    //             data: updatedUser
    //         });
    //     } catch (error: any) {
    //         console.error('Erreur mise à jour profil:', error);

    //         if (error.message.includes('existe déjà') || error.message.includes('non trouvé') || error.message.includes('Aucune donnée valide')) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: error.message
    //             });
    //         }

    //         // Gestion spécifique des erreurs de validation Sequelize
    //         if (error.name === 'SequelizeValidationError') {
    //             const validationErrors = error.errors.map((err: any) => ({
    //                 field: err.path,
    //                 message: err.message
    //             }));

    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Erreur de validation des données',
    //                 errors: validationErrors
    //             });
    //         }

    //         return res.status(500).json({
    //             success: false,
    //             message: 'Erreur interne du serveur'
    //         });
    //     }
    // }

    /**
 * Mettre à jour le profil utilisateur avec image
 */
    async updateProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const updateData = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }

            // Nettoyer les données - supprimer les champs vides
            const cleanedData: any = {};
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
                    cleanedData[key] = updateData[key];
                }
            });

            // Validation des données (uniquement si fournies et non vides)
            if (cleanedData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(cleanedData.email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Format d\'email invalide'
                    });
                }
            }

            if (cleanedData.phone) {
                const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(cleanedData.phone)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Format de téléphone invalide'
                    });
                }
            }

            // Champs autorisés pour la mise à jour
            const allowedFields = ['nom', 'prenom', 'phone', 'email', 'authMethod'];
            const filteredUpdateData: any = {};

            allowedFields.forEach(field => {
                if (cleanedData[field] !== undefined) {
                    filteredUpdateData[field] = cleanedData[field];
                }
            });

            // Récupérer le fichier image s'il existe
            let profilePicFile = null;
            if (req.files && (req.files as any).profilePic) {
                profilePicFile = (req.files as any).profilePic;
            }

            // Vérifier s'il y a des données à mettre à jour
            if (Object.keys(filteredUpdateData).length === 0 && !profilePicFile) {
                return res.status(400).json({
                    success: false,
                    message: 'Aucune donnée valide à mettre à jour'
                });
            }

            const updatedUser = await authService.updateUserProfile(
                userId,
                filteredUpdateData,
                profilePicFile
            );

            // Construire l'URL complète pour l'image de profil si elle existe
            if (updatedUser.profilePic) {
                updatedUser.profilePic = `${req.protocol}://${req.get('host')}${updatedUser.profilePic}`;
            }

            return res.status(200).json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: updatedUser
            });
        } catch (error: any) {
            console.error('Erreur mise à jour profil:', error);

            if (error.message.includes('existe déjà') || error.message.includes('non trouvé') || error.message.includes('Aucune donnée valide')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Gestion spécifique des erreurs de validation Sequelize
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err: any) => ({
                    field: err.path,
                    message: err.message
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Erreur de validation des données',
                    errors: validationErrors
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    }
}



export default new AuthController();