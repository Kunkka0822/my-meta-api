import { Sequelize } from "sequelize";
import { env } from "../lib/helpers/env";

const dbname = env('DB_DATABASE', 'metav');
const username = env('DB_USERNAME', 'root');
const password = env('DB_PASSWORD', '');
const dbhost = env('DB_HOST', '127.0.0.1');
const dbport = env('DB_PORT', '3306');


export const mysql = new Sequelize(dbname, username, password, {
  host: dbhost,
  port: parseInt(dbport),
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

mysql.authenticate();