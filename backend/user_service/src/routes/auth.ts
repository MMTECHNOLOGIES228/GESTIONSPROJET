import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sequelize from "../db/sequelize";
import { privateKey } from "../auth/private_key";
import { refreshkey } from "../auth/refresh_key";
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import { UtilisateurAttributes } from "../interfaces/utilisateurAttributes";
import { Request, Response } from 'express';
// 
import axios, { AxiosResponse } from "axios";

import auth, { AuthenticatedRequest } from '../middlewares/auth';
// 


// Helper function to generate JWT
const generateTokens = (utilisateurId: string, role: string, permissions: string[]) => {
    const token = jwt.sign({ utilisateurId, role, permissions }, privateKey, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ utilisateurId }, refreshkey, { expiresIn: "2y" });
    return { token, refreshToken };
};

// Helper function to find user by phone
const findUserByPhone = async (phone: string) => {
    return sequelize.Utilisateur.findOne({ where: { phone } });
};

// Helper function to find role by name
const findRoleByName = async (roleName: string) => {
    return sequelize.Role.findOne({ where: { role_name: roleName } });
};



const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: API pour gérer les opérations d'authentification
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Créer un nouveau compte
 *     description: L'API de création de compte avec rôle permet de créer de nouveaux comptes dans un système en attribuant automatiquement un rôle spécifique à chaque compte. Cette API accepte des paramètres tels que le numero de telephone, le mot de passe et le rôle à attribuer. En fonction du rôle spécifié, le système crée le compte avec les autorisations et les paramètres appropriés, ce qui simplifie le processus de gestion des utilisateurs avec des niveaux d'accès différents.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 description: Nom du rôle de l'utilisateur
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - role_name
 *               - phone
 *               - password
 *             example:
 *               role_name: "admin"
 *               phone: "+22891514288"
 *               password: "123456789"
 *     responses:
 *       '200':
 *         description: Compte utilisateur créé avec succès
 *       '400':
 *         description: Erreur de requête
 */
router.post("/signup", async (req: Request, res: Response) => {
    const { role_name, phone, password, nom, prenom, email, status } = req.body;

    if (!role_name || !phone || !password) {
        return res.status(400).json({ message: "Please provide role_name, phone, and password." });
    }

    try {
        const role = await findRoleByName(role_name);
        if (!role) {
            return res.status(400).json({ message: "Invalid role." });
        }

        const existingUser = await findUserByPhone(phone);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const otp = randomstring.generate({ length: 6, charset: "numeric" });
        const profilePicUrl = `${req.protocol}://${req.get("host")}/uploads/profile.png`;

        const utilisateur = await sequelize.Utilisateur.create({
            phone,
            password: hashedPassword,
            nom,
            prenom,
            email,
            profilePic: profilePicUrl,
            status: status || "inactif",
            otp,
            roleId: role.id,
            cashbackPoints: 0,
        });

        return res.status(201).json({ message: "User created successfully.", data: utilisateur });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user.", error });
    }
});


/**
 * @swagger
 * /api/v1/auth/signup/inviter/{id}:
 *   post:
 *     summary: Créer un nouveau compte par invitation
 *     description: La fonction de création d'un nouvel utilisateur par invitation permet à un utilisateur existant d'envoyer une invitation à une nouvelle personne pour qu'elle rejoigne le système. L'invitation contient généralement un lien ou un code unique permettant à la nouvelle personne de s'inscrire directement avec des paramètres prédéfinis, comme le rôle dans le système ou les autorisations associées. Cela simplifie le processus d'inscription et garantit que les nouveaux utilisateurs sont associés aux bons rôles dès le début.
 *     tags: [Authentification]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur qui invite
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 description: Nom du rôle de l'utilisateur
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur invité
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur invité
 *             required:
 *               - role_name
 *               - phone
 *               - password
 *             example:
 *               role_name: "admin"
 *               phone: "+22890900022"
 *               password: "SecurePassword123"
 *     responses:
 *       '200':
 *         description: Utilisateur invité créé avec succès
 *       '400':
 *         description: Erreur de requête
 */
