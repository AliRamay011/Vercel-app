import dotenv from "dotenv";
import models, { sequelize } from "../config/db.js";
const { CoverageArea } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
// Get all coverage areas
export const getAllCoverageAreas = async (req, res) => {
  try {
    const { search, status, type } = req.query;

    let whereClause = {};

    // Search filter
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Status filter
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // Type filter
    if (type && type !== "all") {
      whereClause.type = type;
    }

    console.log("Where Clause:", whereClause); // Debugging ke liye

    const coverageAreas = await CoverageArea.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    console.log("Found Coverage Areas:", coverageAreas.length); // Debugging ke liye

    // Agar koi data nahi mila toh empty array bhejo
    if (!coverageAreas || coverageAreas.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        total: 0,
        message: "No coverage areas found",
      });
    }

    res.status(200).json({
      success: true,
      data: coverageAreas,
      total: coverageAreas.length,
    });
  } catch (error) {
    console.error("Get Coverage Areas Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new coverage area
export const createCoverageArea = async (req, res) => {
  try {
    // Direct field access
    const name = req.body.name;
    const type = req.body.type;
    const status = req.body.status;
    const coordinates = req.body.coordinates;
    const radius = req.body.radius;
    const address = req.body.address;
    const description = req.body.description;
    const total_customers = req.body.total_customers;
    const installed_capacity = req.body.installed_capacity;
    const available_capacity = req.body.available_capacity;

    console.log("📨 Direct Field Access:", {
      name: req.body.name,
      total_customers: req.body.total_customers,
      installed_capacity: req.body.installed_capacity,
      available_capacity: req.body.available_capacity,
    });

    // Validation
    if (!name || !type || !status || !radius || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, type, status, radius, and address are required fields",
      });
    }

    // Check if area with same name already exists
    const existingArea = await CoverageArea.findOne({ where: { name } });
    if (existingArea) {
      return res.status(400).json({
        success: false,
        message: "Coverage area with this name already exists",
      });
    }

    const coverageArea = await CoverageArea.create({
      name,
      type,
      status,
      coordinates: coordinates || null,
      radius: parseFloat(radius),
      address,
      description: description || null,
      total_customers: parseInt(total_customers) || 0,
      installed_capacity: parseInt(installed_capacity) || 0,
      available_capacity: parseInt(available_capacity) || 0,
      coverage_radius: `${radius} km`,
      last_updated: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Coverage area created successfully",
      data: coverageArea,
    });
  } catch (error) {
    console.error("Create Coverage Area Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Update coverage area
export const updateCoverageArea = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      status,
      coordinates,
      radius,
      address,
      description,
      total_customers, // Correct field name
      installed_capacity, // Correct field name
      available_capacity, // Correct field name
    } = req.body;

    console.log("📨 Update Request Body:", req.body);
    console.log("🔍 Update Parsed Fields:", {
      name,
      type,
      status,
      coordinates,
      radius,
      address,
      description,
      total_customers,
      installed_capacity,
      available_capacity,
    });

    const coverageArea = await CoverageArea.findByPk(id);

    if (!coverageArea) {
      return res.status(404).json({
        success: false,
        message: "Coverage area not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== coverageArea.name) {
      const existingArea = await CoverageArea.findOne({ where: { name } });
      if (existingArea) {
        return res.status(400).json({
          success: false,
          message: "Coverage area with this name already exists",
        });
      }
    }

    const updateData = {
      name: name || coverageArea.name,
      type: type || coverageArea.type,
      status: status || coverageArea.status,
      coordinates:
        coordinates !== undefined ? coordinates : coverageArea.coordinates,
      radius: radius ? parseFloat(radius) : coverageArea.radius,
      address: address || coverageArea.address,
      description:
        description !== undefined ? description : coverageArea.description,
      total_customers:
        total_customers !== undefined
          ? parseInt(total_customers)
          : coverageArea.total_customers,
      installed_capacity:
        installed_capacity !== undefined
          ? parseInt(installed_capacity)
          : coverageArea.installed_capacity,
      available_capacity:
        available_capacity !== undefined
          ? parseInt(available_capacity)
          : coverageArea.available_capacity,
      last_updated: new Date(),
    };

    // Update coverage radius if radius changed
    if (radius) {
      updateData.coverage_radius = `${radius} km`;
    }

    console.log("💾 Updating with data:", updateData);

    await CoverageArea.update(updateData, {
      where: { id },
    });

    const updatedArea = await CoverageArea.findByPk(id);

    console.log("✅ Updated Area:", updatedArea.toJSON());

    res.status(200).json({
      success: true,
      message: "Coverage area updated successfully",
      data: updatedArea,
    });
  } catch (error) {
    console.error("❌ Update Coverage Area Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete coverage area
export const deleteCoverageArea = async (req, res) => {
  try {
    const { id } = req.params;

    const coverageArea = await CoverageArea.findByPk(id);

    if (!coverageArea) {
      return res.status(404).json({
        success: false,
        message: "Coverage area not found",
      });
    }

    await CoverageArea.destroy({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Coverage area deleted successfully",
    });
  } catch (error) {
    console.error("Delete Coverage Area Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
