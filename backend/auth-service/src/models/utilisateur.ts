'use strict';
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UtilisateurAttributes } from '../interfaces/utilisateurAttributes';



// Define the Utilisateur model
export default (sequelize: Sequelize,) => {
    class Utilisateur extends Model<UtilisateurAttributes> implements UtilisateurAttributes {


        public id!: string;
        public roleId!: string;
        public email!: string;
        public password!: string;
        public nom!: string;
        public prenom!: string;
        public phone!: string;
        public profilePic!: string | null;
        public status!: 'inactif' | 'actif';
        public passwordChanged!: boolean;
        public authMethod!: 'email' | 'phone' | 'google';
        public emailVerified?: boolean | undefined;
        public phoneVerified?: boolean | undefined;
        public googleId?: string | undefined;


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
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                len: [10, 15]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Nullable pour Google auth
            validate: {
                len: [6, 100]
            }
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50]
            }
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50]
            }
        },
        profilePic: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: {
            //     isUrl: true
            // }
        },
        status: {
            type: DataTypes.ENUM('inactif', 'actif', 'en_attente'),
            defaultValue: 'en_attente',
            allowNull: false,
        },
        passwordChanged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        authMethod: {
            type: DataTypes.ENUM('email', 'phone', 'google'),
            allowNull: false,
            defaultValue: 'email'
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        phoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Utilisateur',
    });
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