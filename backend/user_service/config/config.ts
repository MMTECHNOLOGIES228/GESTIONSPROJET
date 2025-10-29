import { Dialect } from 'sequelize';

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

const development: DBConfig = {
  username: "postgres",
  password: "root",
  database: "published_users",
  host: 'host.docker.internal',
  dialect: 'postgres',
};

const test: DBConfig = {
  username: "postgres",
  password: "root",
  database: "published_users",
  host: 'host.docker.internal',
  dialect: 'postgres',
};

const production: DBConfig = {
  username: "postgres",
  password: "root",
  database: "published_users",
  host: 'localhost',
  dialect: 'postgres',
};

export { development, test, production };
