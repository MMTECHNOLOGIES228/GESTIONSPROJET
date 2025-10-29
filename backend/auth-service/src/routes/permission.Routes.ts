import { Router } from 'express';
import permissionController from '../controllers/permission.Controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - perm_name
 *         - perm_description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID auto-généré de la permission
 *         perm_name:
 *           type: string
 *           description: Nom de la permission
 *         perm_description:
 *           type: string
 *           description: Description de la permission
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         perm_name: "user.create"
 *         perm_description: "Permission de créer des utilisateurs"
 *         createdAt: "2023-10-01T12:00:00.000Z"
 *         updatedAt: "2023-10-01T12:00:00.000Z"
 * 
 *     PermissionInput:
 *       type: object
 *       required:
 *         - perm_name
 *         - perm_description
 *       properties:
 *         perm_name:
 *           type: string
 *           description: Nom de la permission
 *         perm_description:
 *           type: string
 *           description: Description de la permission
 *       example:
 *         perm_name: "user.read"
 *         perm_description: "Permission de lire les utilisateurs"
 * 
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 */

/**
 * @swagger
 * /api/v1/permissions:
 *   post:
 *     summary: Créer une nouvelle permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionInput'
 *     responses:
 *       201:
 *         description: Permission créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Une permission avec ce nom existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.post('/', permissionController.createPermission);

/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Récupérer toutes les permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Liste des permissions récupérée avec succès
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
 *                         $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', permissionController.getAllPermissions);

/**
 * @swagger
 * /api/v1/permissions/paginated:
 *   get:
 *     summary: Récupérer les permissions avec pagination
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Permissions récupérées avec succès
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
 *                         $ref: '#/components/schemas/Permission'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: Paramètres de pagination invalides
 *       500:
 *         description: Erreur serveur
 */
router.get('/paginated', permissionController.getPermissionsPaginated);

/**
 * @swagger
 * /api/v1/permissions/search:
 *   get:
 *     summary: Rechercher des permissions
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche récupérés avec succès
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
 *                         $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Terme de recherche manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/search', permissionController.searchPermissions);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   get:
 *     summary: Récupérer une permission par son ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la permission
 *     responses:
 *       200:
 *         description: Permission récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', permissionController.getPermissionById);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   put:
 *     summary: Mettre à jour une permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionInput'
 *     responses:
 *       200:
 *         description: Permission mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission non trouvée
 *       409:
 *         description: Une permission avec ce nom existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', permissionController.updatePermission);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   delete:
 *     summary: Supprimer une permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la permission
 *     responses:
 *       200:
 *         description: Permission supprimée avec succès
 *       404:
 *         description: Permission non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', permissionController.deletePermission);

export default router;