import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Plans = sequelize.define(
    "plans",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      speed: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      data_limit: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      }
    },
    {
      tableName: "plans",
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return Plans;
};