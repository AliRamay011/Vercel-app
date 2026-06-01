// server/src/models/customers.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Customers = sequelize.define(
    "customers",
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
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      area: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "plans",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      registration_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "customers",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Associations
  Customers.associate = function (models) {
    Customers.belongsTo(models.plans, {
      foreignKey: "plan_id",
      as: "plan",
    });

    Customers.hasMany(models.invoices, {
      foreignKey: "customer_id",
      as: "invoices",
    });
  };

  return Customers;
};
