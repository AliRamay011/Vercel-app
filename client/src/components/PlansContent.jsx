import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Zap,
  Wifi,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const PlansContent = () => {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    speed: "",
    data_limit: "",
    description: "",
    status: "active",
  });
  const [editPlan, setEditPlan] = useState(null);
  const [viewPlan, setViewPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // PKR format function
  const formatPKR = (amount) => {
    return parseFloat(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/api/v1/get/plans`);
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      console.log("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Add new plan
  const handleAddPlan = async () => {
    try {
      if (
        !newPlan.name ||
        !newPlan.price ||
        !newPlan.speed ||
        !newPlan.data_limit
      ) {
        alert("Please fill all required fields");
        return;
      }

      const response = await axios.post(
        `${BASEURL}/api/v1/create/plans`,
        newPlan
      );

      if (response.data.success) {
        setPlans([...plans, response.data.plan]);
        setNewPlan({
          name: "",
          price: "",
          speed: "",
          data_limit: "",
          description: "",
          status: "active",
        });
        setShowAddModal(false);
        toast.success("Plan created successfully!");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error(error.response?.data?.message || "Failed to create plan");
    }
  };

  // Edit plan
  const handleEditPlan = async () => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/edit/plans/${editPlan.id}`,
        editPlan
      );

      if (response.data.success) {
        setPlans(
          plans.map((p) => (p.id === editPlan.id ? response.data.plan : p))
        );
        setEditPlan(null);
        setShowEditModal(false);
        toast.success("Plan updated successfully!");
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error(error.response?.data?.message || "Failed to update plan");
    }
  };

  // Delete plan
  const handleDeletePlan = async (planId) => {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/v1/delete/plans/${planId}`
      );

      if (response.data.success) {
        setPlans(plans.filter((p) => p.id !== planId));
        toast.success("Plan deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan");
    }
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.price.toString().includes(search) ||
      p.speed.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      <CheckCircle className="h-4 w-4" />
    ) : (
      <XCircle className="h-4 w-4" />
    );
  };

  const getPlanColor = (name) => {
    const colors = {
      Basic: "bg-blue-100 text-blue-800",
      Premium: "bg-purple-100 text-purple-800",
      Enterprise: "bg-orange-100 text-orange-800",
      Starter: "bg-green-100 text-green-800",
    };
    return colors[name] || "bg-gray-100 text-gray-800";
  };

  if (loading && plans.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Internet Plans</h1>
            <p className="text-gray-600 mt-1">
              Manage your service plans and pricing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search plans..."
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
              Add New Plan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Plans</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.filter((p) => p.status === "active").length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Active Plans</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  Rs.{" "}
                  {formatPKR(
                    plans.reduce((sum, p) => sum + parseFloat(p.price), 0)
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total Price Value (PKR)
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.filter((p) => p.status === "active").length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Active Plans</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Wifi className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                        plan.name
                      )}`}
                    >
                      {plan.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(plan.status)}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </div>

                {/* Plan Price */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    Rs. {formatPKR(plan.price)}
                  </p>
                  <p className="text-gray-600">per month</p>
                </div>

                {/* Plan Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-700">{plan.speed}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{plan.data_limit}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-700">
                      {plan.description || "Standard Support"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    className="flex-1 py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center justify-center gap-1 text-sm font-medium"
                    onClick={() => {
                      setViewPlan(plan);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    className="flex-1 py-2 px-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition flex items-center justify-center gap-1 text-sm font-medium"
                    onClick={() => {
                      setEditPlan({ ...plan });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="flex-1 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-1 text-sm font-medium"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Zap className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No plans found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Add New Plan</h3>
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
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Basic, Premium, Enterprise"
                    value={newPlan.name}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={newPlan.price}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Amount: Rs. {newPlan.price ? formatPKR(newPlan.price) : "0"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 100 Mbps"
                    value={newPlan.speed}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, speed: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Limit *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 500 GB, Unlimited"
                    value={newPlan.data_limit}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, data_limit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Plan description..."
                    value={newPlan.description}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newPlan.status}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, status: e.target.value })
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
                onClick={handleAddPlan}
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Plan Modal */}
      {showViewModal && viewPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Plan Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                      viewPlan.name
                    )}`}
                  >
                    {viewPlan.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(viewPlan.status)}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        viewPlan.status
                      )}`}
                    >
                      {viewPlan.status}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">
                    Rs. {formatPKR(viewPlan.price)}
                  </p>
                  <p className="text-gray-600">per month</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Speed</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {viewPlan.speed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Data Limit</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {viewPlan.data_limit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Description</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {viewPlan.description || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Created</span>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {new Date(viewPlan.created_at).toLocaleDateString()}
                    </span>
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

      {/* Edit Plan Modal */}
      {showEditModal && editPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Edit Plan</h3>
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
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={editPlan.name}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={editPlan.price}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Amount: Rs. {editPlan.price ? formatPKR(editPlan.price) : "0"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speed *
                  </label>
                  <input
                    type="text"
                    value={editPlan.speed}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, speed: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Limit *
                  </label>
                  <input
                    type="text"
                    value={editPlan.data_limit}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, data_limit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editPlan.description}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editPlan.status}
                    onChange={(e) =>
                      setEditPlan({ ...editPlan, status: e.target.value })
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
                onClick={handleEditPlan}
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

export default PlansContent;