import dotenv from "dotenv";
import models from "../config/db.js";
const { Expense } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});



// Create new expense
export const createExpense = async (req, res) => {
  try {
    const { category, amount, date, description, payment_method, vendor } = req.body;

    // Validation
    if (!category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "Category, amount and date are required fields"
      });
    }

    // Create expense
    const newExpense = await Expense.create({
      category,
      amount: parseFloat(amount),
      date,
      description: description || "",
      payment_method: payment_method || "cash",
      vendor: vendor || ""
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: newExpense
    });

  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating expense"
    });
  }
};

// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      expenses: expenses,
      count: expenses.length
    });

  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expenses"
    });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, date, description, payment_method, vendor } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    // Update expense
    await expense.update({
      category: category || expense.category,
      amount: amount ? parseFloat(amount) : expense.amount,
      date: date || expense.date,
      description: description !== undefined ? description : expense.description,
      payment_method: payment_method || expense.payment_method,
      vendor: vendor !== undefined ? vendor : expense.vendor
    });

    res.json({
      success: true,
      message: "Expense updated successfully",
      expense: expense
    });

  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating expense"
    });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    await expense.destroy();

    res.json({
      success: true,
      message: "Expense deleted successfully"
    });

  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting expense"
    });
  }
};