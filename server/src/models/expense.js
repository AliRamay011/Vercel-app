import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Expense = sequelize.define(
    "expense",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "cash",
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "expenses",
      timestamps: true,
      underscored: false,
    }
  );

  return Expense;
};
