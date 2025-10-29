import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Utilisateur, Role, OtpVerification } from '../db/sequelize';
import { UtilisateurAttributes, UtilisateurCreateResponse } from '../interfaces/utilisateurAttributes';
import otpService from './otp.Service';

export class UserService {
    private readonly saltRounds = 12;

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

    /**
     * Créer un nouvel utilisateur
     */
    async createUser(userData: UtilisateurAttributes, role_name: string): Promise<UtilisateurCreateResponse> {
        try {
            // Vérifier les doublons selon la méthode d'authentification
            if (userData.authMethod === 'email' && userData.email) {
                const existingUser = await Utilisateur.findOne({ where: { email: userData.email } });
                if (existingUser) {
                    throw new Error('Un utilisateur avec cet email existe déjà');
                }
            } else if (userData.authMethod === 'phone' && userData.phone) {
                const existingUser = await Utilisateur.findOne({ where: { phone: userData.phone } });
                if (existingUser) {
                    throw new Error('Un utilisateur avec ce numéro existe déjà');
                }
            }

            // Vérifier si le rôle existe
            const role = await Role.findOne({ where: { role_name } });
            if (!role) {
                throw new Error('Rôle non trouvé');
            }

            let hashedPassword: string | undefined;
            let temporaryPassword: string | undefined;

            // Générer un mot de passe temporaire si méthode email/phone
            if (userData.authMethod === 'email' || userData.authMethod === 'phone') {
                temporaryPassword = this.generateTemporaryPassword();
                hashedPassword = await this.hashPassword(temporaryPassword);
            }

            const user = await Utilisateur.create({
                ...userData,
                roleId: role.id,
                password: hashedPassword,
                passwordChanged: false,
                status: 'en_attente', // Statut initial
                emailVerified: userData.authMethod === 'google',
                phoneVerified: false
            });

            const userJSON = user.toJSON();

            // Générer et envoyer OTP si méthode email/phone
            let otpRequired = false;
            if (userData.authMethod === 'email' && userData.email) {
                await this.sendEmailOTP(user.id, userData.email);
                otpRequired = true;
            } else if (userData.authMethod === 'phone' && userData.phone) {
                await this.sendPhoneOTP(user.id, userData.phone);
                otpRequired = true;
            }

            return {
                id: userJSON.id,
                roleId: userJSON.roleId,
                email: userJSON.email,
                phone: userJSON.phone,
                nom: userJSON.nom,
                prenom: userJSON.prenom,
                profilePic: userJSON.profilePic,
                status: userJSON.status,
                authMethod: userJSON.authMethod,
                emailVerified: userJSON.emailVerified,
                phoneVerified: userJSON.phoneVerified,
                passwordChanged: userJSON.passwordChanged,
                temporaryPassword,
                otpRequired
            };
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'utilisateur: ${error}`);
        }
    }

    /**
     * Créer un utilisateur Google
     */
    async createGoogleUser(googleData: {
        googleId: string;
        email: string;
        nom: string;
        prenom: string;
        profilePic?: string;
    }): Promise<UtilisateurAttributes> {
        try {
            // Vérifier si l'utilisateur Google existe déjà
            const existingUser = await Utilisateur.findOne({
                where: {
                    [Op.or]: [
                        { googleId: googleData.googleId },
                        { email: googleData.email }
                    ]
                }
            });

            if (existingUser) {
                // Mettre à jour l'utilisateur existant
                await existingUser.update({
                    googleId: googleData.googleId,
                    profilePic: googleData.profilePic || existingUser.profilePic
                });
                return existingUser.toJSON();
            }

            // Rôle par défaut pour les utilisateurs Google
            const defaultRole = await Role.findOne({ where: { role_name: 'user' } });
            if (!defaultRole) {
                throw new Error('Rôle utilisateur par défaut non trouvé');
            }

            const user = await Utilisateur.create({
                roleId: defaultRole.id,
                email: googleData.email,
                nom: googleData.nom,
                prenom: googleData.prenom,
                profilePic: googleData.profilePic || null,
                authMethod: 'google',
                status: 'actif',
                emailVerified: true,
                phoneVerified: false,
                passwordChanged: true, // Pas de mot de passe pour Google
                googleId: googleData.googleId
            });

            return user.toJSON();
        } catch (error) {
            throw new Error(`Erreur lors de la création de l'utilisateur Google: ${error}`);
        }
    }

    /**
     * Envoyer OTP par email
     */
    private async sendEmailOTP(userId: string, email: string): Promise<void> {
        const code = otpService.generateOTP();
        const expires = otpService.getExpiryDate();

        await OtpVerification.create({
            utilisateurId: userId,
            code,
            type: 'email',
            expires,
            verified: false
        });

        await otpService.sendOTPByEmail(email, code);
    }

    /**
     * Envoyer OTP par téléphone
     */
    private async sendPhoneOTP(userId: string, phone: string): Promise<void> {
        const code = otpService.generateOTP();
        const expires = otpService.getExpiryDate();

        await OtpVerification.create({
            utilisateurId: userId,
            code,
            type: 'phone',
            expires,
            verified: false
        });

        await otpService.sendOTPBySMS(phone, code);
    }

    /**
     * Vérifier OTP et activer le compte
     */
    async verifyOTPAndActivate(userId: string, code: string, type: 'email' | 'phone'): Promise<boolean> {
        try {
            const otpRecord = await OtpVerification.findOne({
                where: {
                    utilisateurId: userId,
                    type,
                    verified: false
                },
                order: [['createdAt', 'DESC']]
            });

            if (!otpRecord) {
                throw new Error('Aucun OTP trouvé');
            }

            const isValid = otpService.verifyOTP(otpRecord.code, code, otpRecord.expires);

            if (isValid) {
                // Marquer l'OTP comme vérifié
                await otpRecord.update({ verified: true });

                // Activer le compte utilisateur
                const user = await Utilisateur.findByPk(userId);
                if (user) {
                    if (type === 'email') {
                        await user.update({ emailVerified: true, status: 'actif' });
                    } else if (type === 'phone') {
                        await user.update({ phoneVerified: true, status: 'actif' });
                    }
                }

                return true;
            }

            return false;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification OTP: ${error}`);
        }
    }

    /**
     * Renvoyer OTP
     */
    async resendOTP(userId: string, type: 'email' | 'phone'): Promise<void> {
        const user = await Utilisateur.findByPk(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        if (type === 'email' && user.email) {
            await this.sendEmailOTP(userId, user.email);
        } else if (type === 'phone' && user.phone) {
            await this.sendPhoneOTP(userId, user.phone);
        } else {
            throw new Error('Méthode de vérification non disponible');
        }
    }

    /**
     * Générer un mot de passe temporaire
     */
    private generateTemporaryPassword(): string {
        const length = 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    /**
     * Récupérer tous les utilisateurs
     */
    async getAllUsers(): Promise<UtilisateurAttributes[]> {
        try {
            const users = await Utilisateur.findAll({
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });
            return users.map(user => user.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des utilisateurs: ${error}`);
        }
    }

    /**
     * Récupérer un utilisateur par son ID
     */
    async getUserById(id: string): Promise<UtilisateurAttributes | null> {
        try {
            const user = await Utilisateur.findByPk(id, {
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] }
            });
            return user ? user.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error}`);
        }
    }

    /**
     * Récupérer un utilisateur par son email
     */
    async getUserByEmail(email: string): Promise<UtilisateurAttributes | null> {
        try {
            const user = await Utilisateur.findOne({
                where: { email },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] }
            });
            return user ? user.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error}`);
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    async updateUser(id: string, userData: Partial<UtilisateurAttributes>): Promise<UtilisateurAttributes | null> {
        try {
            const user = await Utilisateur.findByPk(id);
            if (!user) {
                return null;
            }

            // Vérifier si l'email est modifié et s'il existe déjà
            if (userData.email && userData.email !== user.email) {
                const existingUser = await Utilisateur.findOne({ where: { email: userData.email } });
                if (existingUser) {
                    throw new Error('Un utilisateur avec cet email existe déjà');
                }
            }

            // Vérifier si le rôle existe
            if (userData.roleId) {
                const role = await Role.findByPk(userData.roleId);
                if (!role) {
                    throw new Error('Rôle non trouvé');
                }
            }

            await user.update(userData);

            const updatedUser = await Utilisateur.findByPk(id, {
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] }
            });

            return updatedUser ? updatedUser.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error}`);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(id: string): Promise<boolean> {
        try {
            const user = await Utilisateur.findByPk(id);
            if (!user) {
                return false;
            }

            await user.destroy();
            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error}`);
        }
    }

    /**
     * Changer le mot de passe
     */
    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const user = await Utilisateur.findByPk(id);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            // Vérifier le mot de passe actuel
            const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Mot de passe actuel incorrect');
            }

            // Hasher le nouveau mot de passe
            const hashedNewPassword = await this.hashPassword(newPassword);

            await user.update({
                password: hashedNewPassword,
                passwordChanged: true
            });
        } catch (error) {
            throw new Error(`Erreur lors du changement de mot de passe: ${error}`);
        }
    }

    /**
     * Réinitialiser le mot de passe (pour admin)
     */
    async resetPassword(id: string): Promise<{ temporaryPassword: string }> {
        try {
            const user = await Utilisateur.findByPk(id);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const temporaryPassword = this.generateTemporaryPassword();
            const hashedPassword = await this.hashPassword(temporaryPassword);

            await user.update({
                password: hashedPassword,
                passwordChanged: false
            });

            return { temporaryPassword };
        } catch (error) {
            throw new Error(`Erreur lors de la réinitialisation du mot de passe: ${error}`);
        }
    }

    /**
     * Changer le statut d'un utilisateur
     */
    async updateUserStatus(id: string, status: 'actif' | 'inactif'): Promise<UtilisateurAttributes | null> {
        try {
            const user = await Utilisateur.findByPk(id);
            if (!user) {
                return null;
            }

            await user.update({ status });

            const updatedUser = await Utilisateur.findByPk(id, {
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] }
            });

            return updatedUser ? updatedUser.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors du changement de statut: ${error}`);
        }
    }

    /**
     * Vérifier si un utilisateur existe
     */
    async userExists(id: string): Promise<boolean> {
        try {
            const user = await Utilisateur.findByPk(id);
            return !!user;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification de l'utilisateur: ${error}`);
        }
    }

    /**
     * Rechercher des utilisateurs
     */
    async searchUsers(searchTerm: string): Promise<UtilisateurAttributes[]> {
        try {
            const users = await Utilisateur.findAll({
                where: {
                    [Op.or]: [
                        { nom: { [Op.iLike]: `%${searchTerm}%` } },
                        { prenom: { [Op.iLike]: `%${searchTerm}%` } },
                        { email: { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });
            return users.map(user => user.toJSON());
        } catch (error) {
            throw new Error(`Erreur lors de la recherche des utilisateurs: ${error}`);
        }
    }

    /**
     * Récupérer les utilisateurs avec pagination
     */
    async getUsersPaginated(page: number = 1, limit: number = 10): Promise<{
        users: UtilisateurAttributes[],
        total: number,
        totalPages: number
    }> {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Utilisateur.findAndCountAll({
                limit,
                offset,
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name', 'role_description']
                }],
                attributes: { exclude: ['password'] },
                order: [['createdAt', 'DESC']]
            });

            return {
                users: rows.map(user => user.toJSON()),
                total: count,
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération paginée des utilisateurs: ${error}`);
        }
    }
}

export default new UserService();