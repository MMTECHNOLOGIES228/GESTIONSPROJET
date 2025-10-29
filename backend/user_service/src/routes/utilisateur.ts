import express from "express";
import sequelize from "../db/sequelize";
const router = express.Router();
import path from 'path';
import fs from 'fs';
// import auth from "../auth/auth";
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
// import { UtilisateurAttributes } from "../interfaces/utilisateurAttributes";
import { Request, Response, NextFunction, Router } from 'express';




import auth, { AuthenticatedRequest } from '../middlewares/auth';





/**
 * @swagger
 * tags:
 *   name: utilisateur
 *   description: API pour gérer les utilisateur crud
 */


/**
 * @swagger
 * /api/v1/utilisateur:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     tags: [utilisateur]
 *     description: Ajoute un nouvel utilisateur à la base de données.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '200':
 *         description: Utilisateur ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       '400':
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             example:
 *               msg: "Veuillez fournir le nom d'utilisateur, le mot de passe et le role."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "L'utilisateur n'a pas pu être créé. Réessayez."
 *               data: {} 
 */
router.post('/', auth([], ["SuperAdmin"]), async (req, res) => {
    // 
    console.log();
    if (
        !req.body.role_name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.nom
    ) {
        res.status(400).send({
            msg: "Please pass username, password and name.",
        });
    } else {
        sequelize.Role.findOne({
            where: {
                role_name: req.body.role_name,
            },
        }).then(async (role: any) => {
            console.log(role.id);
            // Generate OTP
            let otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            sequelize.Utilisateur.create({
                ...req.body,
                password: hashedPassword,
                otp: otp,
                roleId: role.id,
            }).then((utilisateur) => {
                const message = `L'utilisateur a été bien cree avec succès`;
                res.json({ message, data: utilisateur });
            }).catch((error) => {
                const message = `L'utilisateur n'a pas pu être cree. Réessayez.`;
                res.status(500).json({ message, data: error });
            });
        }).catch((error) => {
            const message = `Le role n'existe pas. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    }
});

/**
 * @swagger
 * /api/v1/utilisateur:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [utilisateur]
 *     description: Récupère la liste de tous les utilisateurs avec leurs rôles et permissions associés.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GetAllUsersResponse'
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants."
 *               data: {}
 */
router.get('/', auth([], ["SuperAdmin", ]), async (req, res) => {

    await sequelize.Utilisateur.findAll({
        include: [
            {
                model: sequelize.Role,
                as: "role",
                include: [
                    {
                        model: sequelize.Permission,
                        as: "permissions",
                    },
                ],

            },
        ],
    }).then((utilisateur) => {
        const message = "La liste des utilisateurs a bien été récupéré.";
        res.status(200).json({ message, data: utilisateur });
        // res.status(200).send(roles)
    }).catch((error) => {
        const message = `La liste des utilisateurs n'a pas pu être récupéré Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
    });



});

/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son identifiant
 *     tags: [utilisateur]
 *     description: Récupère un utilisateur spécifique par son identifiant avec son rôle et ses permissions associés.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *               data: {}
 */
router.get('/:id', auth([], []), async (req, res) => {
    await sequelize.Utilisateur.findByPk(req.params.id, {
        include: [
            {
                model: sequelize.Role,
                as: "role",
                include: [
                    {
                        model: sequelize.Permission,
                        as: "permissions",
                    },
                ]
            },
        ],
    }).then((utilisateur) => {
        const message = "utilisateur trouvé";
        res.status(200).json({ message, data: utilisateur });
    }).catch((error) => {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
    });
});

/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   put:
 *     summary: Mettre à jour les informations d'un utilisateur
 *     tags: [utilisateur]
 *     description: Met à jour les informations d'un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 *               data: {}
 */
router.put('/:id', auth([], []), async (req, res) => {
    try {
        await sequelize.Utilisateur.findByPk(req.params.id)
            .then(async (utilisateur: any) => {
                await utilisateur.update(req.body);
                res.json(utilisateur);
            }).catch(() => {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par son identifiant
 *     tags: [utilisateur]
 *     description: Supprime un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la suppression de l'utilisateur."
 *               data: {}
 */
router.delete('/:id', auth([], ["SuperAdmin"]), async (req, res) => {
    try {
        const utilisateur = await sequelize.Utilisateur.findByPk(req.params.id);
        if (utilisateur) {
            await utilisateur.destroy();
            res.json({ message: 'Utilisateur supprimer avec succès', utilisateur });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// 
/**
 * @swagger
 * /api/v1/utilisateur/upload/{id}:
 *   put:
 *     summary: Mettre à jour la photo de profil d'un utilisateur
 *     tags: [utilisateur]
 *     description: Met à jour la photo de profil d'un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Photo de profil de l'utilisateur mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '400':
 *         description: Aucun fichier téléchargé
 *         content:
 *           application/json:
 *             example:
 *               message: "Aucun fichier n'a été téléchargé."
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour de la photo de profil de l'utilisateur."
 *               data: {}
 */
router.put('/upload/:id', auth([], []), async (req: any, res: any) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }


    let file: any = req.files.profilePic;

    sequelize.Utilisateur.findByPk(req.params.id)
        .then(async (utilisateur: any) => {
            console.log(utilisateur.id);


            if (utilisateur.profilePic === null) {
                // Faites quelque chose si la valeur est null
                console.log('La valeur est null, exécution de l\'action A.');
            } else {
                // Récupère la partie du chemin de l'URL
                const pathname = new URL(utilisateur.profilePic).pathname;
                // Récupère le nom du fichier
                const imageName = path.basename(pathname);
                // console.log(imageName);  // Affiche "image.jpg"
                if (imageName == "profile.png") {
                    console.log('default image');
                } else {
                    const uploadPath = path.join(__dirname, './../../public', '/uploads/', imageName);
                    // console.log(uploadPath);  // Affiche "image.jpg " Url
                    if (fs.existsSync(uploadPath)) {
                        // console.log('Le fichier existe.');
                        fs.unlinkSync(uploadPath);
                        // console.log('Le fichier a été supprimé.');
                    } else {
                        console.log('Le fichier n\'existe pas, donc rien à supprimer.');
                    }
                }
                console.log('La valeur n\'est pas null, exécution de l\'action B.');
            }

            let fileName = Date.now() + file.name;
            let urlinit = "/uploads/" + fileName
            const uploadPath = path.join(__dirname, './../../public', '/uploads/', fileName)
            let url = `${req.protocol}://${req.get("host")}${urlinit}`;
            // const uploadPath = __dirname + '/uploads/' + file.name;

            console.log(uploadPath, url);

            file.mv(uploadPath, async (err: any) => {
                if (err) return res.status(500).send(err);
                await utilisateur.update({
                    ...req.body,
                    profilePic: url
                }).then((utilisateur: any) => {
                    const message = "utilisateur Profile picture uploaded";
                    res.status(200).json({ message, data: utilisateur });
                    // res.status(200).send(roles)
                }).catch((error: any) => {
                    const message = `La liste des utilisateurs n'a pas pu être récupéré Réessayez dans quelques instants.`;
                    res.status(500).json({ message, data: error });
                });
            });
        })
        .catch((error) => {
            const message = `Utilisateurd n'existe pas. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
});

// 

/**
 * @swagger
 * /api/v1/utilisateur/upload-profile:
 *   put:
 *     summary: Mettre à jour la photo de profil de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Met à jour la photo de profil de l'utilisateur connecté.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Photo de profil mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Photo de profil mise à jour avec succès.
 *                 data:
 *                   type: object
 *       '400':
 *         description: Aucun fichier téléchargé
 *         content:
 *           application/json:
 *             example:
 *               message: "Aucun fichier n'a été téléchargé."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour de la photo de profil."
 */
router.put('/upload-profile', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Vérifier si un fichier est envoyé
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé." });
        }

        const file: any = req.files.profilePic;
        const utilisateurId = req.user?.id;

        // Vérifier si l'utilisateur connecté existe
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        // Supprimer l'ancienne photo de profil si elle n'est pas une image par défaut
        if (utilisateur.profilePic) {
            const pathname = new URL(utilisateur.profilePic).pathname;
            const imageName = path.basename(pathname);

            if (imageName !== 'profile.png') {
                const uploadPath = path.join(__dirname, '../../public/uploads/', imageName);
                if (fs.existsSync(uploadPath)) {
                    fs.unlinkSync(uploadPath); // Supprimez l'ancien fichier
                }
            }
        }

        // Définir le chemin pour le nouveau fichier
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(__dirname, '../../public/uploads/', fileName);
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

        // Déplacer le fichier téléchargé
        file.mv(filePath, async (err: any) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.', error: err });
            }

            // Mettre à jour la photo de profil dans la base de données
            await utilisateur.update({ profilePic: fileUrl });
            res.status(200).json({ message: 'Photo de profil mise à jour avec succès.', data: utilisateur });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil.', error });
    }
});




/**
 * @swagger
 * /api/v1/utilisateur/info/{id}:
 *   put:
 *     summary: ajouter un info
 *     tags: [utilisateur]
 *     description: Met à jour les informations d'un utilisateur en ajouter l'info.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 *               data: {}
 */
router.put('/info/:id', auth([], []), async (req, res) => {
    try {
        await sequelize.Utilisateur.findByPk(req.params.id)
            .then(async (utilisateur: any) => {
                //    
                await utilisateur.update(req.body);
                // 
                const message = "vous avez bien complecter les information";
                res.status(200).json({ message, data: utilisateur });

            }).catch((error) => {
                res.status(404).json({ message: 'Utilisateur non trouvé' });
            });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});



/**
 * @swagger
 * /api/v1/utilisateur/user/connect/info:
 *   put:
 *     summary: Mettre à jour les informations de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Met à jour les informations de l'utilisateur connecté, y compris le nom, prénom, email, numéro de téléphone, et autres détails personnels.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean"
 *               prenom:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@example.com"
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informations mises à jour avec succès.
 *                 data:
 *                   type: object
 *       '401':
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 */
router.put('/user/connect/info', auth([], []), (req: AuthenticatedRequest, res: Response) => {
    // Récupérer l'utilisateur connecté à partir du middleware `auth`
    const utilisateurId = req.user?.id;

    if (!utilisateurId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    console.log("utilisateurId:", utilisateurId);

    // Vérifier si l'utilisateur existe
    sequelize.Utilisateur.findByPk(utilisateurId)
        .then((utilisateur: any) => {
            if (!utilisateur) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }

            // Mettre à jour les informations utilisateur
            utilisateur
                .update({
                    nom: req.body.nom || utilisateur.nom,
                    prenom: req.body.prenom || utilisateur.prenom,
                    email: req.body.email || utilisateur.email,
                })
                .then((updatedUtilisateur: any) => {
                    res.status(200).json({
                        message: 'Informations mises à jour avec succès.',
                        data: updatedUtilisateur,
                    });
                })
                .catch((updateError: any) => {
                    res.status(500).json({
                        message: "Erreur lors de la mise à jour des informations de l'utilisateur.",
                        error: updateError,
                    });
                });
        })
        .catch((findError: any) => {
            res.status(500).json({
                message: "Erreur lors de la recherche de l'utilisateur.",
                error: findError,
            });
        });
});





/**
 * @swagger
 * /api/v1/utilisateur/user/connect/me/update-profile:
 *   put:
 *     summary: Mettre à jour les informations personnelles et la photo de profil de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Permet de mettre à jour les informations personnelles et la photo de profil de l'utilisateur connecté.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean"
 *               prenom:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@example.com"
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informations utilisateur mises à jour avec succès.
 *                 data:
 *                   type: object
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations."
 */
router.put('/user/connect/me/update-profile', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
        // const id = req.user?.id;
        const userId = req.user?.id!;

        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        // Récupérer l'utilisateur connecté depuis la base de données
        const utilisateur = await sequelize.Utilisateur.findByPk(userId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Gérer la photo de profil si un fichier est envoyé
        if (req.files && req.files.profilePic) {
            const file: any = req.files.profilePic;

            // Supprimer l'ancienne photo de profil si elle existe et n'est pas l'image par défaut
            if (utilisateur.profilePic) {
                const pathname = new URL(utilisateur.profilePic).pathname;
                const imageName = path.basename(pathname);

                if (imageName !== 'profile.png') {
                    const uploadPath = path.join(__dirname, '../../public/uploads/', imageName);
                    if (fs.existsSync(uploadPath)) {
                        fs.unlinkSync(uploadPath); // Supprimez l'ancien fichier
                    }
                }
            }

            // Définir le chemin pour le nouveau fichier
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(__dirname, '../../public/uploads/', fileName);
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;

            // Déplacer le fichier téléchargé
            file.mv(filePath, async (err: any) => {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.', error: err });
                }
                // utilisateur.profilePic = fileUrl; // Mettre à jour l'URL de la photo de profil
                // Mettre à jour la photo de profil dans la base de données
                await utilisateur.update({
                    ...req.body,
                    profilePic: fileUrl
                });
                res.status(200).json({ message: 'Informations utilisateur mises à jour avec succès.', data: utilisateur });

            });
        }

        // // Mettre à jour les autres informations
        // await utilisateur.update({

        //     ...req.body,
        //     profilePic: fileUrl
        // });

        // res.status(200).json({
        //     message: 'Informations utilisateur mises à jour avec succès.',
        //     data: utilisateur,
        // });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour des informations.',
            error,
        });
    }
});



/**
 * @swagger
 * /api/v1/utilisateur/user/connect/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Récupère les informations personnelles de l'utilisateur actuellement authentifié.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur connecté récupéré avec succès."
 *                 data:
 *                   type: object
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé."
 */
router.get('/user/connect/me', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const utilisateurId = req.user?.id;

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId, {
            include: [
                {
                    model: sequelize.Role,
                    as: 'role',
                    include: [{ model: sequelize.Permission, as: 'permissions' }],
                },
            ],
        });

        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.status(200).json({
            message: 'Utilisateur connecté récupéré avec succès.',
            data: utilisateur,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'utilisateur.',
            error,
        });
    }
});







export default router;
