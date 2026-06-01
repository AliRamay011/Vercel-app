"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      issue_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('paid', 'pending', 'overdue', 'cancelled'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'credit_card', 'bank_transfer', 'easypaisa', 'jazzcash'),
        defaultValue: 'cash'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('invoices', ['invoice_number']);
    await queryInterface.addIndex('invoices', ['customer_id']);
    await queryInterface.addIndex('invoices', ['plan_id']);
    await queryInterface.addIndex('invoices', ['status']);
    await queryInterface.addIndex('invoices', ['due_date']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invoices');
  }
};