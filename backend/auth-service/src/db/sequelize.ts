
import { Sequelize, DataType } from 'sequelize-typescript';

// 
import RoleModel from "../models/role";
import PermissionModel from '../models/permission';
import RolePermissionModel from "../models/rolepermission";
import UtilisateurModel from "../models/utilisateur";
import RefreshTokenModel from "../models/refreshToken";
import OtpVerificationModel from "../models/otpVerification";

// import { DataTypes } from "sequelize";
import * as dotenv from 'dotenv';
import roles from '../data/roles';
import permissions from '../data/mock-permission';
dotenv.config();
// 
// import RoleModel from "../models/role";




// Import your mock data



const ENV = process.env.NODE_ENV || 'development';  // Par défaut à 'development' si rien n'est défini

let sequelize: Sequelize;

switch (ENV) {
  case 'development':
    sequelize = new Sequelize({
      database: process.env.DEV_DB_DATABASE,
      username: process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD,
      host: process.env.DEV_DB_HOST,
      port: parseInt(process.env.DEV_DB_PORT || '5432'),
      dialect: 'postgres',
      dialectOptions: {
        timezone: "Etc/GMT-2",
      },
      logging: true,
    });
    break;
  case 'test':
    sequelize = new Sequelize({
      database: process.env.TEST_DB_DATABASE,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      host: process.env.TEST_DB_HOST,
      port: parseInt(process.env.TEST_DB_PORT || '5432'),
      dialect: 'postgres',
      dialectOptions: {
        timezone: "Etc/GMT-2",
      },
      logging: true,
    });

    break;
  case 'production':
    sequelize = new Sequelize({
      database: process.env.PROD_DB_DATABASE,
      username: process.env.PROD_DB_USERNAME,
      password: process.env.PROD_DB_PASSWORD,
      host: process.env.PROD_DB_HOST,
      port: parseInt(process.env.PROD_DB_PORT || '5432'),
      dialect: 'postgres',
      dialectOptions: {
        timezone: "Etc/GMT-2",
      },
      logging: true,
    });
    break;
  default:
    throw new Error('Invalid environment specified');
}


const Role = RoleModel(sequelize);
const Permission = PermissionModel(sequelize);
const RolePermission = RolePermissionModel(sequelize);
const Utilisateur = UtilisateurModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);
const OtpVerification = OtpVerificationModel(sequelize);







// 

Role.belongsToMany(Permission, { through: "RolePermission", as: "permissions", foreignKey: "roleId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Permission.belongsToMany(Role, { through: "RolePermission", as: "roles", foreignKey: "permId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
// 
// Relations directes avec la table de liaison RolePermission
Role.hasMany(RolePermission, {
  foreignKey: 'roleId',
  as: 'rolePermissions'
});

Permission.hasMany(RolePermission, {
  foreignKey: 'permId',
  as: 'rolePermissions'
});

RolePermission.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'
});

RolePermission.belongsTo(Permission, {
  foreignKey: 'permId',
  as: 'permission'
});

// Relations entre Role et Utilisateur (One-to-Many)
Role.hasMany(Utilisateur, {
  foreignKey: "roleId",
  as: "utilisateurs",
  onDelete: 'RESTRICT', // Empêche la suppression d'un rôle s'il a des utilisateurs
  onUpdate: 'CASCADE',
});

Utilisateur.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role"
});

// Relations entre Utilisateur et RefreshToken (One-to-Many)
Utilisateur.hasMany(RefreshToken, {
  foreignKey: 'utilisateurId',
  as: 'refreshTokens',
  onDelete: 'CASCADE', // Supprime les tokens quand l'utilisateur est supprimé
  onUpdate: 'CASCADE'
});

RefreshToken.belongsTo(Utilisateur, {
  foreignKey: 'utilisateurId',
  as: 'utilisateur'
});



const initDb = async () => {

  try {
    await sequelize.sync({ force: true });
    console.log("La base de donnée a bien été initialisée !");

  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
  }
};

export {
  initDb,
  // // 
  Role,
  Permission,
  RolePermission,
  // 
  Utilisateur,
  RefreshToken,
  OtpVerification

};