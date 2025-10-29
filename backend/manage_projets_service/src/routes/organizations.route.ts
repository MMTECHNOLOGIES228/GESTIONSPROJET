import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import authMiddleware from '../middlewares/auth';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();
const organizationController = new OrganizationController();

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Gestion des organisations
 */

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     summary: Créer une nouvelle organisation
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corporation"
 *               slug:
 *                 type: string
 *                 example: "acme-corp"
 *               description:
 *                 type: string
 *                 example: "Une entreprise leader en technologie"
 *     responses:
 *       201:
 *         description: Organisation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post(
  '/',
  authMiddleware(),
  organizationController.createOrganization as any
);

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     summary: Obtenir toutes les organisations de l'utilisateur courant
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Organisations récupérées avec succès
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
  organizationController.getUserOrganizations as any
);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   get:
 *     summary: Obtenir une organisation par son ID
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     responses:
 *       200:
 *         description: Organisation récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Organisation non trouvée
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/:id',
  authMiddleware(),
  tenantMiddleware(),
  organizationController.getOrganization as any
);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   put:
 *     summary: Mettre à jour une organisation
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nom de l'organisation mis à jour"
 *               description:
 *                 type: string
 *                 example: "Description mise à jour"
 *               settings:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                     example: "sombre"
 *                   language:
 *                     type: string
 *                     example: "fr"
 *     responses:
 *       200:
 *         description: Organisation mise à jour avec succès
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
  tenantMiddleware(['can_edit_organization'], ['owner', 'admin']),
  organizationController.updateOrganization as any
);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   delete:
 *     summary: Supprimer une organisation
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'organisation
 *     responses:
 *       200:
 *         description: Organisation supprimée avec succès
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
  tenantMiddleware([], ['owner']),
  organizationController.deleteOrganization as any
);

export default router;