import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Printer,
  X,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  Download,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const InvoicesContent = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [modalType, setModalType] = useState(null);
  const [currentInvoice, setCurrentInvoice] = useState({
    customer_id: "",
    plan_id: "",
    amount: "",
    tax_amount: "0",
    total_amount: "",
    issue_date: "",
    due_date: "",
    status: "pending",
    payment_method: "cash",
  });
  const [loading, setLoading] = useState(false);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Format PKR amount with commas
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Download PDF function - Direct PKR (no conversion needed)
  const downloadInvoicePDF = async (invoice = null) => {
    try {
      const targetInvoice = invoice || currentInvoice;

      if (!targetInvoice) {
        toast.error("No invoice data found.");
        return;
      }

      // Create PDF
      const pdf = new jsPDF();

      // Colors
      const primaryColor = [59, 130, 246]; // Blue
      const secondaryColor = [139, 92, 246]; // Purple
      const darkColor = [30, 41, 59]; // Dark
      const grayColor = [100, 116, 139]; // Gray
      const successColor = [34, 197, 94]; // Green
      const dangerColor = [239, 68, 68]; // Red

      // Helper functions
      const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
      };

      const getStatusColor = (status) => {
        return status === "paid"
          ? successColor
          : status === "overdue"
          ? dangerColor
          : [234, 179, 8]; // Yellow for pending
      };

      // Header with background
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, 210, 60, "F");

      // Header content
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("INVOICE", 105, 25, { align: "center" });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Professional Internet Services", 105, 35, { align: "center" });

      pdf.setFontSize(10);
      pdf.text(`Invoice #: ${targetInvoice.invoice_number || "N/A"}`, 105, 45, {
        align: "center",
      });

      pdf.setFontSize(8);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 52, {
        align: "center",
      });

      // Company Info Box
      pdf.setFillColor(255, 255, 255);
      pdf.rect(15, 70, 85, 35, "F");
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(15, 70, 85, 35);

      pdf.setTextColor(...darkColor);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("FROM:", 20, 78);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text("Your Company Name", 20, 85);
      pdf.text("123 Business Street", 20, 91);
      pdf.text("City, State 12345", 20, 97);
      pdf.text("Pakistan", 20, 103);

      // Customer Info Box
      pdf.setFillColor(255, 255, 255);
      pdf.rect(110, 70, 85, 35, "F");
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(110, 70, 85, 35);

      pdf.setFont("helvetica", "bold");
      pdf.text("BILL TO:", 115, 78);

      pdf.setFont("helvetica", "normal");
      pdf.text(
        getCustomerName(targetInvoice.customer_id) || "Unknown Customer",
        115,
        85
      );
      pdf.text(getPlanName(targetInvoice.plan_id) || "Unknown Plan", 115, 91);
      pdf.text("Customer", 115, 97);

      // Status Badge
      const status = targetInvoice.status || "pending";
      pdf.setFillColor(...getStatusColor(status));
      pdf.rect(160, 75, 30, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.text(status.toUpperCase(), 175, 80, { align: "center" });

      // Invoice Details Table
      let yPos = 115;

      // Table Header
      pdf.setFillColor(...primaryColor);
      pdf.rect(15, yPos, 180, 10, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Description", 20, yPos + 7);
      pdf.text("Amount", 170, yPos + 7, { align: "right" });

      yPos += 10;

      // Table Rows
      const amount = parseFloat(targetInvoice.amount || 0);
      const taxAmount = parseFloat(targetInvoice.tax_amount || 0);
      const totalAmount = parseFloat(
        targetInvoice.total_amount || amount + taxAmount
      );

      const rows = [
        ["Monthly Internet Plan", `Rs. ${formatCurrency(amount)}`],
        ["Tax Amount", `Rs. ${formatCurrency(taxAmount)}`],
        ["Service Charges", "Rs. 0.00"],
      ];

      rows.forEach((row, index) => {
        if (index % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(15, yPos, 180, 8, "F");
        }

        pdf.setTextColor(...darkColor);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(row[0], 20, yPos + 6);
        pdf.text(row[1], 170, yPos + 6, { align: "right" });

        yPos += 8;
      });

      // Total Amount
      yPos += 5;
      pdf.setFillColor(...secondaryColor);
      pdf.rect(15, yPos, 180, 12, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL AMOUNT", 25, yPos + 8);
      pdf.text(`Rs. ${formatCurrency(totalAmount)}`, 170, yPos + 8, {
        align: "right",
      });

      // Payment Information
      yPos += 20;
      pdf.setTextColor(...darkColor);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("PAYMENT INFORMATION", 20, yPos);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...grayColor);

      const issueDate = targetInvoice.issue_date
        ? new Date(targetInvoice.issue_date)
        : new Date();
      const dueDate = targetInvoice.due_date
        ? new Date(targetInvoice.due_date)
        : new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      pdf.text(`Issue Date: ${issueDate.toLocaleDateString()}`, 20, yPos + 8);
      pdf.text(`Due Date: ${dueDate.toLocaleDateString()}`, 20, yPos + 16);
      pdf.text(
        `Payment Method: ${(
          targetInvoice.payment_method || "cash"
        ).toUpperCase()}`,
        20,
        yPos + 24
      );

      // Footer
      const footerY = 270;
      pdf.setFillColor(...darkColor);
      pdf.rect(0, footerY, 210, 20, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.text("Thank you for choosing our services!", 105, footerY + 8, {
        align: "center",
      });
      pdf.text(
        "Contact: +92 300 1234567 | Email: support@company.com",
        105,
        footerY + 14,
        { align: "center" }
      );

      // Save PDF
      pdf.save(`invoice-${targetInvoice.invoice_number || "unknown"}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("Failed to download PDF");
    }
  };

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/api/v1/get/invoice`);
      if (response.data.success) {
        setInvoices(response.data.invoices);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers and plans for dropdowns
  const fetchCustomersAndPlans = async () => {
    try {
      const [customersRes, plansRes] = await Promise.all([
        axios.get(`${BASEURL}/api/v1/get/user`),
        axios.get(`${BASEURL}/api/v1/get/plans`),
      ]);

      if (customersRes.data.success) {
        setCustomers(customersRes.data.users);
      }
      if (plansRes.data.success) {
        setPlans(plansRes.data.plans);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomersAndPlans();
  }, []);

  const HandleUpdate = async () => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/update/invoice/${currentInvoice.id}`,
        {
          customer_id: currentInvoice.customer_id,
          plan_id: currentInvoice.plan_id,
          amount: Number(currentInvoice.amount),
          tax_amount: Number(currentInvoice.tax_amount || 0),
          total_amount:
            Number(currentInvoice.amount) +
            Number(currentInvoice.tax_amount || 0),
          issue_date: currentInvoice.issue_date,
          due_date: currentInvoice.due_date,
          status: currentInvoice.status,
          payment_method: currentInvoice.payment_method,
        }
      );

      if (response.data.success) {
        setInvoices(
          invoices.map((i) =>
            i.id === currentInvoice.id ? response.data.invoice : i
          )
        );

        setCurrentInvoice({
          customer_id: "",
          plan_id: "",
          amount: "",
          tax_amount: "0",
          total_amount: "",
          issue_date: "",
          due_date: "",
          status: "pending",
          payment_method: "cash",
        });
        setModalType(null);

        toast.success("Payment updated successfully!");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error(error.response?.data?.message || "Failed to update invoice");
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/v1/delete/invoice/${invoiceId}`
      );

      if (response.data.success) {
        setInvoices(invoices.filter((i) => i.id !== invoiceId));
        toast.success("Invoice deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    }
  };

  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.plan?.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.status?.toLowerCase().includes(search.toLowerCase()) ||
      i.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === "paid") return "bg-green-100 text-green-800";
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "overdue") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      cash: "bg-blue-100 text-blue-800",
      credit_card: "bg-purple-100 text-purple-800",
      bank_transfer: "bg-green-100 text-green-800",
      easypaisa: "bg-orange-100 text-orange-800",
      jazzcash: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  // Get plan name by ID
  const getPlanName = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  // Get plan price by ID
  const getPlanPrice = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.price : "0";
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">Manage your invoices</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter((i) => i.status === "paid").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="h-5 w-5 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter((i) => i.status === "pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoices.filter((i) => i.status === "overdue").length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <div className="h-5 w-5 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-24">
                  Invoice #
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-40">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-32">
                  Plan
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-28">
                  Amount (PKR)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-24">
                  Tax (PKR)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-28">
                  Total (PKR)
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-24">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-32">
                  Due Date
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-48">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="truncate">
                          {getCustomerName(inv.customer_id)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 truncate block">
                        {getPlanName(inv.plan_id)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-sm">
                      Rs. {formatPKR(inv.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      Rs. {formatPKR(inv.tax_amount || 0)}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600 text-sm">
                      Rs. {formatPKR(inv.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>
                          {new Date(inv.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={() => {
                              setCurrentInvoice(inv);
                              setModalType("view");
                            }}
                            title="View Invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadInvoicePDF(inv)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={() => handleDeleteInvoice(inv.id)}
                            title="Delete Invoice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 text-white rounded bg-green-600 hover:bg-green-700 transition-colors text-xs font-medium"
                          onClick={() => {
                            setCurrentInvoice({ ...inv });
                            setModalType("edit");
                          }}
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Process Payment</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No invoices found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {modalType === "view"
                  ? `Invoice ${currentInvoice.invoice_number}`
                  : `Payment Method`}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {modalType === "view" ? (
                <div id="invoice-content" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Invoice Number
                      </label>
                      <p className="font-medium">
                        {currentInvoice.invoice_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Customer</label>
                      <p className="font-medium">
                        {getCustomerName(currentInvoice.customer_id)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Plan</label>
                      <p className="font-medium">
                        {getPlanName(currentInvoice.plan_id)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Payment Method
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
                          currentInvoice.payment_method
                        )}`}
                      >
                        {currentInvoice.payment_method}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          currentInvoice.status
                        )}`}
                      >
                        {currentInvoice.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Issue Date
                      </label>
                      <p className="font-medium">
                        {new Date(
                          currentInvoice.issue_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount (PKR):</span>
                        <span className="font-semibold">
                          Rs. {formatPKR(currentInvoice.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax Amount (PKR):</span>
                        <span className="text-gray-600">
                          Rs. {formatPKR(currentInvoice.tax_amount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">
                          Total Amount (PKR):
                        </span>
                        <span className="font-bold text-blue-600">
                          Rs. {formatPKR(currentInvoice.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Due Date</label>
                    <p className="font-medium text-red-600">
                      {new Date(currentInvoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      <p className="text-gray-700">
                        {getCustomerName(currentInvoice.customer_id)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentInvoice.plan_id}
                      onChange={(e) =>
                        setCurrentInvoice({
                          ...currentInvoice,
                          plan_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - Rs. {formatPKR(plan.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (PKR) *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentInvoice.amount}
                        onChange={(e) =>
                          setCurrentInvoice({
                            ...currentInvoice,
                            amount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Amount (PKR)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentInvoice.tax_amount}
                        onChange={(e) =>
                          setCurrentInvoice({
                            ...currentInvoice,
                            tax_amount: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentInvoice.payment_method}
                      onChange={(e) =>
                        setCurrentInvoice({
                          ...currentInvoice,
                          payment_method: e.target.value,
                        })
                      }
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="easypaisa">Easypaisa</option>
                      <option value="jazzcash">JazzCash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentInvoice.status}
                      onChange={(e) =>
                        setCurrentInvoice({
                          ...currentInvoice,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentInvoice.issue_date}
                        onChange={(e) =>
                          setCurrentInvoice({
                            ...currentInvoice,
                            issue_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentInvoice.due_date}
                        onChange={(e) =>
                          setCurrentInvoice({
                            ...currentInvoice,
                            due_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              {modalType === "view" ? (
                <>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={HandleUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    Confirm Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesContent;
