import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../config/db.js";
const { admins } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Check admin exists
    const admin = await admins.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Compare password
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Validate JWT secret
    if (!process.env.JWT_KEY) {
      console.error("ERROR: JWT_KEY missing in .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_KEY,
      { expiresIn: "2h", algorithm: "HS256" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const UpdateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { email, password } = req.body;

    // Pehle check karo user exist karta hai ya nahi
    const admin = await admins.findByPk(id);
     console.log(admin);
     
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "admin not found",
      });
    }

    // Agar email change ho raha hai toh check karo duplicate na ho
    if (email && email !== admin.email) {
      const existingEmail = await admins.findOne({
        where: { email },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update data prepare karo
    const updateData = {
      email: email || admin.email,
    };

    // Agar password provide kiya gaya hai toh hash karo
    if (password && password.trim() !== '') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    // User update karo
    await admins.update(updateData, {
      where: { id },
    });

    // Updated user data get karo (password exclude karo)
    const updatedAdmin = await admins.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    console.log(`Admin with ID ${id} updated successfully`);

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Edit Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export const logout = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};
