// server/src/models/invoices.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Invoices = sequelize.define(
    "invoices",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers",
          key: "id",
        },
      },
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("paid", "pending", "overdue", "cancelled"),
        defaultValue: "pending",
      },
      payment_method: {
        type: DataTypes.ENUM(
          "cash",
          "credit_card",
          "bank_transfer",
          "easypaisa",
          "jazzcash"
        ),
        defaultValue: "cash",
      },
    },
    {
      tableName: "invoices",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: false, // updated_at column nahi hai table mein
    }
  );

  // Associations
  Invoices.associate = function (models) {
    Invoices.belongsTo(models.customers, {
      foreignKey: "customer_id",
      as: "customer",
    });

    Invoices.belongsTo(models.plans, {
      foreignKey: "plan_id",
      as: "plan",
    });
  };

  return Invoices;
};
