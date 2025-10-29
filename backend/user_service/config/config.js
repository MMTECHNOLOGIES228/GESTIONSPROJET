"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.test = exports.development = void 0;


var development = {
    username: "postgres",
    password: "root",
    database: "published_users",
    host: 'host.docker.internal',
    port: parseInt('5432'),
    dialect: 'postgres',
};
exports.development = development;

var test = {
    username: "root",
    password: "root",
    database: "published_users",
    host: 'host.docker.internal',
    port: parseInt('5432'),
    dialect: 'postgres',
};
exports.test = test;
var production = {
    username: "root",
    password: "root",
    database: "published_users",
    host: 'localhost',
    port: parseInt('5432'),
    dialect: 'postgres',
};
exports.production = production;
