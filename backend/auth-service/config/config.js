"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.test = exports.development = void 0;

require('dotenv').config();

var development = {
    username: process.env.DEV_DB_USERNAME || "postgres",
    password: process.env.DEV_DB_PASSWORD || "root",
    database: process.env.DEV_DB_DATABASE || "bg_auth_service_db",
    host: process.env.DEV_DB_HOST || 'host.docker.internal',
    port: parseInt(process.env.DEV_DB_PORT || '5432'),
    dialect: 'postgres',
};
exports.development = development;

var test = {
    username: process.env.TEST_DB_USERNAME || "postgres",
    password: process.env.TEST_DB_PASSWORD || "root",
    database: process.env.TEST_DB_DATABASE || "bg_auth_service_db_test",
    host: process.env.TEST_DB_HOST || 'host.docker.internal',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    dialect: 'postgres',
};
exports.test = test;

var production = {
    username: process.env.PROD_DB_USERNAME || "postgres",
    password: process.env.PROD_DB_PASSWORD || "root",
    database: process.env.PROD_DB_DATABASE || "bg_auth_service_db",
    host: process.env.PROD_DB_HOST || 'localhost',
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    dialect: 'postgres',
};
exports.production = production;