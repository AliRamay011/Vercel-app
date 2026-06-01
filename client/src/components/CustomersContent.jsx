import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  User,
  Phone,
  MapPin,
  Shield,
  Activity,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const CustomersContent = () => {
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    registration_date: new Date().toISOString().split("T")[0], // ✅ Default today's date
    plan_id: "",
    status: "active",
  });
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // PKR format function
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/api/v1/get/user`);
      if (response.data.success) {
        setCustomers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      console.log("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all plans for dropdown
  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/get/plans`);
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchPlans();
  }, []);

  const handleCreateCustomer = async () => {
    try {
      // Validation
      if (
        !newCustomer.name ||
        !newCustomer.phone ||
        !newCustomer.address ||
        !newCustomer.plan_id ||
        !newCustomer.area
      ) {
        alert("Please fill all required fields");
        return;
      }

      const response = await axios.post(`${BASEURL}/api/v1/create/user`, {
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        area: newCustomer.area,
        plan_id: parseInt(newCustomer.plan_id),
        registration_date: newCustomer.registration_date,
      });

      if (response.data.success) {
        setCustomers([...customers, response.data.user]);
        setNewCustomer({
          name: "",
          phone: "",
          address: "",
          area: "",
          plan_id: "",
          status: "active",
        });
        setShowAddModal(false);
        toast.success("Customer created successfully!");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error(error.response?.data?.message || "Failed to create customer");
    }
  };

  const handleEditCustomer = async () => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/edit/user/${editCustomer.id}`,
        {
          name: editCustomer.name,
          phone: editCustomer.phone,
          address: editCustomer.address,
          area: editCustomer.area,
          plan_id: parseInt(editCustomer.plan_id),
          status: editCustomer.status,
        }
      );

      if (response.data.success) {
        setCustomers(
          customers.map((c) =>
            c.id === editCustomer.id ? response.data.user : c
          )
        );
        setEditCustomer(null);
        setShowEditModal(false);
        toast.success("Customer updated successfully!");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(error.response?.data?.message || "Failed to update customer");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/v1/delete/user/${customerId}`
      );

      if (response.data.success) {
        setCustomers(customers.filter((c) => c.id !== customerId));
        toast.success("Customer deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(error.response?.data?.message || "Failed to delete customer");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getPlanColor = (planName) => {
    const colors = {
      Basic: "bg-blue-100 text-blue-800",
      Premium: "bg-purple-100 text-purple-800",
      Enterprise: "bg-orange-100 text-orange-800",
      Starter: "bg-green-100 text-green-800",
    };
    return colors[planName] || "bg-gray-100 text-gray-800";
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

  if (loading && customers.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customers</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c) => c.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter((c) => c.status === "inactive").length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(customers.map((c) => c.plan_id)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Area
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Address
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Plan
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      #{c.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {c.area}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">
                          {c.address}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(
                          getPlanName(c.plan_id)
                        )}`}
                      >
                        {getPlanName(c.plan_id)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Rs. {formatPKR(getPlanPrice(c.plan_id))}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => {
                            setViewCustomer(c);
                            setShowViewModal(true);
                          }}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          onClick={() => {
                            setEditCustomer({ ...c });
                            setShowEditModal(true);
                          }}
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteCustomer(c.id)}
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
                  <td colSpan="8" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No customers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Add New Customer</h3>
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    placeholder="Enter full address"
                    value={newCustomer.address}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option Area *
                  </label>
                  <textarea
                    placeholder="Enter area"
                    value={newCustomer.area}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        area: e.target.value,
                      })
                    }
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* ✅ Registration Date Field Add Kia Hai */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Date *
                  </label>
                  <input
                    type="date"
                    value={newCustomer.registration_date}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        registration_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan *
                  </label>
                  <select
                    value={newCustomer.plan_id}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        plan_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - Rs. {formatPKR(plan.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                onClick={handleCreateCustomer}
              >
                Create Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {showViewModal && viewCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Customer Details</h3>
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
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {viewCustomer.name}
                    </p>
                    <p className="text-sm text-gray-600">Customer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Customer ID
                      </label>
                      <p className="font-medium">#{viewCustomer.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">{viewCustomer.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Plan
                      </label>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(
                            getPlanName(viewCustomer.plan_id)
                          )}`}
                        >
                          {getPlanName(viewCustomer.plan_id)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Rs. {formatPKR(getPlanPrice(viewCustomer.plan_id))}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          viewCustomer.status
                        )}`}
                      >
                        {viewCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Address
                  </label>
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="font-medium">{viewCustomer.address}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Option Area
                  </label>
                  <p className="font-medium">{viewCustomer.area}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Registration Date
                  </label>
                  <p className="font-medium">
                    {new Date(
                      viewCustomer.registration_date
                    ).toLocaleDateString()}
                  </p>
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

      {/* Edit Customer Modal */}
      {showEditModal && editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Edit Customer</h3>
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editCustomer.name}
                    onChange={(e) =>
                      setEditCustomer({ ...editCustomer, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={editCustomer.phone}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    value={editCustomer.address}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        address: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area *
                  </label>
                  <textarea
                    value={editCustomer.area}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        area: e.target.value,
                      })
                    }
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan *
                  </label>
                  <select
                    value={editCustomer.plan_id}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        plan_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - Rs. {formatPKR(plan.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editCustomer.status}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                onClick={handleEditCustomer}
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

export default CustomersContent;