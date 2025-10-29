import { Model, DataTypes, Sequelize } from 'sequelize';
import { OTPVerificationAttributes } from '../interfaces/utilisateurAttributes';

export default (sequelize: Sequelize) => {
    class OTPVerification extends Model<OTPVerificationAttributes> implements OTPVerification {
        public id?: string;
        public utilisateurId!: string;
        public code!: string;
        public type!: 'email' | 'phone';
        public expires!: Date;
        public verified?: boolean;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    OTPVerification.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            utilisateurId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'utilisateurs',
                    key: 'id'
                }
            },
            code: {
                type: DataTypes.STRING(6),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('email', 'phone'),
                allowNull: false,
            },
            expires: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'OTPVerification',
            timestamps: true,
        }
    );

    return OTPVerification;
};