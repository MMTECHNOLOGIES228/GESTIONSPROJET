
import { Sequelize, DataType } from 'sequelize-typescript';
// import { DataTypes } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();
// 
import RoleModel from "../models/role";
import PermissionModel from '../models/permission';
import RolePermissionModel from "../models/rolepermission";
import UtilisateurModel from "../models/utilisateur";
import RefreshTokenModel from "../models/refreshToken";



// Import your mock data
import roles from "../data/roles";
import permissions from "../data/mock-permission";


const ENV = process.env.NODE_ENV || 'development';  // Par défaut à 'development' si rien n'est défini

let sequelize: Sequelize;

switch (ENV) {
  case 'development':
    sequelize = new Sequelize({
      database: process.env.DEV_DB_DATABASE,
      username: process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD,
      host: process.env.DEV_DB_HOST,
      port: parseInt(process.env.DEV_DB_PORT || '3306'),
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
      port: parseInt(process.env.TEST_DB_PORT || '3306'),
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
      port: parseInt(process.env.PROD_DB_PORT || '3306'),
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



// // Define associations
Role.belongsToMany(Permission, { through: "RolePermission", as: "permissions", foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: "RolePermission", as: "roles", foreignKey: "permId" });

Utilisateur.belongsToMany(Utilisateur, { through: "Invitation", as: "inviter", foreignKey: "inviterId" });

// // // One-To-Many relationships
Role.hasMany(Utilisateur, { foreignKey: "roleId", as: "utilisateurs" });
Utilisateur.belongsTo(Role, { foreignKey: "roleId", as: "role" });






const initDb = async () => {

  try {
    await sequelize.sync({ force: false });
    console.log("La base de donnée a bien été initialisée !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
  }
};

export default {
  initDb,
  // 
  Role,
  Permission,
  RolePermission,
  // 
  Utilisateur,
  RefreshToken,
};