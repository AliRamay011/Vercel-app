'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coverage_areas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('fiber', 'copper', 'wireless', 'hybrid'),
        allowNull: false,
        defaultValue: 'fiber'
      },
      status: {
        type: Sequelize.ENUM('active', 'maintenance', 'planning', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      coordinates: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      radius: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total_customers: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      installed_capacity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      available_capacity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      coverage_radius: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      last_updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('coverage_areas', ['name']);
    await queryInterface.addIndex('coverage_areas', ['type']);
    await queryInterface.addIndex('coverage_areas', ['status']);
    await queryInterface.addIndex('coverage_areas', ['last_updated']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coverage_areas');
  }
};