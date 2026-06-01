import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Staff = sequelize.define(
    "staff",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'operator', 'technician', 'accountant'),
        allowNull: false,
        defaultValue: 'operator',
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
        defaultValue: 'active',
      },
    },
    {
      tableName: "staff",
      timestamps: true,
      underscored: false,
    }
  );

  return Staff;
};