import dotenv from "dotenv";
import models from "../config/db.js";
const { Staff } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const createStaff = async (req, res) => {
  try {
    const { name, email, phone, address, role, salary, joining_date, status } =
      req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required fields",
      });
    }

    // Check if email already exists
    const existingStaff = await Staff.findOne({ where: { email } });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Staff member with this email already exists",
      });
    }

    // Create staff
    const newStaff = await Staff.create({
      name,
      email,
      phone,
      address: address || "",
      role: role || "operator",
      salary: salary ? parseFloat(salary) : null,
      joining_date: joining_date || new Date(),
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "Staff member added successfully",
      staff: newStaff,
    });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding staff member",
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      order: [["joining_date", "DESC"]],
    });

    res.json({
      success: true,
      staff: staff,
      count: staff.length,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching staff",
    });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role, salary, joining_date, status } =
      req.body;

    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    // Update staff
    await staff.update({
      name: name || staff.name,
      email: email || staff.email,
      phone: phone || staff.phone,
      address: address !== undefined ? address : staff.address,
      role: role || staff.role,
      salary: salary ? parseFloat(salary) : staff.salary,
      joining_date: joining_date || staff.joining_date,
      status: status || staff.status,
    });

    res.json({
      success: true,
      message: "Staff member updated successfully",
      staff: staff,
    });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating staff member",
    });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    await staff.destroy();

    res.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting staff member",
    });
  }
};
