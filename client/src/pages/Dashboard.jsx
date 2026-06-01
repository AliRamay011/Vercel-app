import React, { useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "@/components/Navbar";
import DashboardContent from "../components/Overview";
import CustomersContent from "@/components/CustomersContent";
import InvoicesContent from "@/components/InvoicesContent";
import PaymentsContent from "@/components/PaymentsContent";
import PlansContent from "@/components/PlansContent";
import ReportsContent from "@/components/ReportsContent";
import SettingsContent from "@/components/SettingsContent";
import ExpensesContent from "@/components/ExpensesContent";
import StaffManagement from "@/components/StaffManagement";
import NetworkMonitoring from "@/components/NetworkMonitoring";
import SMSIntegration from "@/components/SMSIntegration";
import CoverageAreas from "@/components/CoverageAreas";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "User Management":
        return <CustomersContent />;
      case "Invoices":
        return <InvoicesContent />;
      case "Received Payments":
        return <PaymentsContent />;
      case "Plans & Packages":
        return <PlansContent />;
      case "Reports & Analytics":
        return <ReportsContent />;
      case "Settings":
        return <SettingsContent />;
      case "Expenses":
        return <ExpensesContent />;
      case "Staff Management":
        return <StaffManagement />;
      case "Network Monitoring":
        return <NetworkMonitoring />;
      case "SMS Integration":
        return <SMSIntegration />;
      case "Areas":
        return <CoverageAreas />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="bg-[#f9fafc] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 h-screen fixed">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
