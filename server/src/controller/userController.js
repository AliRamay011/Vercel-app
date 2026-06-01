import dotenv from "dotenv";
import models, { sequelize } from "../config/db.js";
const { customers, plans, invoices } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const CreateUser = async (req, res) => {
  try {
    const { name, phone, address, plan_id, registration_date, area } = req.body;

    console.log("Creating user with plan_id:", plan_id); // Debug

    if (!name || !phone || !address || !plan_id || !area) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Check phone
    const existingPhone = await customers.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone already exists",
      });
    }

    // Fetch plan
    const planRecord = await plans.findByPk(plan_id);
    if (!planRecord) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    console.log("Plan found:", planRecord.id, planRecord.name); // Debug

    // Create user
    const newUser = await customers.create({
      name,
      phone,
      address,
      plan_id,
      area,
      registration_date: registration_date || new Date(),
      status: "active",
    });

    console.log("User created:", newUser.id); // Debug

    // Generate invoice using RAW QUERY ONLY
    const invoice_number = `INV-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const issue_date = newUser.registration_date;
    const due_date = new Date(issue_date);
    due_date.setMonth(due_date.getMonth() + 1);

    // USE ONLY RAW QUERY - Sequelize create() use mat karo
    await sequelize.query(
      `INSERT INTO invoices (invoice_number, customer_id, plan_id, amount, tax_amount, total_amount, issue_date, due_date, status, payment_method, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      {
        replacements: [
          invoice_number,
          newUser.id,
          planRecord.id,
          parseFloat(planRecord.price),
          0,
          parseFloat(planRecord.price),
          issue_date,
          due_date,
          "pending",
          "cash",
        ],
      }
    );

    console.log("Invoice created with raw query"); // Debug

    return res.status(201).json({
      success: true,
      message: "User created and first invoice generated",
      user: newUser,
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetAllUsers = async (req, res) => {
  try {
    // Get all users without plan details
    const users = await customers.findAll({
      attributes: [
        "id",
        "name",
        "phone",
        "address",
        "area",
        "plan_id",
        "status",
        "registration_date",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    console.log("Get All Users Successfully");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const DeleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Pehle check karo user exist karta hai ya nahi
    const user = await customers.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User delete karo
    await customers.destroy({
      where: { id },
    });

    console.log(`User with ID ${id} deleted successfully`);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const EditUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, plan_id, status , area } = req.body;

    // Pehle check karo user exist karta hai ya nahi
    const user = await customers.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Agar plan_id change ho raha hai toh check karo plan exist karta hai
    if (plan_id) {
      const planExists = await plans.findByPk(plan_id);
      if (!planExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan_id",
        });
      }
    }

    // Agar phone change ho raha hai toh check karo duplicate na ho
    if (phone && phone !== user.phone) {
      const existingPhone = await customers.findOne({
        where: { phone },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // User update karo - sirf update method call karo
    await customers.update(
      {
        name: name || user.name,
        email: email !== undefined ? email : user.email,
        phone: phone || user.phone,
        address: address || user.address,
        area: area || user.area,
        plan_id: plan_id || user.plan_id,
        status: status || user.status,
      },
      {
        where: { id },
      }
    );

    // Updated user data get karo
    const updatedUser = await customers.findByPk(id);

    console.log(`User with ID ${id} updated successfully`);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
