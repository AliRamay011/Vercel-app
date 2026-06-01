import React, { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Download, 
  Filter,
  CreditCard,
  Calendar,
  User,
  CheckCircle,
  DollarSign,
  BarChart3,
  TrendingUp,
  X
} from "lucide-react";
import axios from "axios";

const ReceivedPaymentsContent = () => {
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [viewPayment, setViewPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Format PKR amount with commas
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Fetch paid invoices (received payments)
  const fetchReceivedPayments = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes, plansRes] = await Promise.all([
        axios.get(`${BASEURL}/api/v1/get/invoice`),
        axios.get(`${BASEURL}/api/v1/get/user`),
        axios.get(`${BASEURL}/api/v1/get/plans`)
      ]);

      if (invoicesRes.data.success) {
        // Sirf paid invoices filter karo
        const paidInvoices = invoicesRes.data.invoices.filter(inv => inv.status === 'paid');
        setPayments(paidInvoices);
      }
      if (customersRes.data.success) setCustomers(customersRes.data.users);
      if (plansRes.data.success) setPlans(plansRes.data.plans);

    } catch (error) {
      console.error("Error fetching received payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedPayments();
  }, []);

  // Filter payments based on search and payment method
  const filteredPayments = payments.filter((p) => {
    const customer = customers.find(c => c.id === p.customer_id);
    const customerName = customer ? customer.name.toLowerCase() : '';
    
    const matchesSearch = 
      customerName.includes(search.toLowerCase()) ||
      p.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      p.payment_method.toLowerCase().includes(search.toLowerCase());
    
    const matchesMethod = filterMethod === "All" || p.payment_method === filterMethod.toLowerCase();
    
    return matchesSearch && matchesMethod;
  });

  // Calculate statistics
  const totalReceived = payments.reduce((sum, p) => sum + parseFloat(p.total_amount), 0);
  const totalTransactions = payments.length;
  
  // This month revenue
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.issue_date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + parseFloat(p.total_amount), 0);

  // Get unique payment methods
  const paymentMethods = ["All", ...new Set(payments.map(p => 
    p.payment_method.charAt(0).toUpperCase() + p.payment_method.slice(1).replace('_', ' ')
  ))];

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  // Get plan name by ID
  const getPlanName = (planId) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  const exportToCSV = () => {
    const headers = ["Invoice #", "Customer", "Plan", "Amount (PKR)", "Payment Method", "Date"];
    const csvContent = [
      headers.join(","),
      ...payments.map(p => [
        p.invoice_number,
        getCustomerName(p.customer_id),
        getPlanName(p.plan_id),
        p.total_amount,
        p.payment_method.charAt(0).toUpperCase() + p.payment_method.slice(1),
        p.issue_date
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "received-payments.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      "cash": "bg-blue-100 text-blue-800",
      "credit_card": "bg-purple-100 text-purple-800",
      "bank_transfer": "bg-green-100 text-green-800",
      "easypaisa": "bg-orange-100 text-orange-800",
      "jazzcash": "bg-red-100 text-red-800"
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading received payments...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Received Payments</h1>
            <p className="text-gray-600 mt-1">All successfully processed payments</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 justify-center font-medium"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards - Only for Received Payments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {formatPKR(totalReceived)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Received</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {formatPKR(thisMonthRevenue)}
                </p>
                <p className="text-sm text-gray-600 mt-1">This Month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                <p className="text-sm text-gray-600 mt-1">Successful Transactions</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>All payments are successfully processed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Invoice #</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Plan</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Amount (PKR)</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Payment Method</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium text-blue-600">{payment.invoice_number}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{getCustomerName(payment.customer_id)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{getPlanName(payment.plan_id)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-green-600">Rs. {formatPKR(payment.total_amount)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.payment_method)}`}>
                      {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(payment.issue_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => { setViewPayment(payment); setShowViewModal(true); }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <CreditCard className="h-12 w-12 mb-3 opacity-50" />
                      <p className="text-lg font-medium">No received payments found</p>
                      <p className="text-sm mt-1">All payments will appear here once processed</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Payment Modal */}
      {showViewModal && viewPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Payment Receipt</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Payment Successful</p>
                    <p className="text-sm text-green-700">{viewPayment.invoice_number}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Customer</label>
                      <p className="font-medium">{getCustomerName(viewPayment.customer_id)}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Plan</label>
                      <p className="font-medium">{getPlanName(viewPayment.plan_id)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Amount</label>
                      <p className="font-semibold text-lg text-green-600">Rs. {formatPKR(viewPayment.total_amount)}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(viewPayment.payment_method)}`}>
                        {viewPayment.payment_method.charAt(0).toUpperCase() + viewPayment.payment_method.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Amount:</span>
                      <span className="font-medium">Rs. {formatPKR(viewPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Amount:</span>
                      <span className="font-medium">Rs. {formatPKR(viewPayment.tax_amount || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Paid:</span>
                      <span className="font-bold text-green-600">Rs. {formatPKR(viewPayment.total_amount)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Payment Date</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{new Date(viewPayment.issue_date).toLocaleDateString()}</p>
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
    </div>
  );
};

export default ReceivedPaymentsContent;