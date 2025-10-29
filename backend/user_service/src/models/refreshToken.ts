'use strict';
import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { RefreshTokenAttributes } from '../interfaces/refreshTokenAttributes';


export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> { }

export default (sequelize: Sequelize) => {
    class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
        public id!: string;
        public utilisateurId!: string;
        public token!: string;
        public expires!: Date;

        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }


    RefreshToken.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        utilisateurId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'RefreshToken',
    });

    return RefreshToken;
};


