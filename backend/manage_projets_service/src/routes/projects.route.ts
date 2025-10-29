import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import authMiddleware from '../middlewares/auth';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();
const projectController = new ProjectController();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestion des projets
 */

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projects]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Refonte du site web"
 *               description:
 *                 type: string
 *                 example: "Refonte complète du site web de l'entreprise"
 *               status:
 *                 type: string
 *                 enum: [planning, active, on_hold, completed, archived]
 *                 example: "planning"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-01"
 *               budget:
 *                 type: number
 *                 example: 50000
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["design", "development", "marketing"]
 *     responses:
 *       201:
 *         description: Projet créé avec succès
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
  tenantMiddleware(['can_create_projects']),
  projectController.createProject as any
);

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Obtenir tous les projets de l'organisation courante
 *     tags: [Projects]
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
 *         description: Projets récupérés avec succès
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
  projectController.getOrganizationProjects as any
);

/**
 * @swagger
 * /api/v1/projects/stats:
 *   get:
 *     summary: Obtenir les statistiques des projets de l'organisation
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
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
  '/stats',
  authMiddleware(),
  tenantMiddleware(),
  projectController.getProjectStats as any
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Obtenir un projet par son ID
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Projet non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/:id',
  authMiddleware(),
  tenantMiddleware(),
  projectController.getProject as any
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nom du projet mis à jour"
 *               description:
 *                 type: string
 *                 example: "Description mise à jour"
 *               status:
 *                 type: string
 *                 enum: [planning, active, on_hold, completed, archived]
 *                 example: "active"
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
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
  tenantMiddleware(['can_edit_projects']),
  projectController.updateProject as any
);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
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
  tenantMiddleware(['can_delete_projects']),
  projectController.deleteProject as any
);

export default router;