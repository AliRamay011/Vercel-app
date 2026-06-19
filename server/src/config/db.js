import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import initModels from "../models/initModels.js";
// dotenv.config({
//   path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
// });
dotenv.config();

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

// Database connection check
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");

    // Sync models (optional - for testing)
    await sequelize.sync({ force: false });
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    console.error("Full error:", error);
  }
}

// Run the connection test
testConnection();

const models = initModels(sequelize);

export { sequelize };
export default models;
