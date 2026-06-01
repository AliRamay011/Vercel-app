import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Zap,
  CreditCard,
  TrendingUp,
  Eye,
  DollarSign,
  Calendar,
} from "lucide-react";
import axios from "axios";

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASEURL = import.meta.env.VITE_BACKEND_URL;
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format PKR amount with commas
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch customers, invoices, and plans
      const [customersRes, invoicesRes, plansRes] = await Promise.all([
        axios.get(`${BASEURL}/api/v1/get/user`),
        axios.get(`${BASEURL}/api/v1/get/invoice`),
        axios.get(`${BASEURL}/api/v1/get/plans`),
      ]);

      const customers = customersRes.data.success
        ? customersRes.data.users
        : [];
      const invoices = invoicesRes.data.success
        ? invoicesRes.data.invoices
        : [];
      const plans = plansRes.data.success ? plansRes.data.plans : [];

      // -------------------------
      // 📌 CUSTOMER & INVOICE DATA
      // -------------------------

      const totalCustomers = customers.length;
      const activeSubscriptions = customers.filter(
        (c) => c.status === "active"
      ).length;
      const pendingPayments = invoices.filter(
        (i) => i.status === "pending"
      ).length;

      // -------------------------
      // 📌 PLAN DATA
      // -------------------------

      const totalPlans = plans.length;
      const activePlans = plans.filter((p) => p.status === "active").length;

      // -------------------------
      // 📌 MONTHLY REVENUE
      // -------------------------

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyRevenue = invoices
        .filter(
          (inv) =>
            inv.status === "paid" &&
            new Date(inv.issue_date).getMonth() === currentMonth &&
            new Date(inv.issue_date).getFullYear() === currentYear
        )
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      // -------------------------
      // 📌 SET MAIN STATS
      // -------------------------

      setStats({
        totalCustomers,
        activeSubscriptions,
        pendingPayments,
        monthlyRevenue,
        totalPlans, // 🔥 added
        activePlans, // 🔥 added
      });

      // -------------------------
      // 📌 Revenue Chart (6 Months)
      // -------------------------

      const revenueData = generateRevenueData(invoices);
      setRevenueData(revenueData);

      // -------------------------
      // 📌 Top Customers
      // -------------------------

      const topCustomersData = getTopCustomers(customers, invoices);
      setTopCustomers(topCustomersData);

      // -------------------------
      // 📌 Recent Payments
      // -------------------------

      const recentPaymentsData = getRecentPayments(invoices, customers);
      setRecentPayments(recentPaymentsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate revenue data for last 6 months
  const generateRevenueData = (invoices) => {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthRevenue = invoices
        .filter((inv) => {
          const invDate = new Date(inv.issue_date);
          return (
            inv.status === "paid" &&
            invDate.getMonth() === date.getMonth() &&
            invDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      months.push({
        month: monthName,
        revenue: monthRevenue,
      });
    }

    return months;
  };

  // Get top 3 customers by total payments
  const getTopCustomers = (customers, invoices) => {
    const customerPayments = customers.map((customer) => {
      const customerInvoices = invoices.filter(
        (inv) => inv.customer_id === customer.id && inv.status === "paid"
      );

      const totalPaid = customerInvoices.reduce(
        (sum, inv) => sum + parseFloat(inv.total_amount),
        0
      );

      // Get customer's plan name
      const currentInvoice = invoices.find(
        (inv) => inv.customer_id === customer.id
      );
      const planName = currentInvoice
        ? getPlanName(currentInvoice.plan_id)
        : "No Plan";

      return {
        id: customer.id,
        name: customer.name,
        plan: planName,
        totalPaid,
      };
    });

    return customerPayments
      .filter((c) => c.totalPaid > 0)
      .sort((a, b) => b.totalPaid - a.totalPaid)
      .slice(0, 3);
  };

  // Get recent payments (last 5 paid invoices)
  const getRecentPayments = (invoices, customers) => {
    return invoices
      .filter((inv) => inv.status === "paid")
      .sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date))
      .slice(0, 5)
      .map((inv) => {
        const customer = customers.find((c) => c.id === inv.customer_id);
        return {
          id: inv.id,
          customerName: customer ? customer.name : "Unknown Customer",
          amount: parseFloat(inv.total_amount),
          status: inv.status,
          date: new Date(inv.issue_date).toISOString().split("T")[0],
          paymentMethod: inv.payment_method,
        };
      });
  };

  // Get plan name by ID (you might need to fetch plans separately)
  const getPlanName = (planId) => {
    // This would need actual plans data
    const planNames = {
      1: "Basic Plan",
      2: "Premium Plan",
      3: "Enterprise Plan",
    };
    return planNames[planId] || "Unknown Plan";
  };

  // Get first letter for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {currentDate}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Customers</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeSubscriptions}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Subscriptions</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingPayments}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending Payments</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {formatPKR(stats.monthlyRevenue)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Monthly Revenue</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Trend (PKR)
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `Rs. ${formatPKR(value)}`}
                />
                <Tooltip
                  formatter={(value) => [`Rs. ${formatPKR(value)}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Top Customers
          </h2>
          <div className="space-y-4">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {getInitial(customer.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-500">{customer.plan}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">
                    Rs. {formatPKR(customer.totalPaid)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No customer data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Payments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">
                  Amount (PKR)
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-semibold">
                            {getInitial(payment.customerName)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {payment.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        Rs. {formatPKR(payment.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{payment.date}</td>
                    <td className="py-4 px-6 text-gray-600 capitalize">
                      {payment.paymentMethod}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No recent payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;