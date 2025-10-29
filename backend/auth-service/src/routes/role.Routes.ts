import { Router } from 'express';
import roleController from '../controllers/role.Controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - role_name
 *         - role_description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID auto-généré du rôle
 *         role_name:
 *           type: string
 *           description: Nom du rôle
 *         role_description:
 *           type: string
 *           description: Description du rôle
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         role_name: "admin"
 *         role_description: "Administrateur du système"
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 * 
 *     RoleInput:
 *       type: object
 *       required:
 *         - role_name
 *         - role_description
 *       properties:
 *         role_name:
 *           type: string
 *           description: Nom du rôle
 *         role_description:
 *           type: string
 *           description: Description du rôle
 *       example:
 *         role_name: "user"
 *         role_description: "Utilisateur standard"
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         count:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Créer un nouveau rôle
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Un rôle avec ce nom existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.post('/', roleController.createRole);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Récupérer tous les rôles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Liste des rôles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', roleController.getAllRoles);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Récupérer un rôle par son ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du rôle
 *     responses:
 *       200:
 *         description: Rôle récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', roleController.getRoleById);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Mettre à jour un rôle
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du rôle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle non trouvé
 *       409:
 *         description: Un rôle avec ce nom existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', roleController.updateRole);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Supprimer un rôle
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du rôle
 *     responses:
 *       200:
 *         description: Rôle supprimé avec succès
 *       404:
 *         description: Rôle non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', roleController.deleteRole);

export default router;