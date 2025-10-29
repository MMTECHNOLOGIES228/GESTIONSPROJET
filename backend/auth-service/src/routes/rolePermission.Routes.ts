import { Router } from 'express';
import rolePermissionController from '../controllers/rolePermission.Controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RolePermission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         roleId:
 *           type: string
 *           format: uuid
 *         permId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     AddPermissionToRole:
 *       type: object
 *       required:
 *         - roleId
 *         - permId
 *       properties:
 *         roleId:
 *           type: string
 *           format: uuid
 *         permId:
 *           type: string
 *           format: uuid
 * 
 *     AddPermissionsToRole:
 *       type: object
 *       required:
 *         - permIds
 *       properties:
 *         permIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 * 
 *     RemovePermissionsFromRole:
 *       type: object
 *       required:
 *         - permIds
 *       properties:
 *         permIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 */

/**
 * @swagger
 * /api/v1/rolesPermission:
 *   post:
 *     summary: Ajouter une permission à un rôle
 *     tags: [Role-Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPermissionToRole'
 *     responses:
 *       201:
 *         description: Permission ajoutée au rôle avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RolePermission'
 *       400:
 *         description: Données invalides ou association déjà existante
 *       404:
 *         description: Rôle ou permission non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', rolePermissionController.addPermissionToRole);

/**
 * @swagger
 * /api/v1/rolesPermission/roles/{roleId}/permissions:
 *   post:
 *     summary: Ajouter plusieurs permissions à un rôle
 *     tags: [Role-Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
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
 *             $ref: '#/components/schemas/AddPermissionsToRole'
 *     responses:
 *       201:
 *         description: Permissions ajoutées au rôle avec succès
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
 *                         $ref: '#/components/schemas/RolePermission'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Rôle ou permission(s) non trouvé(s)
 *       500:
 *         description: Erreur serveur
 */
router.post('/roles/:roleId/permissions', rolePermissionController.addPermissionsToRole);

/**
 * @swagger
 * /api/v1/rolesPermission/roles/{roleId}/permissions:
 *   get:
 *     summary: Récupérer toutes les permissions d'un rôle
 *     tags: [Role-Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du rôle
 *     responses:
 *       200:
 *         description: Permissions du rôle récupérées avec succès
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
router.get('/roles/:roleId/permissions', rolePermissionController.getRolePermissions);

/**
 * @swagger
 * /api/v1/rolesPermission/roles/{roleId}/permissions/{permId}:
 *   delete:
 *     summary: Supprimer une permission d'un rôle
 *     tags: [Role-Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du rôle
 *       - in: path
 *         name: permId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la permission
 *     responses:
 *       200:
 *         description: Permission retirée du rôle avec succès
 *       404:
 *         description: Association rôle-permission non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/roles/:roleId/permissions/:permId', rolePermissionController.removePermissionFromRole);

/**
 * @swagger
 * /api/v1/rolesPermission/roles/{roleId}/permissions:
 *   delete:
 *     summary: Supprimer plusieurs permissions d'un rôle
 *     tags: [Role-Permissions]
 *     parameters:
 *       - in: path
 *         name: roleId
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
 *             $ref: '#/components/schemas/RemovePermissionsFromRole'
 *     responses:
 *       200:
 *         description: Permissions retirées du rôle avec succès
 *       404:
 *         description: Aucune association trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/roles/:roleId/permissions', rolePermissionController.removePermissionsFromRole);

/**
 * @swagger
 * /api/v1/rolesPermission/roles-with-permissions:
 *   get:
 *     summary: Récupérer tous les rôles avec leurs permissions
 *     tags: [Role-Permissions]
 *     responses:
 *       200:
 *         description: Rôles avec permissions récupérés avec succès
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
router.get('/roles-with-permissions', rolePermissionController.getAllRolesWithPermissions);

export default router;