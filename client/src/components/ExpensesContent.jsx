import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Download,
  Filter,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  Receipt,
  Building,
  Wifi,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ExpensesContent = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    payment_method: "cash",
    vendor: "",
  });
  const [editExpense, setEditExpense] = useState(null);
  const [viewExpense, setViewExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Expense categories specific to ISP business
  const expenseCategories = [
    "Internet Bill",
    "Electricity Bill",
    "Employee Salaries",
    "Office Rent",
    "Equipment Purchase",
    "Maintenance",
    "Marketing",
    "Travel",
    "Software Subscriptions",
    "Other",
  ];

  const paymentMethods = [
    "Cash",
    "Bank Transfer",
    "Credit Card",
    "Easypaisa",
    "JazzCash",
  ];

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/api/v1/get/expenses`);
      if (response.data.success) {
        setExpenses(response.data.expenses);
      } else {
        toast.error("Failed to fetch expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error loading expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    try {
      if (!newExpense.category || !newExpense.amount || !newExpense.date) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = await axios.post(
        `${BASEURL}/api/v1/create/expense`,
        newExpense
      );

      if (response.data.success) {
        setExpenses([...expenses, response.data.expense]);
        setNewExpense({
          category: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          payment_method: "cash",
          vendor: "",
        });
        setShowAddModal(false);
        toast.success("Expense added successfully!");
        fetchExpenses(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense");
    }
  };

  const handleEditExpense = async () => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/update/expense/${editExpense.id}`,
        editExpense
      );

      if (response.data.success) {
        setExpenses(
          expenses.map((e) =>
            e.id === editExpense.id ? response.data.expense : e
          )
        );
        setEditExpense(null);
        setShowEditModal(false);
        toast.success("Expense updated successfully!");
        fetchExpenses(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Error updating expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/v1/delete/expense/${expenseId}`
      );
      if (response.data.success) {
        setExpenses(expenses.filter((e) => e.id !== expenseId));
        toast.success("Expense deleted successfully!");
        fetchExpenses(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense");
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.category.toLowerCase().includes(search.toLowerCase()) ||
      expense.description.toLowerCase().includes(search.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || expense.category === filterCategory;
    const matchesMonth =
      filterMonth === "All" ||
      new Date(expense.date).getMonth() ===
        new Date(filterMonth + "-01").getMonth();

    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Calculate statistics
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  const thisMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const highestCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] =
      (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const topCategory = Object.keys(highestCategory).reduce(
    (a, b) => (highestCategory[a] > highestCategory[b] ? a : b),
    ""
  );

  const getCategoryColor = (category) => {
    const colors = {
      "Internet Bill": "bg-blue-100 text-blue-800",
      "Employee Salaries": "bg-purple-100 text-purple-800",
      "Electricity Bill": "bg-yellow-100 text-yellow-800",
      "Office Rent": "bg-green-100 text-green-800",
      "Equipment Purchase": "bg-orange-100 text-orange-800",
      Maintenance: "bg-red-100 text-red-800",
      Marketing: "bg-indigo-100 text-indigo-800",
      Travel: "bg-pink-100 text-pink-800",
      "Software Subscriptions": "bg-cyan-100 text-cyan-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      Cash: "bg-green-100 text-green-800",
      "Bank Transfer": "bg-blue-100 text-blue-800",
      "Credit Card": "bg-purple-100 text-purple-800",
      Easypaisa: "bg-orange-100 text-orange-800",
      JazzCash: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Category",
      "Amount",
      "Date",
      "Description",
      "Payment Method",
      "Vendor",
    ];
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [
          expense.id,
          expense.category,
          expense.amount,
          expense.date,
          expense.description,
          expense.payment_method,
          expense.vendor,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate months for filter
  const months = ["All", "2025-11", "2025-10", "2025-09", "2025-08"];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Manage your business expenses</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center font-medium"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {totalExpenses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Expenses</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {thisMonthExpenses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">This Month</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {expenses.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Records</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Categories</option>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month === "All"
                    ? "All Months"
                    : new Date(month + "-01").toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                </option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Payment Method
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Vendor
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      #{expense.id}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 truncate">
                          {expense.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-red-600">
                        Rs. {parseFloat(expense.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
                          expense.payment_method
                        )}`}
                      >
                        {expense.payment_method}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {expense.vendor}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => {
                            setViewExpense(expense);
                            setShowViewModal(true);
                          }}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          onClick={() => {
                            setEditExpense({ ...expense });
                            setShowEditModal(true);
                          }}
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Receipt className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">No expenses found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Add New Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter expense description"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newExpense.payment_method}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method.toLowerCase()}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    placeholder="Enter vendor name"
                    value={newExpense.vendor}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, vendor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Expense Modal */}
      {showViewModal && viewExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Expense Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Receipt className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Expense #{viewExpense.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {viewExpense.category}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Category
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          viewExpense.category
                        )}`}
                      >
                        {viewExpense.category}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Amount
                      </label>
                      <p className="font-semibold text-lg text-red-600">
                        Rs. {parseFloat(viewExpense.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Payment Method
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
                          viewExpense.payment_method
                        )}`}
                      >
                        {viewExpense.payment_method}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Vendor
                      </label>
                      <p className="font-medium">{viewExpense.vendor}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <p className="font-medium text-gray-900">
                    {viewExpense.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Date
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">
                      {new Date(viewExpense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && editExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Edit Expense</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editExpense.category}
                    onChange={(e) =>
                      setEditExpense({
                        ...editExpense,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={editExpense.amount}
                    onChange={(e) =>
                      setEditExpense({ ...editExpense, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editExpense.date}
                    onChange={(e) =>
                      setEditExpense({ ...editExpense, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editExpense.description}
                    onChange={(e) =>
                      setEditExpense({
                        ...editExpense,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editExpense.payment_method}
                    onChange={(e) =>
                      setEditExpense({
                        ...editExpense,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method.toLowerCase()}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={editExpense.vendor}
                    onChange={(e) =>
                      setEditExpense({ ...editExpense, vendor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                onClick={handleEditExpense}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesContent;
