import React from "react";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Wifi,
  TrendingDown, // Expenses icon
  UserPlus, // Staff Management
  Package, // Packages/Plans
  Bell, // Notifications
  Shield, // Admin/User Management
  Activity, // Network Monitoring
  Send, // SMS Integration
  Mail, // Email Notifications
  Ticket, // Voucher System
  Box, // Inventory Management
  MapPin, // Coverage Areas
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SideBar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "User Management", icon: <Shield className="h-5 w-5" /> },
    { name: "Staff Management", icon: <UserPlus className="h-5 w-5" /> },
    { name: "Plans & Packages", icon: <Package className="h-5 w-5" /> },

    // Billing Section
    { name: "Invoices", icon: <FileText className="h-5 w-5" /> },
    { name: "Received Payments", icon: <CreditCard className="h-5 w-5" /> },

    // New Important Features
    { name: "Network Monitoring", icon: <Activity className="h-5 w-5" /> },
    { name: "SMS Integration", icon: <Send className="h-5 w-5" /> },
    { name: "Areas", icon: <MapPin className="h-5 w-5" /> },

    // Existing Features
    { name: "Expenses", icon: <TrendingDown className="h-5 w-5" /> },
    { name: "Reports & Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${BASEURL}/api/v1/admin/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/");
        toast.success("Logout SuccessFully");
      } else {
        alert("Logout failed: " + data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wifi className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">NetConnect</h1>
            <p className="text-xs text-gray-500">ISP Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center w-full px-3 py-2.5 gap-3 text-left rounded-lg transition-colors ${
                activeTab === item.name
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div
                className={`${
                  activeTab === item.name ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  activeTab === item.name ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="bg-white  p-3 border-t  border-gray-200 space-y-2">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-semibold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@netconnect.com
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 gap-3 text-left rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-100"
        >
          <div className="text-gray-400 hover:text-red-600">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SideBar;
