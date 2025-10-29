import express, { Request, Response, Router } from 'express';
import sequelize from "../db/sequelize";
import { ValidationError, UniqueConstraintError } from "sequelize";

// import { PermissionAttributes } from '../interfaces/permissionAttributes';

import auth, { AuthenticatedRequest } from '../middlewares/auth';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing permissions
 */


/**
 * @swagger
 * /api/v1/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Permission details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perm_name:
 *                 type: string
 *                 example: Read
 *               perm_description:
 *                 type: string
 *                 example: Permission to read resources
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La Permission Read a bien été cree.
 *                 data:
 *                   type: object
 */
// Create a new permission
router.post('/', auth([], ["SuperAdmin"]), function (req: Request, res: Response) {
    // Code de création d'une nouvelle permission
    if (!req.body.perm_name || !req.body.perm_description) {
        res.status(400).send({
            msg: "Please pass Permission name or description.",
        });
    } else {
        sequelize.Permission.create(req.body)
            .then(async (permission) => {
                const message = `La Permission ${req.body.perm_name} a bien été cree.`;
                res.json({ message, data: permission });
            })
            .catch((error: any) => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error });
                }
                if (error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: "error.message", data: error });
                }
                const message = `Le Role n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    }
});

/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La liste des Permission a bien été récupéré.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get List of permissions
router.get('/', auth([], ["SuperAdmin"]), function (req: AuthenticatedRequest, res: Response) {
    sequelize.Permission.findAll()
        .then((perms: any) => {
            const message = 'La liste des Permission a bien été récupéré.';
            res.json({ message, data: perms });
        })
        .catch((error: any) => {
            res.status(400).send(error);
        });
});

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Get permissions by ID
router.get("/:id", auth([], ["SuperAdmin"]), function (req: Request, res: Response) {
    sequelize.Permission.findByPk(req.params.id, {
        include: [
            {
                model: sequelize.Role,
                as: "roles",
            },
            // {
            //     model: sequelize.Utilisateur,
            //     as: "utilisateurs",
            // },
        ],
    }).then((permission: any) => {
        res.status(200).send(permission);
    }).catch((error: any) => {
        res.status(400).send({
            success: false,
            msg: error,
        });
    });
});

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     requestBody:
 *       description: Updated permission details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perm_name:
 *                 type: string
 *                 example: Write
 *               perm_description:
 *                 type: string
 *                 example: Permission to write resources
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Update a permission
router.put('/:id', auth([], ["SuperAdmin"]), function (req: Request, res: Response) {
    if (!req.params.id || !req.body.perm_name || !req.body.perm_description) {
        res.status(400).send({
            msg: 'Please pass permission ID, name, or description.',
        });
    } else {
        sequelize.Permission.findByPk(req.params.id)
            .then((perm: any) => {
                sequelize.Permission.update(
                    {
                        perm_name: req.body.perm_name || perm.perm_name,
                        perm_description: req.body.perm_description || perm.perm_description,
                    },
                    {
                        where: {
                            id: req.params.id,
                        },
                    }
                )
                    .then((_) => {
                        res.status(200).send({
                            message: 'permission updated',
                        });
                    })
                    .catch((err: any) => res.status(400).send(err));
            })
            .catch((error: any) => {
                res.status(400).send(error);
            });
    }
});

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: permission deleted
 */
// Delete a permission
router.delete('/:id', auth([], ["SuperAdmin"]), function (req: Request, res: Response) {
    if (!req.params.id) {
        res.status(400).send({
            msg: 'Please pass permission ID.',
        });
    } else {
        sequelize.Permission.findByPk(req.params.id)
            .then((perm: any) => {
                if (perm) {
                    perm
                        .destroy({
                            where: {
                                id: req.params.id,
                            },
                        }).then((_: any) => {
                            res.status(200).send({
                                message: 'permission deleted',
                            });
                        })
                        .catch((err: any) => res.status(400).send(err));
                } else {
                    res.status(404).send({
                        message: 'permission not found',
                    });
                }
            })
            .catch((error: any) => {
                res.status(400).send(error);
            });
    }
});

export default router;
