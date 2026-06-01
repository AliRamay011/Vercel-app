import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Badge,
  Shield,
  Users,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "operator",
    salary: "",
    joining_date: new Date().toISOString().split('T')[0],
    status: "active"
  });
  const [editStaff, setEditStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Staff roles
  const staffRoles = [
    { value: "admin", label: "Admin", color: "bg-purple-100 text-purple-800" },
    { value: "manager", label: "Manager", color: "bg-blue-100 text-blue-800" },
    { value: "operator", label: "Operator", color: "bg-green-100 text-green-800" },
    { value: "technician", label: "Technician", color: "bg-orange-100 text-orange-800" },
    { value: "accountant", label: "Accountant", color: "bg-red-100 text-red-800" }
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800" },
    { value: "on_leave", label: "On Leave", color: "bg-yellow-100 text-yellow-800" }
  ];

  // Fetch staff from backend
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/api/v1/get/staff`);
      if (response.data.success) {
        setStaff(response.data.staff);
      } else {
        console.log("Failed to fetch staff");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      console.log("Error loading staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    try {
      if (!newStaff.name || !newStaff.email || !newStaff.phone) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = await axios.post(`${BASEURL}/api/v1/create/staff`, newStaff);
      
      if (response.data.success) {
        setStaff([...staff, response.data.staff]);
        setNewStaff({
          name: "",
          email: "",
          phone: "",
          address: "",
          role: "operator",
          salary: "",
          joining_date: new Date().toISOString().split('T')[0],
          status: "active"
        });
        setShowAddModal(false);
        toast.success("Staff added successfully!");
        fetchStaff();
      } else {
        toast.error(response.data.message || "Failed to add staff");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Error adding staff");
    }
  };

  const handleEditStaff = async () => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/update/staff/${editStaff.id}`,
        editStaff
      );
      
      if (response.data.success) {
        setStaff(staff.map(s => s.id === editStaff.id ? response.data.staff : s));
        setEditStaff(null);
        setShowEditModal(false);
        toast.success("Staff updated successfully!");
        fetchStaff();
      } else {
        toast.error(response.data.message || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Error updating staff");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await axios.delete(`${BASEURL}/api/v1/delete/staff/${staffId}`);
      if (response.data.success) {
        setStaff(staff.filter(s => s.id !== staffId));
        toast.success("Staff deleted successfully!");
        fetchStaff();
      } else {
        toast.error(response.data.message || "Failed to delete staff");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Error deleting staff");
    }
  };

  // Filter staff
  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch = 
      staffMember.name.toLowerCase().includes(search.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(search.toLowerCase()) ||
      staffMember.phone.includes(search);
    
    const matchesRole = filterRole === "All" || staffMember.role === filterRole;
    const matchesStatus = filterStatus === "All" || staffMember.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === "active").length;
  const technicians = staff.filter(s => s.role === "technician").length;

  const getRoleColor = (role) => {
    const roleObj = staffRoles.find(r => r.value === role);
    return roleObj ? roleObj.color : "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search staff..."
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
              Add Staff
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
                <p className="text-sm text-gray-600 mt-1">Total Staff</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeStaff}</p>
                <p className="text-sm text-gray-600 mt-1">Active Staff</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Badge className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{technicians}</p>
                <p className="text-sm text-gray-600 mt-1">Technicians</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Roles</option>
              {staffRoles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="All">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
     {/* Staff Table */}
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full"> {/* ✅ min-w-[1000px] hata diya */}
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">ID</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Staff Member</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Contact</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Role</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Salary</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Joining Date</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Status</th>
          <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredStaff.length > 0 ? filteredStaff.map(staffMember => (
          <tr key={staffMember.id} className="hover:bg-gray-50">
            <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">#{staffMember.id}</td>
            <td className="py-4 px-4">
              <div className="flex items-center gap-3 min-w-0"> {/* ✅ min-w-0 add kiya */}
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold">
                    {staffMember.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1"> {/* ✅ Text truncation ke liye */}
                  <p className="font-medium text-gray-900 truncate">{staffMember.name}</p>
                  <p className="text-sm text-gray-500 truncate">{staffMember.email}</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{staffMember.phone}</span>
                </div>
                {staffMember.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{staffMember.address}</span>
                  </div>
                )}
              </div>
            </td>
            <td className="py-4 px-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(staffMember.role)} whitespace-nowrap`}>
                {staffRoles.find(r => r.value === staffMember.role)?.label}
              </span>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">
              <span className="font-semibold text-gray-900">
                {staffMember.salary ? `Rs. ${parseFloat(staffMember.salary).toLocaleString()}` : "-"}
              </span>
            </td>
            <td className="py-4 px-4 whitespace-nowrap">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                {new Date(staffMember.joining_date).toLocaleDateString()}
              </div>
            </td>
            <td className="py-4 px-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staffMember.status)} whitespace-nowrap`}>
                {statusOptions.find(s => s.value === staffMember.status)?.label}
              </span>
            </td>
            <td className="py-4 px-4">
              <div className="flex items-center gap-1">
                <button 
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  onClick={() => { setViewStaff(staffMember); setShowViewModal(true); }}
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                  onClick={() => { setEditStaff({ ...staffMember }); setShowEditModal(true); }}
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  onClick={() => handleDeleteStaff(staffMember.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="8" className="py-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Users className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">No staff members found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Add New Staff Member</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newStaff.name}
                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newStaff.email}
                    onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newStaff.phone}
                    onChange={e => setNewStaff({...newStaff, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {staffRoles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (Rs.)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter monthly salary"
                    value={newStaff.salary}
                    onChange={e => setNewStaff({...newStaff, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    value={newStaff.joining_date}
                    onChange={e => setNewStaff({...newStaff, joining_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    placeholder="Enter full address"
                    value={newStaff.address}
                    onChange={e => setNewStaff({...newStaff, address: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newStaff.status}
                    onChange={e => setNewStaff({...newStaff, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                onClick={handleAddStaff}
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && viewStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Staff Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-semibold">
                      {viewStaff.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{viewStaff.name}</h4>
                    <p className="text-gray-600">{viewStaff.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Role</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(viewStaff.role)}`}>
                        {staffRoles.find(r => r.value === viewStaff.role)?.label}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="h-4 w-4" />
                        {viewStaff.phone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewStaff.status)}`}>
                        {statusOptions.find(s => s.value === viewStaff.status)?.label}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Joining Date</label>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="h-4 w-4" />
                        {new Date(viewStaff.joining_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {viewStaff.salary && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Salary</label>
                    <p className="font-semibold text-lg text-gray-900">
                      Rs. {parseFloat(viewStaff.salary).toLocaleString()}
                    </p>
                  </div>
                )}

                {viewStaff.address && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Address</label>
                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{viewStaff.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && editStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Edit Staff Member</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editStaff.name}
                    onChange={e => setEditStaff({...editStaff, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editStaff.email}
                    onChange={e => setEditStaff({...editStaff, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={editStaff.phone}
                    onChange={e => setEditStaff({...editStaff, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={editStaff.role}
                    onChange={e => setEditStaff({...editStaff, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {staffRoles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editStaff.salary}
                    onChange={e => setEditStaff({...editStaff, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    value={editStaff.joining_date}
                    onChange={e => setEditStaff({...editStaff, joining_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={editStaff.address}
                    onChange={e => setEditStaff({...editStaff, address: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editStaff.status}
                    onChange={e => setEditStaff({...editStaff, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                onClick={handleEditStaff}
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

export default StaffManagement;