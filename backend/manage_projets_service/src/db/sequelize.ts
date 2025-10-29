
import { Sequelize, DataType } from 'sequelize-typescript';
// import { DataTypes } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();
// 
import OrganizationModel from "../models/organization";
import MemberModel from "../models/member";
import ProjectModel from "../models/project";
import TaskModel from "../models/task";



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



const Organization = OrganizationModel(sequelize);
const Member = MemberModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);

// Define associations
Organization.hasMany(Member, {
  foreignKey: 'organization_id', as: 'members'
});
Member.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

Organization.hasMany(Project, {
  foreignKey: 'organization_id',
  as: 'projects'
});
Project.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

Organization.hasMany(Task, {
  foreignKey: 'organization_id',
  as: 'tasks'
});
Task.belongsTo(Organization, {
  foreignKey: 'organization_id',
  as: 'organization'
});

Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'tasks'
});
Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project'
});

// Member-Project many-to-many through a junction table would be here if needed
// Project.belongsToMany(Member, { through: 'project_members', foreignKey: 'project_id' });
// Member.belongsToMany(Project, { through: 'project_members', foreignKey: 'member_id' });






const initDb = async () => {

  try {
    await sequelize.sync({ force: false });
    console.log("La base de donnée a bien été initialisée !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données :", error);
  }
};

export  {
  initDb,
  Organization,
  Member,
  Project,
  Task,
};