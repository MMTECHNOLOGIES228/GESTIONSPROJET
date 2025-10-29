import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import authMiddleware from '../middlewares/auth';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestion des tâches
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - title
 *             properties:
 *               project_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               title:
 *                 type: string
 *                 example: "Concevoir la maquette de la page d'accueil"
 *               description:
 *                 type: string
 *                 example: "Créer les wireframes et maquettes pour la page d'accueil"
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, done, cancelled]
 *                 example: "todo"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: "medium"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T23:59:59Z"
 *               estimated_hours:
 *                 type: number
 *                 example: 8
 *               assignee_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["design", "ui/ux"]
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
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
  tenantMiddleware(['can_manage_tasks']),
  taskController.createTask as any
);

/**
 * @swagger
 * /api/v1/tasks/search:
 *   get:
 *     summary: Rechercher des tâches dans l'organisation
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche
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
 *           maximum: 50
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Recherche terminée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Terme de recherche manquant
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/search',
  authMiddleware(),
  tenantMiddleware(),
  taskController.searchTasks as any
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Obtenir une tâche par son ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Tâche non trouvée
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get(
  '/:id',
  authMiddleware(),
  tenantMiddleware(),
  taskController.getTask as any
);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks:
 *   get:
 *     summary: Obtenir les tâches d'un projet
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, review, done, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filtrer par priorité
 *       - in: query
 *         name: assignee_id
 *         schema:
 *           type: string
 *         description: Filtrer par assigné
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Tags séparés par des virgules
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
 *         description: Tâches récupérées avec succès
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
  '/projects/:projectId/tasks',
  authMiddleware(),
  tenantMiddleware(),
  taskController.getProjectTasks as any
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Titre de la tâche mis à jour"
 *               description:
 *                 type: string
 *                 example: "Description mise à jour"
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, review, done, cancelled]
 *                 example: "in_progress"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: "high"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-20T23:59:59Z"
 *     responses:
 *       200:
 *         description: Tâche mise à jour avec succès
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
router.put(
  '/:id',
  authMiddleware(),
  tenantMiddleware(['can_manage_tasks']),
  taskController.updateTask as any
);

/**
 * @swagger
 * /api/v1/tasks/{id}/position:
 *   patch:
 *     summary: Mettre à jour la position d'une tâche
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *             properties:
 *               position:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *     responses:
 *       200:
 *         description: Position mise à jour avec succès
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
router.patch(
  '/:id/position',
  authMiddleware(),
  tenantMiddleware(['can_manage_tasks']),
  taskController.updateTaskPosition as any
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
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
router.delete(
  '/:id',
  authMiddleware(),
  tenantMiddleware(['can_manage_tasks']),
  taskController.deleteTask as any
);

export default router;