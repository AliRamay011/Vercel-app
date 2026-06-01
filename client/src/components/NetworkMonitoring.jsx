import React, { useState, useEffect } from "react";
import {
  Activity,
  Wifi,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Download,
  Upload,
  Server,
  MapPin,
  RefreshCw,
  Eye,
  BarChart3,
  Signal,
  Battery,
  Zap,
} from "lucide-react";

const NetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState({});
  const [customers, setCustomers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [speedTests, setSpeedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Dummy Data
  const dummyNetworkStats = {
    total_bandwidth: "2 Gbps",
    current_usage: "1.2 Gbps",
    usage_percentage: 60,
    active_customers: 187,
    offline_customers: 3,
    network_health: "Excellent",
    packet_loss: "0.1%",
    average_latency: "18 ms",
    uptime: "99.9%"
  };

  const dummyCustomers = [
    {
      id: 1,
      name: "Ali Ahmed",
      plan: "50 Mbps Unlimited",
      current_speed: "48.2 Mbps",
      speed_percentage: 96,
      status: "online",
      data_usage: "45.2 GB",
      usage_percentage: 68,
      last_seen: "2 mins ago",
      ip_address: "192.168.1.101"
    },
    {
      id: 2,
      name: "Sara Khan",
      plan: "100 Mbps Premium",
      current_speed: "95.8 Mbps",
      speed_percentage: 96,
      status: "online",
      data_usage: "128.7 GB",
      usage_percentage: 86,
      last_seen: "5 mins ago",
      ip_address: "192.168.1.102"
    },
    {
      id: 3,
      name: "John Doe",
      plan: "25 Mbps Basic",
      current_speed: "12.5 Mbps",
      speed_percentage: 50,
      status: "slow",
      data_usage: "15.3 GB",
      usage_percentage: 45,
      last_seen: "10 mins ago",
      ip_address: "192.168.1.103"
    },
    {
      id: 4,
      name: "Maria Garcia",
      plan: "50 Mbps Unlimited",
      current_speed: "0 Mbps",
      speed_percentage: 0,
      status: "offline",
      data_usage: "28.9 GB",
      usage_percentage: 32,
      last_seen: "45 mins ago",
      ip_address: "192.168.1.104"
    },
    {
      id: 5,
      name: "David Smith",
      plan: "100 Mbps Premium",
      current_speed: "98.1 Mbps",
      speed_percentage: 98,
      status: "online",
      data_usage: "89.5 GB",
      usage_percentage: 72,
      last_seen: "1 min ago",
      ip_address: "192.168.1.105"
    }
  ];

  const dummyAlerts = [
    {
      id: 1,
      type: "high_usage",
      message: "Network usage reached 85% during peak hours",
      severity: "warning",
      time: "2 hours ago",
      resolved: false
    },
    {
      id: 2,
      type: "customer_offline",
      message: "Customer Maria Garcia offline for 45 minutes",
      severity: "critical",
      time: "45 minutes ago",
      resolved: false
    },
    {
      id: 3,
      type: "slow_speed",
      message: "Customer John Doe experiencing 50% reduced speed",
      severity: "warning",
      time: "30 minutes ago",
      resolved: false
    },
    {
      id: 4,
      type: "maintenance",
      message: "Scheduled maintenance completed successfully",
      severity: "info",
      time: "5 hours ago",
      resolved: true
    }
  ];

  const dummySpeedTests = [
    {
      id: 1,
      customer: "Ali Ahmed",
      download_speed: "48.5 Mbps",
      upload_speed: "23.2 Mbps",
      ping: "15 ms",
      jitter: "2 ms",
      test_time: "2025-11-18 14:30",
      quality: "Excellent"
    },
    {
      id: 2,
      customer: "Sara Khan",
      download_speed: "95.8 Mbps",
      upload_speed: "47.1 Mbps",
      ping: "12 ms",
      jitter: "1 ms",
      test_time: "2025-11-18 14:25",
      quality: "Excellent"
    },
    {
      id: 3,
      customer: "John Doe",
      download_speed: "12.5 Mbps",
      upload_speed: "5.8 Mbps",
      ping: "45 ms",
      jitter: "8 ms",
      test_time: "2025-11-18 14:20",
      quality: "Poor"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNetworkStats(dummyNetworkStats);
      setCustomers(dummyCustomers);
      setAlerts(dummyAlerts);
      setSpeedTests(dummySpeedTests);
      setLoading(false);
    }, 1000);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "offline": return "bg-red-100 text-red-800";
      case "slow": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online": return <CheckCircle className="h-4 w-4" />;
      case "offline": return <XCircle className="h-4 w-4" />;
      case "slow": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Network Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time network performance and customer status</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bandwidth */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{networkStats.total_bandwidth}</p>
              <p className="text-sm text-gray-600 mt-1">Total Bandwidth</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Wifi className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Current Usage</span>
              <span>{networkStats.usage_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${networkStats.usage_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{networkStats.active_customers}</p>
              <p className="text-sm text-gray-600 mt-1">Active Customers</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-red-600">
              {networkStats.offline_customers} offline
            </span>
          </div>
        </div>

        {/* Network Health */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{networkStats.network_health}</p>
              <p className="text-sm text-gray-600 mt-1">Network Health</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Uptime: {networkStats.uptime}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{networkStats.average_latency}</p>
              <p className="text-sm text-gray-600 mt-1">Avg Latency</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Packet Loss: {networkStats.packet_loss}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Network Alerts
              </h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3 border rounded-lg ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm opacity-75 mt-1">{alert.time}</p>
                        </div>
                        {alert.resolved && (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Speed Tests */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Recent Speed Tests
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Download</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Upload</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Ping</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {speedTests.map(test => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{test.customer}</div>
                        <div className="text-sm text-gray-500">{test.test_time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">{test.download_speed}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">{test.upload_speed}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{test.ping}</div>
                        <div className="text-sm text-gray-500">Jitter: {test.jitter}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(test.quality)}`}>
                          {test.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Status Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Signal className="h-5 w-5 text-green-600" />
            Customer Status Monitor
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Plan</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Current Speed</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Data Usage</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.ip_address}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{customer.plan}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${customer.speed_percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{customer.current_speed}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {customer.speed_percentage}% of plan
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{customer.data_usage}</div>
                    <div className="text-sm text-gray-500">
                      {customer.usage_percentage}% used
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusIcon(customer.status)}
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">{customer.last_seen}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitoring;