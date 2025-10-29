import { Router } from 'express';
import authController from '../controllers/auth.Controller';
import authMiddleware from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - role_name
 *         - nom
 *         - prenom
 *         - authMethod
 *       properties:
 *         role_name:
 *           type: string
 *           format: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         profilePic:
 *           type: string
 *         authMethod:
 *           type: string
 *           enum: [email, phone]
 *       example:
 *         role_name: "Admin"
 *         email: "john.doe@example.com"
 *         phone: "+1234567890"
 *         password: "password123"
 *         nom: "Doe"
 *         prenom: "John"
 *         profilePic: "profile.jpg"
 *         authMethod: "email"
 * 
 *     UserRegisterGoogle:
 *       type: object
 *       required:
 *         - role_name
 *         - email
 *         - googleId
 *         - nom
 *         - prenom
 *       properties:
 *         role_name:
 *           type: string
 *           format: string
 *         email:
 *           type: string
 *           format: email
 *         googleId:
 *           type: string
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         profilePic:
 *           type: string
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email ou numéro de téléphone selon authMethod
 *         password:
 *           type: string
 *         authMethod:
 *           type: string
 *           enum: [email, phone]
 *           default: email
 *       example:
 *         identifier: "john.doe@example.com"
 *         password: "password123"
 *         authMethod: "email"
 * 
 *     GoogleLogin:
 *       type: object
 *       required:
 *         - googleId
 *       properties:
 *         googleId:
 *           type: string
 * 
 *     OTPVerification:
 *       type: object
 *       required:
 *         - userId
 *         - code
 *         - type
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         code:
 *           type: string
 *         type:
 *           type: string
 *           enum: [email, phone]
 * 
 *     ResendOTP:
 *       type: object
 *       required:
 *         - userId
 *         - identifier
 *         - type
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         identifier:
 *           type: string
 *         type:
 *           type: string
 *           enum: [email, phone]
 * 
 *     RefreshToken:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 * 
 *     ChangePassword:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *         newPassword:
 *           type: string
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 * 
 *     OTPRequiredResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         requiresOTP:
 *           type: boolean
 *         authMethod:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Créer un nouvel utilisateur (Email/Phone)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès - Vérification OTP requise
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/v1/auth/register/google:
 *   post:
 *     summary: Créer un nouvel utilisateur Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterGoogle'
 *     responses:
 *       201:
 *         description: Utilisateur Google créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/register/google', authController.registerWithGoogle);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur (Email/Phone)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/AuthResponse'
 *                         - $ref: '#/components/schemas/OTPRequiredResponse'
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/auth/login/google:
 *   post:
 *     summary: Authentifier avec Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLogin'
 *     responses:
 *       200:
 *         description: Connexion Google réussie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Identifiants Google invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login/google', authController.loginWithGoogle);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Vérifier OTP et activer le compte
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPVerification'
 *     responses:
 *       200:
 *         description: Compte activé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Code OTP invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/verify-otp', authController.verifyOTP);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Renvoyer un code OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOTP'
 *     responses:
 *       200:
 *         description: OTP renvoyé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.post('/resend-otp', authController.resendOTP);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Token rafraîchi avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Refresh token invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Déconnecter un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur serveur
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Récupérer le profil utilisateur
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/profile', authMiddleware([],[]), authController.getProfile);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Changer le mot de passe
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/change-password',authMiddleware([],[]), authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Mettre à jour le profil utilisateur (avec image)
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               authMethod:
 *                 type: string
 *                 enum: [email, phone]
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/profile', authMiddleware([],[]), authController.updateProfile);

export default router;