import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.NODE_ENV === "docker" ? "mysql" : "localhost";
console.log(dbHost)
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});
