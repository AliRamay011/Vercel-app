// server/src/models/coverageAreas.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CoverageAreas = sequelize.define(
    "coverage_areas",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM("fiber", "copper", "wireless", "hybrid"),
        allowNull: false,
        defaultValue: "fiber",
      },
      status: {
        type: DataTypes.ENUM("active", "maintenance", "planning", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
      coordinates: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      radius: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_customers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      installed_capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      available_capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      coverage_radius: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "coverage_areas",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  CoverageAreas.associate = function (models) {
    CoverageAreas.hasMany(models.customers, {
      foreignKey: "coverage_area_id",
      as: "customers",
    });
  };

  return CoverageAreas;
};