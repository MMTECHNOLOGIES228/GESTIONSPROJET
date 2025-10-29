import { OtpVerification } from "../db/sequelize";
import { OTPVerificationAttributes } from "../interfaces/utilisateurAttributes";


export class OTPService {
    private readonly OTP_EXPIRY_MINUTES = 10;
    private readonly OTP_LENGTH = 6;

    /**
     * Générer un code OTP
     */
    generateOTP(): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < this.OTP_LENGTH; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }

    /**
     * Calculer la date d'expiration
     */
    getExpiryDate(): Date {
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + this.OTP_EXPIRY_MINUTES);
        return expiry;
    }

    /**
     * Vérifier si l'OTP a expiré
     */
    isOTPExpired(expires: Date): boolean {
        return new Date() > expires;
    }

    /**
     * Envoyer OTP par email (simulation)
     */
    async sendOTPByEmail(email: string, code: string): Promise<void> {
        // Ici vous intégrerez votre service d'email (SendGrid, Mailgun, etc.)
        console.log(`OTP envoyé à ${email}: ${code}`);
        // Simulation d'envoi d'email
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Envoyer OTP par SMS (simulation)
     */
    async sendOTPBySMS(phone: string, code: string): Promise<void> {
        // Ici vous intégrerez votre service SMS (Twilio, etc.)
        console.log(`OTP envoyé à ${phone}: ${code}`);
        // Simulation d'envoi SMS
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Vérifier un code OTP
     */
    verifyOTP(storedCode: string, inputCode: string, expires: Date): boolean {
        if (this.isOTPExpired(expires)) {
            throw new Error('OTP expiré');
        }
        return storedCode === inputCode;
    }

    /**
     * Générer et envoyer un OTP
     */
    async generateAndSendOTP(userId: string, identifier: string, type: 'email' | 'phone'): Promise<void> {
        try {
            // Générer le code OTP
            const code = this.generateOTP();
            const expires = this.getExpiryDate();

            // Supprimer les anciens OTP non vérifiés pour cet utilisateur et type
            await OtpVerification.destroy({
                where: {
                    utilisateurId: userId,
                    type,
                    verified: false
                }
            });

            // Créer un nouvel enregistrement OTP
            await OtpVerification.create({
                utilisateurId: userId,
                code,
                type,
                expires,
                verified: false
            });

            // Envoyer l'OTP selon le type
            if (type === 'email') {
                await this.sendOTPByEmail(identifier, code);
            } else {
                await this.sendOTPBySMS(identifier, code);
            }
        } catch (error) {
            throw new Error(`Erreur lors de la génération et envoi de l'OTP: ${error}`);
        }
    }

    /**
     * Vérifier un OTP
     */
    async verifyOTPCode(userId: string, code: string, type: 'email' | 'phone'): Promise<boolean> {
        try {
            console.log(`Vérification OTP pour userId: ${userId}, code: ${code}, type: ${type}`);
            // Trouver l'enregistrement OTP
            const otpRecord = await OtpVerification.findOne({
                where: {
                    utilisateurId: userId,
                    code,
                    type,
                    verified: false
                }
            });

            if (!otpRecord) {
                throw new Error('Code OTP non trouvé');
            }

            if (this.isOTPExpired(otpRecord.expires)) {
                await otpRecord.destroy();
                throw new Error('OTP expiré');
            }

            // Marquer l'OTP comme vérifié
            await otpRecord.update({ verified: true });

            return true;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification de l'OTP: ${error}`);
        }
    }

    /**
     * Récupérer l'OTP actif pour un utilisateur
     */
    async getActiveOTP(userId: string, type: 'email' | 'phone'): Promise<OTPVerificationAttributes | null> {
        try {
            const otpRecord = await OtpVerification.findOne({
                where: {
                    utilisateurId: userId,
                    type,
                    verified: false,
                    expires: { $gt: new Date() }
                }
            });

            return otpRecord ? otpRecord.toJSON() : null;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de l'OTP: ${error}`);
        }
    }
}

export default new OTPService();