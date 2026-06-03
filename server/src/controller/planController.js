import dotenv from "dotenv";
import models from "../config/db.js";
const { plans } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const CreatePlans = async (req, res) => {
  try {
    const {
      id,
      name,
      price,
      speed,
      data_limit,
      description,
      status = "active",
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------
    if (!name || !price || !speed || !data_limit) {
      return res.status(400).json({
        success: false,
        message: "Name, Price, Speed, and Data Limit are required",
      });
    }

    // -----------------------------
    // Check if plan with same name exists
    // -----------------------------
    const existingPlan = await plans.findOne({ where: { name } });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "Plan with this name already exists",
      });
    }

    // -----------------------------
    // Create Plan
    // -----------------------------
    const newPlan = await plans.create({
      name,
      price,
      speed,
      data_limit,
      description: description || null,
      status,
    });
   
    const createdplans = await plans.findOne({
      where: { name },
    });
    console.log("Plan created successfully:", createdplans.id);

    // -----------------------------
    // Response
    // -----------------------------
    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Create Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const GetPlans = async (req, res) => {
  try {
    // Fetch all plans
    const allPlans = await plans.findAll({
      attributes: [
        "id",
        "name",
        "price",
        "speed",
        "data_limit",
        "description",
        "status",

        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    // Return response
    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      plans: allPlans,
    });
  } catch (error) {
    console.error("Get Plans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const EditPlans = async (req, res) => {
  try {
    const { id } = req.params; // URL me plan id aayega, eg: /api/plans/:id
    const { name, price, speed, data_limit, description, status } = req.body;

    // -----------------------------
    // Validation: ID required
    // -----------------------------
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // -----------------------------
    // Find plan by ID
    // -----------------------------
    const plan = await plans.findByPk(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // -----------------------------
    // Update plan fields
    // -----------------------------
    await plan.update({
      name: name || plan.name,
      price: price || plan.price,
      speed: speed || plan.speed,
      data_limit: data_limit || plan.data_limit,
      description: description ?? plan.description,
      status: status || plan.status,
    });

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Edit Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const DeletePlans = async (req, res) => {
  try {
    const { id } = req.params; 

    // -----------------------------
    // Validation
    // -----------------------------
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // -----------------------------
    // Find plan
    // -----------------------------
    const plan = await plans.findByPk(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // -----------------------------
    // Delete plan permanently
    // -----------------------------
    await plan.destroy();

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
