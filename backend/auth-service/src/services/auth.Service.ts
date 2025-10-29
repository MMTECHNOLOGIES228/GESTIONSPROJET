import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Utilisateur, Role, RefreshToken, Permission } from '../db/sequelize';
import { privateKey } from '../config/private_key';
import { UtilisateurAttributes } from '../interfaces/utilisateurAttributes';
import { RefreshTokenAttributes } from '../interfaces/refreshTokenAttributes';
import { refreshkey } from '../config/refresh_key';
import otpService from './otp.Service';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

export class AuthService {
    private readonly saltRounds = 12;
    // private readonly accessTokenExpiry = '15m';
    private readonly accessTokenExpiry = '1d';
    private readonly refreshTokenExpiry = '7d';

    /**
     * Hasher un mot de passe
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    /**
     * Vérifier un mot de passe
     */
    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // /**
    //  * Créer un nouvel utilisateur
    //  */
    async createUser(userData: UtilisateurAttributes, role_name: string): Promise<UtilisateurAttributes> {
        try {
            // Vérifier si l'email existe déjà
            const existingUser = await Utilisateur.findOne({ where: { email: userData.email } });
            if (existingUser) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }

            const existingUserPhone = await Utilisateur.findOne({ where: { phone: userData.phone } });
            if (existingUserPhone) {
                throw new Error('Un utilisateur avec cet email existe déjà');
            }

            // Vérifier si le rôle existe
            const role = await Role.findOne({ where: { role_name } });
            if (!role) {
                throw new Error('Rôle non trouvé');
            }

            // Hasher le mot de passe
            const hashedPassword = await this.hashPassword(userData.password!);

            const user = await Utilisateur.create({
                ...userData,
                roleId: role.id,
                password: hashedPassword
            });

            // return user.toJSON();
            return {
                ...user.toJSON(),
                otpRequired: true // Toujours envoyer OTP pour les nouveaux utilisateurs
            };
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'utilisateur: ${error}`);
        }
    }

    /**
 * Authentifier un utilisateur
 */
    async login(identifier: string, password: string, authMethod: 'email' | 'phone' = 'email'): Promise<{
        user: UtilisateurAttributes;
        accessToken: string;
        refreshToken: string;
        permissions: string[];
        role_name?: string;
        requiresOTP?: boolean;
    }> {
        try {
            const whereClause: any = {};

            if (authMethod === 'email') {
                whereClause.email = identifier;
            } else {
                whereClause.phone = identifier;
            }

            const user = await Utilisateur.findOne({
                where: whereClause,
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }]
                }]
            });

            if (!user) {
                throw new Error('Identifiant ou mot de passe incorrect');
            }

            // SEULEMENT les comptes actifs peuvent se connecter
            if (user.status !== 'actif') {
                throw new Error('Votre compte n\'est pas actif. Veuillez vérifier votre email ou contacter l\'administrateur.');
            }

            // Vérifier la vérification email/téléphone selon la méthode d'authentification
            if (authMethod === 'email' && !user.emailVerified) {
                return {
                    user: user.toJSON(),
                    accessToken: '',
                    refreshToken: '',
                    permissions: [],
                    requiresOTP: true
                };
            }

            if (authMethod === 'phone' && !user.phoneVerified) {
                return {
                    user: user.toJSON(),
                    accessToken: '',
                    refreshToken: '',
                    permissions: [],
                    requiresOTP: true
                };
            }

            // Vérifier le mot de passe
            const isPasswordValid = await this.verifyPassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Identifiant ou mot de passe incorrect');
            }

            const role: any = await Role.findByPk(user.roleId, {
                include: [{ model: Permission, as: "permissions" }],
            });

            if (!role) {
                throw new Error("Role not found for the user.");
            }

            // Récupérer les permissions
            const permissions = role?.permissions?.map((perm: any) => perm.perm_name) || [];

            // Générer les tokens
            const accessToken = this.generateAccessToken(user.id, role?.role_name, permissions);
            const refreshToken = this.generateRefreshToken(user.id);

            // Sauvegarder le refresh token
            await this.saveRefreshToken(user.id, refreshToken);

            const userJSON = user.toJSON();
            delete userJSON.password;

            return {
                user: userJSON,
                accessToken,
                refreshToken,
                role_name: role?.role_name,
                permissions
            };
        } catch (error) {
            throw new Error(`Erreur lors de l'authentification: ${error}`);
        }
    }

    /**
     * Authentifier avec Google
     */
    async loginWithGoogle(googleId: string): Promise<{
        user: UtilisateurAttributes;
        accessToken: string;
        refreshToken: string;
        permissions: string[];
    }> {
        try {
            const user = await Utilisateur.findOne({
                where: { googleId },
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }]
                }]
            });

            if (!user) {
                throw new Error('Utilisateur Google non trouvé');
            }

            if (user.status === 'inactif') {
                throw new Error('Votre compte est désactivé');
            }

            const role: any = await Role.findByPk(user.roleId, {
                include: [{ model: Permission, as: "permissions" }],
            });

            if (!role) {
                throw new Error("Role not found for the user.");
            }

            const permissions = role?.permissions?.map((perm: any) => perm.perm_name) || [];

            const accessToken = this.generateAccessToken(user.id, role?.role_name, permissions);
            const refreshToken = this.generateRefreshToken(user.id);

            await this.saveRefreshToken(user.id, refreshToken);

            const userJSON = user.toJSON();
            delete userJSON.password;

            return {
                user: userJSON,
                accessToken,
                refreshToken,
                permissions
            };
        } catch (error) {
            throw new Error(`Erreur lors de l'authentification Google: ${error}`);
        }
    }


    /**
    * Vérifier OTP et activer le compte
    */
    async verifyOTPAndActivate(userId: string, code: string, type: 'email' | 'phone'): Promise<{
        user: UtilisateurAttributes;
        accessToken: string;
        refreshToken: string;
        role_name: string;
        permissions: string[];
    }> {
        try {
            // console.log(`Vérification OTP pour userId: ${userId}, code: ${code}, type: ${type}`);
            // Vérifier l'OTP
            const otpVerified = await otpService.verifyOTPCode(userId, code, type);

            if (!otpVerified) {
                throw new Error('Code OTP invalide');
            }

            // Activer l'utilisateur
            const user = await Utilisateur.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }]
                }]
            });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            await user.update({ status: 'actif' });

            // Marquer la vérification selon le type
            if (type === 'email') {
                await user.update({ emailVerified: true });
            } else {
                await user.update({ phoneVerified: true });
            }

            const role: any = await Role.findByPk(user.roleId, {
                include: [{ model: Permission, as: "permissions" }],
            });

            if (!role) {
                throw new Error("Role not found for the user.");
            }

            const permissions = role?.permissions?.map((perm: any) => perm.perm_name) || [];
            const accessToken = this.generateAccessToken(user.id, role?.role_name, permissions);
            const refreshToken = this.generateRefreshToken(user.id);

            await this.saveRefreshToken(user.id, refreshToken);

            const userJSON = user.toJSON();
            delete userJSON.password;

            return {
                user: userJSON,
                accessToken,
                refreshToken,
                role_name: role?.role_name,
                permissions
            };
        } catch (error) {
            throw new Error(`Erreur lors de la vérification OTP: ${error}`);
        }
    }


    /**
     * Générer un token d'accès
     */
    generateAccessToken(userId: string, role: string, permissions: string[]): string {
        return jwt.sign(
            {
                utilisateurId: userId,
                role,
                permissions
            },
            privateKey,
            { expiresIn: this.accessTokenExpiry }
        );
    }

    /**
     * Générer un refresh token
     */
    generateRefreshToken(userId: string): string {
        return jwt.sign(
            { utilisateurId: userId },
            refreshkey,
            { expiresIn: this.refreshTokenExpiry }
        );
    }

    /**
     * Sauvegarder un refresh token
     */
    async saveRefreshToken(userId: string, token: string): Promise<void> {
        try {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7); // 7 jours

            await RefreshToken.create({
                utilisateurId: userId,
                token,
                expires
            });
        } catch (error) {
            throw new Error(`Erreur lors de la sauvegarde du refresh token: ${error}`);
        }
    }

    /**
     * Rafraîchir le token d'accès
     */
    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            // Vérifier le refresh token
            const decoded: any = jwt.verify(refreshToken, refreshkey);

            // Vérifier si le token existe en base
            const storedToken = await RefreshToken.findOne({
                where: {
                    token: refreshToken,
                    utilisateurId: decoded.utilisateurId
                },
                include: [{
                    model: Utilisateur,
                    as: 'utilisateur',
                    include: [{
                        model: Role,
                        as: 'role',
                        include: [{
                            model: Permission,
                            as: 'permissions',
                            through: { attributes: [] }
                        }]
                    }]
                }]
            });

            if (!storedToken) {
                throw new Error('Refresh token invalide');
            }

            // Vérifier si le token a expiré
            if (new Date() > storedToken.expires) {
                await storedToken.destroy();
                throw new Error('Refresh token expiré');
            }

            // const user = storedToken.utilisateur;

            const user = await Utilisateur.findByPk(decoded.utilisateurId);
            if (!user) {
                throw new Error('User not found.');

            }

            if (user.status! === 'inactif') {
                throw new Error('Votre compte est désactivé');
            }

            const role: any = await Role.findByPk(user.roleId, {
                include: [{ model: Permission, as: "permissions" }],
            });

            const permissions = role?.permissions?.map((perm: any) => perm.perm_name) || [];

            // Générer un nouveau token d'accès
            const newAccessToken = this.generateAccessToken(user.id, role?.role_name, permissions);

            // Générer un nouveau refresh token (rotation)
            const newRefreshToken = this.generateRefreshToken(user.id);

            // Remplacer l'ancien refresh token
            await storedToken.destroy();
            await this.saveRefreshToken(user.id, newRefreshToken);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error(`Erreur lors du rafraîchissement du token: ${error}`);
        }
    }

    /**
     * Déconnecter un utilisateur
     */
    async logout(refreshToken: string): Promise<void> {
        try {
            await RefreshToken.destroy({ where: { token: refreshToken } });
        } catch (error) {
            throw new Error(`Erreur lors de la déconnexion: ${error}`);
        }
    }

    /**
     * Récupérer le profil utilisateur
     */
    async getUserProfile(userId: string): Promise<UtilisateurAttributes> {
        try {
            const user = await Utilisateur.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                    }]
                }],
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            return user.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du profil: ${error}`);
        }
    }

    /**
     * Changer le mot de passe
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const user = await Utilisateur.findByPk(userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Mot de passe actuel incorrect');
            }

            const hashedNewPassword = await this.hashPassword(newPassword);
            await user.update({ password: hashedNewPassword });

            // Supprimer tous les refresh tokens (déconnexion de tous les appareils)
            await RefreshToken.destroy({ where: { utilisateurId: userId } });
        } catch (error) {
            throw new Error(`Erreur lors du changement de mot de passe: ${error}`);
        }
    }

    // Dans auth.Service.ts - Méthode updateUserProfile corrigée

    /**
     * Mettre à jour le profil utilisateur avec gestion d'image
     */
    async updateUserProfile(
        userId: string,
        updateData: Partial<UtilisateurAttributes>,
        profilePicFile?: any
    ): Promise<UtilisateurAttributes> {
        try {
            const user = await Utilisateur.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                    }]
                }]
            });

            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            // Champs autorisés pour la mise à jour
            const allowedFields = [
                'nom',
                'prenom',
                'phone',
                'authMethod'
            ];

            // Filtrer les champs autorisés et non vides
            const filteredUpdateData: any = {};
            allowedFields.forEach(field => {
                const value = updateData[field as keyof UtilisateurAttributes];
                // Ne prendre que les champs définis et non vides
                if (value !== undefined && value !== null && value !== '') {
                    filteredUpdateData[field] = value;
                }
            });

            // Vérification spécifique pour l'email (uniquement si fourni et non vide)
            if (updateData.email && updateData.email.trim() !== '' && updateData.email !== user.email) {
                // Vérifier si le nouvel email n'est pas déjà utilisé
                const existingUser = await Utilisateur.findOne({
                    where: {
                        email: updateData.email,
                        id: { [Op.ne]: userId }
                    }
                });

                if (existingUser) {
                    throw new Error('Un utilisateur avec cet email existe déjà');
                }

                filteredUpdateData.email = updateData.email;
                filteredUpdateData.emailVerified = false;
            }

            // Vérification spécifique pour le téléphone (uniquement si fourni et non vide)
            if (updateData.phone && updateData.phone.trim() !== '' && updateData.phone !== user.phone) {
                const existingUser = await Utilisateur.findOne({
                    where: {
                        phone: updateData.phone,
                        id: { [Op.ne]: userId }
                    }
                });

                if (existingUser) {
                    throw new Error('Un utilisateur avec ce numéro de téléphone existe déjà');
                }

                filteredUpdateData.phone = updateData.phone;
                filteredUpdateData.phoneVerified = false;
            }

            // Gestion de l'image de profil
            if (profilePicFile) {
                const profilePicUrl = await this.handleProfileImageUpload(profilePicFile, user.profilePic!);
                filteredUpdateData.profilePic = profilePicUrl;
            }

            // Vérifier s'il y a réellement des données à mettre à jour
            if (Object.keys(filteredUpdateData).length === 0) {
                // Si seulement l'image est mise à jour, retourner l'utilisateur actuel
                if (profilePicFile) {
                    await user.reload({
                        include: [{
                            model: Role,
                            as: 'role',
                            include: [{
                                model: Permission,
                                as: 'permissions',
                            }]
                        }]
                    });

                    const userJSON = user.toJSON();
                    delete userJSON.password;
                    return userJSON;
                }
                throw new Error('Aucune donnée valide à mettre à jour');
            }

            // Mettre à jour l'utilisateur
            await user.update(filteredUpdateData);

            // Recharger l'utilisateur avec les relations
            await user.reload({
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                    }]
                }]
            });

            const userJSON = user.toJSON();
            delete userJSON.password;

            return userJSON;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du profil: ${error}`);
        }
    }

    /**
 * Gérer l'upload de l'image de profil
 */
    private async handleProfileImageUpload(file: any, oldProfilePic?: string): Promise<string> {
        try {
            // Supprimer l'ancienne image si elle existe
            if (oldProfilePic) {
                await this.deleteOldProfileImage(oldProfilePic);
            }

            // Générer un nom de fichier unique
            const timestamp = Date.now();
            const fileExtension = path.extname(file.name);
            const fileName = `profile-${timestamp}${fileExtension}`;

            // Chemins
            const uploadDir = path.join(__dirname, '../../public/uploads/profiles');
            const filePath = path.join(uploadDir, fileName);
            // const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

            // Créer le dossier si nécessaire
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Déplacer le fichier
            await file.mv(filePath);

            // Retourner l'URL publique
            return `/uploads/profiles/${fileName}`;

        } catch (error) {
            throw new Error(`Erreur lors du traitement de l'image: ${error}`);
        }
    }

    /**
     * Supprimer l'ancienne image de profil
     */
    private async deleteOldProfileImage(profilePicUrl: string): Promise<void> {
        try {
            if (profilePicUrl && profilePicUrl.startsWith('/uploads/profiles/')) {
                const fileName = path.basename(profilePicUrl);
                const filePath = path.join(__dirname, '../../public/uploads/profiles', fileName);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'ancienne image:', error);
            // Ne pas bloquer la mise à jour si la suppression échoue
        }
    }
}




export default new AuthService();