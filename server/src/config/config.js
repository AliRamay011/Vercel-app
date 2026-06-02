// const dotenv = require('dotenv')
// dotenv.config({
//   path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
// });
import dotenv from "dotenv";
dotenv.config();


module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Detailed logging
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Detailed logging
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }

  }
};
