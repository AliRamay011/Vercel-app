import React from "react";
import { Search, Bell, Menu, User } from "lucide-react";

function Navbar() {
  return (
    <div className="h-[77px] w-full bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 sticky top-0">
      {/* Left section: Hamburger for mobile */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-1">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-gray-900">Welcome back, Admin</h2>
        </div>
      </div>

      {/* Right section: Search, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 cursor-pointer pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="hidden sm:block">
            <span className="text-gray-800 font-medium text-sm">Admin User</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;