import dotenv from "dotenv";
import models from "../config/db.js";
import cron from "node-cron";
const { invoices, plans } = models;

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

export const GetAllInvoices = async (req, res) => {
  try {
    const allInvoices = await invoices.findAll({
      attributes: [
        "id",
        "invoice_number",
        "amount",
        "tax_amount",
        "total_amount",
        "status",
        "payment_method",
        "issue_date",
        "due_date",
        "created_at",
        "customer_id",
        "plan_id",
      ],
      order: [["created_at", "DESC"]],
    });

    console.log(`Found ${allInvoices.length} invoices`);

    return res.status(200).json({
      success: true,
      message: "All invoices fetched successfully",
      count: allInvoices.length,
      invoices: allInvoices,
    });
  } catch (error) {
    console.error("Get All Invoices Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running automated invoice cron job...");

  try {
    // Daily at midnight check overdue
    const today = new Date();
    const pendingInvoices = await invoices.findAll({
      where: { status: "pending" },
    });

    let overdueCount = 0;
    for (let inv of pendingInvoices) {
      if (new Date(inv.due_date) < today) {
        inv.status = "overdue";
        await inv.save();
        overdueCount++;
      }
    }

    // Generate next month invoices for paid users
    const paidInvoices = await invoices.findAll({ where: { status: "paid" } });
    let newInvoicesCount = 0;

    for (let inv of paidInvoices) {
      const nextIssueDate = new Date(inv.issue_date);
      nextIssueDate.setMonth(nextIssueDate.getMonth() + 1);

      const plan = await plans.findByPk(inv.plan_id);

      await invoices.create({
        invoice_number: `INV-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}`,
        customer_id: inv.customer_id,
        plan_id: inv.plan_id,
        amount: plan.price,
        tax_amount: 0,
        total_amount: plan.price,
        issue_date: nextIssueDate,
        due_date: new Date(
          nextIssueDate.getFullYear(),
          nextIssueDate.getMonth(),
          nextIssueDate.getDate()
        ),
        status: "pending",
        payment_method: "cash",
      });
      newInvoicesCount++;
    }

    console.log(
      `✅ Cron completed: ${overdueCount} overdue marked, ${newInvoicesCount} new invoices generated`
    );
  } catch (error) {
    console.error("❌ Cron job error:", error);
  }
});

// invoiceController.js mein
export const UpdateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      plan_id,
      amount,
      tax_amount,
      total_amount,
      issue_date,
      due_date,
      status,
      payment_method,
    } = req.body;

    const invoice = await invoices.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const updatedInvoice = await invoice.update({
      customer_id,
      plan_id,
      amount,
      tax_amount,
      total_amount,
      issue_date,
      due_date,
      status,
      payment_method,
    });

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const DeleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the invoice
    const invoice = await invoices.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Delete the invoice
    await invoice.destroy();

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      deletedInvoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
      },
    });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
