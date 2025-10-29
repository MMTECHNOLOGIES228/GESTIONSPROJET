import { Router, RequestHandler } from 'express';
import { MemberController } from '../controllers/member.controller';
import auth, { AuthenticatedRequest } from '../middlewares/auth';
import { tenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();
const memberController = new MemberController();

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Organization member management API
 */

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members for current organization
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', auth(), tenantMiddleware(), memberController.getOrganizationMembers as unknown as RequestHandler);

/**
 * @swagger
 * /api/members/me:
 *   get:
 *     summary: Get current user's membership info
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Membership info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Membership not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/me',  memberController.getMyMembership as unknown as RequestHandler);

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Add member to organization
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
 *               permissions:
 *                 type: object
 *                 properties:
 *                   can_create_projects:
 *                     type: boolean
 *                     example: true
 *                   can_edit_projects:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       201:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post('/', auth(), tenantMiddleware(), memberController.addMember as unknown as RequestHandler);

/**
 * @swagger
 * /api/members/invite:
 *   post:
 *     summary: Invite member to organization via email
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
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post('/invite', auth(), tenantMiddleware(), memberController.inviteMember as unknown as RequestHandler);

/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Update member role and permissions
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
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
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put('/:id', auth(), tenantMiddleware(), memberController.updateMember as unknown as RequestHandler);

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Remove member from organization
 *     tags: [Members]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', auth(), tenantMiddleware(), memberController.removeMember as unknown as RequestHandler);

export default router;