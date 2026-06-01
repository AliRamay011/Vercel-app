import React, { useState, useEffect } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Download,
  Filter,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  PieChart,
  BarChart3,
} from "lucide-react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsContent = () => {
  const [dateRange, setDateRange] = useState("last30");
  const [reportType, setReportType] = useState("overview");
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Format PKR amount with commas
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes, plansRes] = await Promise.all([
        axios.get(`${BASEURL}/api/v1/get/invoice`),
        axios.get(`${BASEURL}/api/v1/get/user`),
        axios.get(`${BASEURL}/api/v1/get/plans`)
      ]);

      if (invoicesRes.data.success) setInvoices(invoicesRes.data.invoices);
      if (customersRes.data.success) setCustomers(customersRes.data.users);
      if (plansRes.data.success) setPlans(plansRes.data.plans);

    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats from real data
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

  const totalCustomers = customers.length;
  const activeSubscriptions = customers.filter(c => c.status === 'active').length;
  
  const averageRevenue = invoices.filter(inv => inv.status === 'paid').length > 0 
    ? totalRevenue / invoices.filter(inv => inv.status === 'paid').length 
    : 0;

  // Generate revenue data for last 12 months
  const generateRevenueData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthRevenue = invoices
        .filter(inv => {
          const invDate = new Date(inv.issue_date);
          return inv.status === 'paid' && 
                 invDate.getMonth() === date.getMonth() && 
                 invDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
      
      months.push(monthRevenue);
    }
    
    return months;
  };

  // Calculate plan distribution
  const calculatePlanDistribution = () => {
    const distribution = {};
    
    customers.forEach(customer => {
      const customerInvoice = invoices.find(inv => inv.customer_id === customer.id);
      if (customerInvoice) {
        const plan = plans.find(p => p.id === customerInvoice.plan_id);
        const planName = plan ? plan.name : 'Unknown';
        distribution[planName] = (distribution[planName] || 0) + 1;
      }
    });
    
    return distribution;
  };

  // Calculate payment methods distribution
  const calculatePaymentMethods = () => {
    const methods = {};
    
    invoices.forEach(invoice => {
      if (invoice.payment_method) {
        const method = invoice.payment_method.charAt(0).toUpperCase() + 
                      invoice.payment_method.slice(1).replace('_', ' ');
        methods[method] = (methods[method] || 0) + 1;
      }
    });
    
    return methods;
  };

  // Calculate customer growth
  const calculateCustomerGrowth = () => {
    const growth = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      
      const monthlyCustomers = customers.filter(customer => {
        const regDate = new Date(customer.registration_date || customer.created_at);
        return regDate.getMonth() <= date.getMonth() && 
               regDate.getFullYear() <= date.getFullYear();
      }).length;
      
      growth.push(monthlyCustomers);
    }
    
    return growth;
  };

  // Get insights
  const getInsights = () => {
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const currentYearRevenue = paidInvoices
      .filter(inv => new Date(inv.issue_date).getFullYear() === new Date().getFullYear())
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    
    const lastYearRevenue = paidInvoices
      .filter(inv => new Date(inv.issue_date).getFullYear() === new Date().getFullYear() - 1)
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
    
    const revenueGrowth = lastYearRevenue > 0 
      ? ((currentYearRevenue - lastYearRevenue) / lastYearRevenue * 100).toFixed(1)
      : 100;

    const planDistribution = calculatePlanDistribution();
    const popularPlan = Object.keys(planDistribution).reduce((a, b) => 
      planDistribution[a] > planDistribution[b] ? a : b, ''
    );

    // New customers this quarter
    const currentQuarter = Math.floor(new Date().getMonth() / 3);
    const quarterStart = new Date(new Date().getFullYear(), currentQuarter * 3, 1);
    const newCustomers = customers.filter(c => 
      new Date(c.registration_date || c.created_at) >= quarterStart
    ).length;

    return {
      revenueGrowth,
      popularPlan,
      popularPlanCount: planDistribution[popularPlan] || 0,
      newCustomers
    };
  };

  const insights = getInsights();

  // Chart data
  const revenueData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    data: generateRevenueData(),
  };

  const planDistribution = calculatePlanDistribution();
  const paymentMethods = calculatePaymentMethods();
  const customerGrowth = calculateCustomerGrowth();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const lineChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Monthly Revenue (PKR)",
        data: revenueData.data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(planDistribution),
    datasets: [
      {
        data: Object.values(planDistribution),
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
          "rgb(249, 115, 22)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(168, 85, 247)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(paymentMethods),
    datasets: [
      {
        label: "Payment Methods",
        data: Object.values(paymentMethods),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const customerGrowthData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Customer Growth",
        data: customerGrowth,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const exportReport = () => {
    // Simulate report export
    const reportData = {
      totalRevenue: `Rs. ${formatPKR(totalRevenue)}`,
      totalCustomers,
      activeSubscriptions,
      averageRevenue: `Rs. ${formatPKR(averageRevenue)}`,
      revenueGrowth: `${insights.revenueGrowth}%`,
      popularPlan: insights.popularPlan,
      newCustomers: insights.newCustomers
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Report exported successfully!");
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive business insights and analytics
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="overview">Overview</option>
                <option value="revenue">Revenue</option>
                <option value="customers">Customers</option>
                <option value="subscriptions">Subscriptions</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 3 Months</option>
                <option value="last365">Last Year</option>
              </select>
            </div>

            <button
              onClick={exportReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center font-medium"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {formatPKR(totalRevenue)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
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
                  {totalCustomers}
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
                  {activeSubscriptions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Active Subscriptions
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs. {formatPKR(averageRevenue)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Avg. Revenue per Invoice
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue Trend (PKR)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Last 12 months</span>
            </div>
          </div>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Plan Distribution
            </h3>
            <div className="text-sm text-gray-600">
              {totalCustomers} total customers
            </div>
          </div>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Payment Methods
            </h3>
            <div className="text-sm text-gray-600">Usage distribution</div>
          </div>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Customer Growth
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Last 12 months</span>
            </div>
          </div>
          <div className="h-80">
            <Line data={customerGrowthData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-semibold text-blue-900">
                Revenue Growth
              </span>
            </div>
            <p className="text-sm text-blue-700">
              +{insights.revenueGrowth}% compared to last year
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-900">
                Customer Acquisition
              </span>
            </div>
            <p className="text-sm text-green-700">
              +{insights.newCustomers} new customers this quarter
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-semibold text-purple-900">
                Popular Plan
              </span>
            </div>
            <p className="text-sm text-purple-700">
              {insights.popularPlan} is most popular ({insights.popularPlanCount} customers)
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium">
            Print Report
          </button>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;