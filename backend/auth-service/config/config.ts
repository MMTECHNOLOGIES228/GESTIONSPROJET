import { Dialect } from 'sequelize';
require('dotenv').config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

const development: DBConfig = {
  username: process.env.DEV_DB_USERNAME || "postgres",
  password: process.env.DEV_DB_PASSWORD || "root",
  database: process.env.DEV_DB_DATABASE || "bg_auth_service_db",
  host: process.env.DEV_DB_HOST || 'host.docker.internal',
  port: parseInt(process.env.DEV_DB_PORT || '5432'),
  dialect: 'postgres',
};

const test: DBConfig = {
  username: process.env.TEST_DB_USERNAME || "postgres",
  password: process.env.TEST_DB_PASSWORD || "root",
  database: process.env.TEST_DB_DATABASE || "bg_auth_service_db_test",
  host: process.env.TEST_DB_HOST || 'host.docker.internal',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  dialect: 'postgres',
};

const production: DBConfig = {
  username: process.env.PROD_DB_USERNAME || "postgres",
  password: process.env.PROD_DB_PASSWORD || "root",
  database: process.env.PROD_DB_DATABASE || "bg_auth_service_db",
  host: process.env.PROD_DB_HOST || 'localhost',
  port: parseInt(process.env.PROD_DB_PORT || '5432'),
  dialect: 'postgres',
};

export {
  development,
  test,
  production
};