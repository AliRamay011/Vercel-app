import express from "express";
import { AdminLogin, logout, UpdateAdmin } from "../controller/adminController.js";
import {
  CreateUser,
  DeleteUserById,
  EditUserById,
  GetAllUsers,
} from "../controller/userController.js";
import {
  DeleteInvoice,
  GetAllInvoices,
  UpdateInvoice,
} from "../controller/InvoiceController.js";
import {
  CreatePlans,
  DeletePlans,
  EditPlans,
  GetPlans,
} from "../controller/planController.js";
import { createExpense, deleteExpense, getAllExpenses, updateExpense } from "../controller/expenseController.js";
import { createStaff, deleteStaff, getAllStaff, updateStaff } from "../controller/staffController.js";
import { createCoverageArea, deleteCoverageArea, getAllCoverageAreas,  updateCoverageArea } from "../controller/coverageAreaController.js";
const router = express.Router();

router.post("/admin/login", AdminLogin);
router.put("/update/admin/:id", UpdateAdmin);
router.post("/admin/logout", logout);
router.post("/create/user", CreateUser);
router.get("/get/user", GetAllUsers);
router.put("/edit/user/:id", EditUserById);
router.delete("/delete/user/:id", DeleteUserById);
router.post("/create/plans", CreatePlans);
router.get("/get/plans", GetPlans);
router.put("/edit/plans/:id", EditPlans);
router.delete("/delete/plans/:id", DeletePlans);
router.get("/get/invoice", GetAllInvoices);
router.put("/update/invoice/:id", UpdateInvoice);
router.delete("/delete/invoice/:id", DeleteInvoice);
router.post("/create/expense", createExpense);
router.get("/get/expenses", getAllExpenses);
router.put("/update/expense/:id", updateExpense);
router.delete("/delete/expense/:id", deleteExpense);
router.post("/create/staff", createStaff);
router.get("/get/staff", getAllStaff);
router.put("/update/staff/:id", updateStaff);
router.delete("/delete/staff/:id", deleteStaff);
router.post('/coverage-areas', createCoverageArea);
router.get('/coverage-areas', getAllCoverageAreas);
router.put('/coverage-areas/:id', updateCoverageArea);
router.delete('/coverage-areas/:id', deleteCoverageArea);





export default router;
