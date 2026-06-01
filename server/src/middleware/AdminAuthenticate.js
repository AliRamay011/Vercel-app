import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.token; 
  console.log("Admin Token ", token);

  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
