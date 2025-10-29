import express, { Request, Response, Router } from "express";
import sequelize from "../db/sequelize";
import { ValidationError, UniqueConstraintError } from "sequelize";
import auth from '../middlewares/auth';


const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */


/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: Admin
 *               role_description:
 *                 type: string
 *                 example: Role for administrators
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le Roles Admin a bien été cree.
 *                 data:
 *                   type: object
 */
// Create a new Role
router.post("/", auth([], ['SuperAdmin']), function (req: Request, res: Response) {
    if (!req.body.role_name || !req.body.role_description) {
        res.status(400).send({
            msg: "Please pass Role name or description.",
        });
    } else {
        sequelize.Role.create(req.body)
            .then((role: any) => {
                const message = `Le Roles ${req.body.role_name} a bien été cree.`;
                res.json({ message, data: role });
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
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La liste des roles a bien été récupéré.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get List of Roles
router.get("/", auth([], ['SuperAdmin']), async function (req: Request, res: Response) {
    sequelize.Role.findAll({
        include: [
            {
                model: sequelize.Permission,
                as: "permissions",
            },
            {
                model: sequelize.Utilisateur,
                as: "utilisateurs",
            },
        ],
    })
        .then((roles: any) => {
            const message = "La liste des roles a bien été récupéré.";
            res.json({ message, data: roles });
        })
        .catch((error: any) => {
            const message = `La liste des roles n'a pas pu être récupéré. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
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
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Get Role by ID
router.get("/:id", auth([], ['SuperAdmin']), function (req: Request, res: Response) {
    sequelize.Role.findByPk(req.params.id, {
        include: [
            {
                model: sequelize.Permission,
                as: "permissions",
            },
            {
                model: sequelize.Utilisateur,
                as: "utilisateurs",
            },
        ],
    })
        .then((roles: any) => {
            res.status(200).send(roles);
        })
        .catch((error: any) => {
            res.status(400).send({
                success: false,
                msg: error,
            });
        });
});


/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *       description: Updated role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: Manager
 *               role_description:
 *                 type: string
 *                 example: Role for managing teams
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Update a Role
router.put("/:id", auth([], ['SuperAdmin']), function (req: Request, res: Response) {
    if (!req.params.id || !req.body.role_name || !req.body.role_description) {
        res.status(400).send({
            msg: "Please pass Role ID, name or description.",
        });
    } else {
        sequelize.Role.findByPk(req.params.id)
            .then((_: any) => {
                sequelize.Role.update(req.body, {
                    where: {
                        id: req.params.id,
                    },
                }).then((_: any) => {
                    sequelize.Role.findByPk(req.params.id).then((roleup: any) => {
                        res.status(200).send({
                            message: "Role updated",
                            roleup,
                        });
                    })

                }).catch((err: any) =>
                    res.status(400).send({
                        success: false,
                        msg: err,
                    })
                );
            })
            .catch((error: any) => {
                res.status(400).send({
                    success: false,
                    msg: error,
                });
            });
    }
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role deleted
 */
// Delete a Role
router.delete("/:id", auth([], ["SuperAdmin"]), function (req: Request, res: Response) {
    if (!req.params.id) {
        res.status(400).send({
            msg: "Please pass role ID.",
        });
    } else {
        sequelize.Role.findByPk(req.params.id)
            .then((role: any) => {
                if (role) {
                    sequelize.Role.destroy({
                        where: {
                            id: req.params.id,
                        },
                    })
                        .then((_) => {
                            res.status(200).send({
                                message: "Role deleted",
                                role,
                            });
                        })
                        .catch((err: any) => res.status(400).send(err));
                } else {
                    res.status(404).send({
                        message: "Role not found",
                    });
                }
            })
            .catch((error: any) => {
                res.status(400).send({
                    success: false,
                    msg: error,
                });
            });
    }
});


/**
 * @swagger
 * /api/v1/roles/permissions/{id}:
 *   post:
 *     summary: Ajouter des permissions à un rôle
 *     description: Associe des permissions à un rôle existant.
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du rôle
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 description: Liste des IDs des permissions à associer
 *                 items:
 *                   type: string
 *             required:
 *               - permissions
 *             example:
 *               permissions: ["perm1", "perm2", "perm3"]
 *     responses:
 *       '200':
 *         description: Permissions ajoutées avec succès
 *       '400':
 *         description: Erreur de validation
 *       '500':
 *         description: Erreur interne du serveur
 */
// Add Permissions to Role
router.post("/permissions/:id", auth([], ['SuperAdmin']), function (req: Request, res: Response) {
    if (!req.body.permissions) {
        res.status(400).send({
            msg: "Please pass permissions.",
        });
    } else {
        sequelize.Role.findByPk(req.params.id)
            .then((role: any) => {
                sequelize.RolePermission.destroy({
                    where: {
                        roleId: role.id,
                    },
                })
                    .then((roles:any) => {
                        req.body.permissions.forEach(function (item: any, index: any) {
                            sequelize.Permission.findByPk(item)
                                .then(async (perm: any) => {
                                    await role.addPermissions(perm, {
                                        through: {
                                            selfGranted: false,
                                        },
                                    });
                                })
                                .catch((error: any) => {
                                    res.status(400).send({
                                        success: false,
                                        msg: error,
                                    });
                                });
                        });
                        const message = `Permissions added.`;
                        res.status(500).json({ message, data: roles });
                    })
                    .catch((error: any) => {
                        const message = `Le RolePermission n'existe pas. Réessayez dans quelques instants.`;
                        res.status(500).json({ message, data: error });
                    });
            })
            .catch((error: any) => {
                const message = `Le Role n'existe pas. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    }
});


export default router;