router.post("/signup/inviter/:id", function (req, res) {
    // console.log();
    if (
        !req.body.role_name ||
        !req.body.phone ||
        !req.body.password
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

            await sequelize.Utilisateur.findOne({
                where: {
                    phone: req.body.phone,
                },
            }).then(async (utilisateur) => {
                // console.log(utilisateur);
                if (utilisateur == null) {
                    // Generate OTP
                    let otp = randomstring.generate({
                        length: 6,
                        charset: 'numeric'
                    });

                    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                    // 
                    let urlinit = "/uploads/" + "profile.png"
                    let url = `${req.protocol}://${req.get("host")}${urlinit}`;


                    const urlsms = `https://api.afriksms.com/api/web/web_v1/outbounds/send`;

                    const data = new URLSearchParams({
                        ClientId: '12178593',
                        ApiKey: 'fTpwoW_k1LKgiqlbL2KjsS6haTN8nRk9',
                        SenderId: 'MAYO APP',
                        Message: `Votre code de vérification est ${otp}. Pour sécurité, ne le partagez pas.`,
                        MobileNumbers: req.body.phone.substring(1)
                    });
                    axios.post(urlsms, data.toString(), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                        .then(async (ret) => {
                            console.log(ret)
                            await sequelize.Utilisateur.create({
                                ...req.body,
                                password: hashedPassword,
                                profilePic: url,
                                otp: otp,
                                roleId: role.id,
                                cashbackPoints: 0,
                            }).then(async (utilisateur: UtilisateurAttributes) => {
                                // 

                                try {
                                    // Logique pour gérer l'inscription via le lien d'invitation et ajouter des points de cashback
                                    await sequelize.Utilisateur.findByPk(req.params.id).then(async (invitedUser: any) => {
                                        invitedUser.cashbackPoints += 20;
                                        await invitedUser.save();
                                        let message = `L'utilisateur a été bien cree avec succès`;
                                        res.json({ message, data: utilisateur, });
                                    }).catch((error: any) => {
                                        let message = `ajouter des points de cashback error. Réessayez.`;
                                        res.status(500).json({ message, data: error });
                                    });
                                } catch (error) {
                                    let message = `L'utilisateur a été bien cree avec succès`;
                                    res.json({ message, data: utilisateur, });
                                }
                            }).catch((error: any) => {
                                let message = `L'utilisateur n'a pas pu être cree. Réessayez.`;
                                res.status(500).json({ message, data: error });
                            });
                            // let message = `L'utilisateur a été bien cree avec succès`;
                            // console.log('Result:', ret)
                            // res.json({ message, data: ret,  });
                        }).catch(error => {
                            res.status(error.response?.status || 500).json({
                                message: 'Erreur lors de l\'envoi du code OTP.',
                                error: error.response?.data || 'Aucune information supplémentaire disponible.',
                            });
                        })

                } else {
                    if (utilisateur.status == "actif") {
                        let message = `L'utilisateur existe dèja`;
                        res.status(400).json({ message, data: utilisateur, });
                    } else {
                        await utilisateur.destroy();
                        res.json({ message: 'Utilisateur supprimer avec succès', utilisateur });
                    }
                }
            }).catch(async error => {
                console.error('Erreur lors de la vérification de l\'utilisateur :', error.message);
                res.status(500).send('Erreur lors de la vérification de l\'utilisateur');
            });
        })
            .catch((error: any) => {
                let message = `Le role n'existe pas. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
    }
});


/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: La fonction Authentifier permet à un utilisateur de ce connecter au système.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - phone
 *               - password
 *             example:
 *               phone: "+22891514288"
 *               password: "123456789"
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *       '401':
 *         description: Erreur d'authentification
 */

router.post("/signin", async (req: Request, res: Response) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "Please provide phone and password." });
    }

    try {
        const utilisateur = await findUserByPhone(phone);
        if (!utilisateur) {
            return res.status(401).json({ message: "User not found." });
        }

        if (utilisateur.status === "inactif") {
            return res.status(401).json({ message: "User is inactive." });
        }

        const isMatch = bcrypt.compareSync(password, utilisateur.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const role: any = await sequelize.Role.findByPk(utilisateur.roleId, {
            include: [{ model: sequelize.Permission, as: "permissions" }],
        });

        if (!role) {
            return res.status(500).json({ message: "Role not found for the user." });
        }

        const permissions = role.permissions.map((perm: any) => perm.perm_name);
        const { token, refreshToken } = generateTokens(utilisateur.id, role.role_name, permissions);

        await sequelize.RefreshToken.create({
            utilisateurId: utilisateur.id,
            token: refreshToken,
            expires: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({
            message: "User authenticated successfully.",
            data: utilisateur,
            token,
            refreshToken,
            role: role.role_name,
            permissions,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error during authentication.", error });
    }
});

// 


/**
 * @swagger
 * /api/v1/auth/signinemail:
 *   post:
 *     summary: Authentifier un utilisateur par email
 *     description: Permet à un utilisateur de se connecter au système via son email et son mot de passe.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "superadmin@event-system.com"
 *               password: "password123"
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: L'utilisateur a été connecté avec succès.
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 role:
 *                   type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       '401':
 *         description: Échec d'authentification
 */
router.post("/signinemail", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        const utilisateur = await sequelize.Utilisateur.findOne({ where: { email } });
        if (!utilisateur) {
            return res.status(401).json({ message: "User not found." });
        }

        if (utilisateur.status === "inactif") {
            return res.status(401).json({ message: "User is inactive." });
        }

        const isMatch = bcrypt.compareSync(password, utilisateur.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const role: any = await sequelize.Role.findByPk(utilisateur.roleId, {
            include: [{ model: sequelize.Permission, as: "permissions" }],
        });

        if (!role) {
            return res.status(500).json({ message: "Role not found for the user." });
        }

        const permissions = role.permissions.map((perm: any) => perm.perm_name);
        const { token, refreshToken } = generateTokens(utilisateur.id, role.role_name, permissions);

        await sequelize.RefreshToken.create({
            utilisateurId: utilisateur.id,
            token: refreshToken,
            expires: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({
            message: "User authenticated successfully.",
            data: utilisateur,
            token,
            refreshToken,
            role: role.role_name,
            permissions,
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Error during authentication.", error });
    }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'authentification
 *     description: La fonction Authentifier permet à un utilisateur de ce connecter au système.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement
 *             required:
 *               - refreshToken
 *             example:
 *               refreshToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *     responses:
 *       '200':
 *         description: Token rafraîchi avec succès
 *       '401':
 *         description: Erreur de rafraîchissement du token
 */
router.post("/refresh", async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Please provide refresh token." });
    }

    try {
        const savedToken = await sequelize.RefreshToken.findOne({ where: { token: refreshToken } });
        if (!savedToken) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        const decoded = jwt.verify(refreshToken, refreshkey) as JwtPayload;

        if (!decoded.utilisateurId) {
            return res.status(403).json({ message: "Invalid token payload." });
        }

        const utilisateur = await sequelize.Utilisateur.findByPk(decoded.utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: "User not found." });
        }

        const role: any = await sequelize.Role.findByPk(utilisateur.roleId, {
            include: [{ model: sequelize.Permission, as: "permissions" }],
        });

        if (!role) {
            return res.status(500).json({ message: "Role not found for the user." });
        }

        const permissions = role.permissions.map((perm: any) => perm.perm_name);

        const { token: newToken, refreshToken: newRefreshToken } = generateTokens(utilisateur.id, role.role_name, permissions);

        await savedToken.destroy();
        await sequelize.RefreshToken.create({
            utilisateurId: utilisateur.id,
            token: newRefreshToken,
            expires: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({
            token: newToken,
            refreshToken: newRefreshToken,
            role: role.role_name,
            permissions,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error refreshing token.", error });
    }
});


/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Vérifier le code OTP
 *     description: Permet à un utilisateur de vérifier son code OTP pour activer son compte.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               otp:
 *                 type: string
 *                 description: Code OTP à vérifier
 *             required:
 *               - phone
 *               - otp
 *             example:
 *               phone: "+22890900022"
 *               otp: "123456"
 *     responses:
 *       '200':
 *         description: Code OTP vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User verified and activated successfully.
 *                 data:
 *                   type: object
 *       '400':
 *         description: Erreur de vérification du code OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP.
 */
router.post("/verify-otp", async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ message: "Please provide phone and otp." });
    }

    try {
        const utilisateur = await findUserByPhone(phone);
        if (!utilisateur) {
            return res.status(404).json({ message: "User not found." });
        }

        if (utilisateur.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        await utilisateur.update({ status: "actif" });

        return res.status(200).json({
            message: "User verified and activated successfully.",
            data: {
                id: utilisateur.id,
                phone: utilisateur.phone,
                status: utilisateur.status,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP.", error });
    }
});



/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Déconnecter l'utilisateur
 *     description: La fonction Authentifier permet à un utilisateur de ce connecter au système.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement à utiliser pour la déconnexion
 *             required:
 *               - refreshToken
 *             example:
 *               refreshToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *     responses:
 *       '200':
 *         description: Utilisateur déconnecté avec succès
 *       '500':
 *         description: Erreur lors de la déconnexion de l'utilisateur
 */
router.post("/logout", async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Please provide refresh token." });
    }

    try {
        await sequelize.RefreshToken.destroy({ where: { token: refreshToken } });
        return res.status(200).json({ message: "User logged out successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error during logout.", error });
    }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur connecté
 *       401:
 *         description: Token invalide ou expiré
 */

router.get("/me", auth([], []), async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or invalid." });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, privateKey) as JwtPayload;

        const utilisateur = await sequelize.Utilisateur.findByPk(decoded.utilisateurId, {
            attributes: { exclude: ['password'] },
            // include: [{ model: sequelize.Role }]
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
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        return res.status(200).json({
            message: "Utilisateur authentifié.",
            data: utilisateur,
        });
    } catch (error: any) {
        return res.status(401).json({
            message: "Token invalide ou expiré.",
            error: error.message,
        });
    }
});



/**
 * @swagger
 * /api/v1/auth/user/role/switch:
 *   put:
 *     summary: Changer le rôle de l'utilisateur connecté
 *     description: Cette route permet à un utilisateur connecté de changer son rôle parmi les rôles autorisés (Admin, Client, Marchand).
 *     tags: [Authentification]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 description: Le nouveau rôle à attribuer à l'utilisateur (Admin, Client ou Marchand)
 *             required:
 *               - newRole
 *             example:
 *               newRole: "Client"
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rôle mis à jour avec succès.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID de l'utilisateur
 *                     newRole:
 *                       type: string
 *                       description: Nouveau rôle affecté
 *       400:
 *         description: Rôle invalide ou non autorisé
 *         content:
 *           application/json:
 *             example:
 *               message: Rôle invalide.
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: Utilisateur non authentifié.
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: Erreur serveur.
 */

router.put('/user/role/switch', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { newRole } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        if (!newRole || typeof newRole !== 'string') {
            return res.status(400).json({ message: 'Nom de rôle requis.' });
        }

        const rolesAutorises = ['Client', 'Organisateur', 'Collaborateur'];
        if (!rolesAutorises.includes(newRole)) {
            return res.status(400).json({ message: 'Rôle invalide.' });
        }

        const role = await sequelize.Role.findOne({ where: { role_name: newRole } });
        if (!role) {
            return res.status(400).json({ message: "Le rôle spécifié n'existe pas." });
        }

        const user = await sequelize.Utilisateur.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        user.roleId = role.id;
        await user.save();

        return res.status(200).json({
            message: 'Rôle mis à jour avec succès.',
            data: {
                id: user.id,
                newRole: role.role_name,
            },
        });
    } catch (error) {
        console.error('Erreur de changement de rôle :', error);
        return res.status(500).json({ message: 'Erreur serveur.', error });
    }
});





export default router;