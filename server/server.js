import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
import express from "express";
import cors from "cors";
import UserAuth from "./src/routes/AllRoutes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", UserAuth);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log("🔍 ENV Check:");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("DB_PASS:", process.env.DB_PASSWORD);
  console.log("user production:", process.env.USE);
});
