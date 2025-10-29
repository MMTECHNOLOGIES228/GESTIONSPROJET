import express from "express";

import sequelize from "../db/sequelize";
import { Op } from 'sequelize';
import { refreshkey } from "../auth/refresh_key";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import randomstring from 'randomstring';
import { error } from 'console';
import { UtilisateurAttributes } from "../interfaces/utilisateurAttributes";
import { privateKey } from "../auth/private_key";
import axios from "axios";

import auth from '../middlewares/auth';



const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: réinitialisation
 *   description: API pour gérer les réinitialisation
 */

/**
 * @swagger
 * /api/v1/reinitialser:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     description: L'API pour la renitialisation de mote de passe, vous devez founire le phone et RefreshToken.
 *     tags: [réinitialisation]
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
 *               resetToken:
 *                 type: string
 *                 description: Token de réinitialisation du mot de passe
 *             required:
 *               - phone
 *               - resetToken
 *             example:
 *               phone: "+22890112376"
 *               resetToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *     responses:
 *       '200':
 *         description: Code OTP envoyé avec succès
 *       '400':
 *         description: Erreur de requête
 *       '404':
 *         description: Utilisateur non trouvé
 *       '500':
 *         description: Erreur serveur
 */
router.post('/', async (req, res) => {


    try {
        await sequelize.Utilisateur.findOne({
            where: {
                phone: req.body.phone
            }
        }).then(async (utilisateur: any) => {

            const otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });

            if (utilisateur.status == "actif") {

                // const client = new UniClient({
                //     accessKeyId: '7r2tVvYVMuq2sSA4gwEMd1',
                // });
                // const urlsms = `https://api.afriksms.com/api/web/web_v1/outbounds/send`;

                //     const data = new URLSearchParams({
                //         ClientId: '12178593',
                //         ApiKey: 'fTpwoW_k1LKgiqlbL2KjsS6haTN8nRk9',
                //         SenderId: 'MAYO APP',
                //         Message: `Votre code de vérification est ${otp}. Pour sécurité, ne le partagez pas.`,
                //         MobileNumbers: req.body.phone.substring(1)
                //     });
                // 
                utilisateur.otp = otp;
                await utilisateur.save();
                // 

                // Supprimez l'ancien refreshToken
                await sequelize.RefreshToken.destroy({ where: { utilisateurId: utilisateur.id, } }).then(async (_) => {
                    const resetToken = jwt.sign({ id: utilisateur.id }, refreshkey, { expiresIn: '10m' });

                    await sequelize.RefreshToken.create({
                        utilisateurId: utilisateur.id,
                        token: resetToken,
                        expires: new Date(Date.now() + 10 * 60 * 1000)
                    }).then(async (_) => {

                        // await client.messages.send({
                        //     to: req.body.phone, // in E.164 format
                        //     text: `Votre code de vérification est ${otp}. Ne le partagez avec personne.`
                        // });
                        // const response = await axios.post(urlsms, data.toString(), {
                        //     headers: {
                        //         'Content-Type': 'application/x-www-form-urlencoded',
                        //     },
                        // });
                        // 
                        res.status(200).json({ message: "Code otp envoyer sur votre numero", resetToken, utilisateur });
                    }).catch((error) => {
                        res.status(404).send({
                            message: ` utilisateur not found.${error}`,
                        });
                    });
                }).catch((error) => {
                    res.status(404).send({
                        message: ` utilisateur not found.${error}`,
                    });
                });
            } else {
                await utilisateur.destroy();
                res.json({ message: 'Utilisateur supprimer avec succès', utilisateur });
            }

        }).catch((error) => {
            res.status(404).send({
                message: ` utilisateur not found.${error}`,
            });
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


/**
 * @swagger
 * /api/v1/reinitialser/reset:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     description: L'API pour entre le nouveau mote de passe, vous devez founire le phone et resetToken.
 *     tags: [réinitialisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Token de réinitialisation du mot de passe
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe
 *             required:
 *               - resetToken
 *               - newPassword
 *             example:
 *               resetToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *               newPassword: "votre nouvelle mots de passe"
 *     responses:
 *       '200':
 *         description: Mot de passe réinitialisé avec succès
 *       '401':
 *         description: Token de réinitialisation invalide ou expiré
 *       '500':
 *         description: Erreur serveur
 */
router.post('/reset', async (req, res) => {
    let { resetToken, newPassword } = req.body;

    try {
        jwt.verify(resetToken, refreshkey, async (err: any, decoded: any) => {
            if (err) {
                return res.status(401).send({ message: 'Invalid or expired reset token' });
            }

            let utilisateur: any = await sequelize.Utilisateur.findByPk(decoded.id);
            utilisateur.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            await utilisateur.save();

            // // Invalidate the resetToken
            await sequelize.RefreshToken.destroy({ where: { token: resetToken } });

            res.status(200).send({
                message: "Password reset successfully ",

            });
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/v1/reinitialser/changementpassword/{id}:
 *   post:
 *     summary: Changer le mot de passe
 *     description: L'API pour changer le mote de passe, vous devez founire le phone , l'ancien password et newPassword.
 *     tags: [réinitialisation]
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
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Ancien mot de passe
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe
 *             required:
 *               - phone
 *               - password
 *               - newPassword
 *             example:
 *               phone: "+22890112376"
 *               password: "old password"
 *               newPassword: "your newPassword"
 *     responses:
 *       '200':
 *         description: Mot de passe changé avec succès
 *       '401':
 *         description: Mot de passe incorrect ou utilisateur inactif
 *       '400':
 *         description: Erreur de requête
 *       '500':
 *         description: Erreur serveur
 */
router.post('/changementpassword/:id', async (req, res) => {
    try {
        // 
        sequelize.Utilisateur.findOne({ where: { phone: req.body.phone } }).then((utilisateur: any) => {
            if (!utilisateur) {
                return res.status(401).send({
                    message: "Authentication failed. utilisateur not found.",
                });
            }
            if (utilisateur.status == "inactif") {
                return res.status(401).send({
                    message: "utilisateur inactif.",
                });
            }

            utilisateur.comparePassword(req.body.password, async (err: any, isMatch: any) => {
                if (isMatch && !err) {
                    utilisateur.password = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
                    await utilisateur.save();
                    res.status(200).send({
                        message: "Password change successfully ",
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        msg: "Password incorectte",
                    });
                }
            });
        }).catch((error: any) => res.status(400).send(error));
    } catch (error) {
        res.status(500).send('Server error');
    }
});




export default router;
