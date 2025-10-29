'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UtilisateurAttributes } from '../interfaces/utilisateurAttributes';

export interface UtilisateurCreationAttributes extends Optional<UtilisateurAttributes, 'id'> { }

// Define the Utilisateur model
export default (sequelize: Sequelize,) => {
    class Utilisateur extends Model<UtilisateurAttributes, UtilisateurCreationAttributes> implements UtilisateurAttributes {
        public id!: string;
        public roleId!: string;
        public email!: string;
        public password!: string;
        public nom!: string;
        public prenom!: string;
        public phone!: string;
        public profilePic!: string | null;
        public status!: 'inactif' | 'actif' ;
        public otp!: string;
        public cashbackPoints!: number;

        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;

        public comparePassword!: (passw: string, cb: (err: Error | null, isMatch?: boolean) => void) => void;
    };

    Utilisateur.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        profilePic: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM( 'inactif','actif',),
            defaultValue: 'inactif',
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cashbackPoints: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Utilisateur',
    });

    // Utilisateur.beforeSave(async (utilisateur: Utilisateur, options: any) => {
    //     if (utilisateur.password) {
    //         utilisateur.password = bcrypt.hashSync(utilisateur.password, bcrypt.genSaltSync(10));
    //     }
    // });

    Utilisateur.prototype.comparePassword = function (passw: string, cb: (err: Error | null, isMatch?: boolean) => void) {
        bcrypt.compare(passw, this.password, function (err: Error | null, isMatch: boolean | undefined) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

    return Utilisateur;
};