import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import authMiddleware from '../middlewares/auth';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();
const memberController = new MemberController();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Gestion des membres d'organisation
 */

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Obtenir tous les membres de l'organisation courante
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Membres récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/',
  authMiddleware(),
  tenantMiddleware(),
  memberController.getOrganizationMembers as any
);

/**
 * @swagger
 * /api/v1/members/me:
 *   get:
 *     summary: Obtenir les informations de membership de l'utilisateur courant
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Informations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Membership non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/me',
  authMiddleware(),
  tenantMiddleware(),
  memberController.getMyMembership as any
);

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: Ajouter un membre à l'organisation
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member, viewer]
 *                 example: "member"
 *     responses:
 *       201:
 *         description: Membre ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.post(
  '/',
  authMiddleware(),
  tenantMiddleware(['can_invite_members'], ['owner', 'admin']),
  memberController.addMember as any
);

/**
 * @swagger
 * /api/v1/members/invite:
 *   post:
 *     summary: Inviter un membre par email
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member, viewer]
 *                 example: "member"
 *     responses:
 *       201:
 *         description: Invitation envoyée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.post(
  '/invite',
  authMiddleware(),
  tenantMiddleware(['can_invite_members'], ['owner', 'admin']),
  memberController.inviteMember as any
);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   put:
 *     summary: Mettre à jour le rôle et les permissions d'un membre
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member, viewer]
 *                 example: "admin"
 *               permissions:
 *                 type: object
 *                 properties:
 *                   can_create_projects:
 *                     type: boolean
 *                     example: true
 *                   can_invite_members:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Membre mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.put(
  '/:id',
  authMiddleware(),
  tenantMiddleware(['can_manage_members'], ['owner', 'admin']),
  memberController.updateMember as any
);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   delete:
 *     summary: Supprimer un membre de l'organisation
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     responses:
 *       200:
 *         description: Membre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permissions insuffisantes
 *       500:
 *         description: Erreur serveur
 */
router.delete(
  '/:id',
  authMiddleware(),
  tenantMiddleware(['can_remove_members'], ['owner', 'admin']),
  memberController.removeMember as any
);

export default router;