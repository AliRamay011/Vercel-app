import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Users,
  BarChart3,
  X,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

const CoverageAreas = () => {
  const [coverageAreas, setCoverageAreas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAreas: 0,
    activeAreas: 0,
    totalCustomers: 0,
    utilizationRate: 0,
  });

  // New Coverage Area Form State
  const [newArea, setNewArea] = useState({
    name: "",
    type: "fiber",
    status: "active",
    coordinates: "",
    radius: "",
    address: "",
    description: "",
    total_customers: "",
    installed_capacity: "",
    available_capacity: "",
  });

  // Edit Coverage Area Form State
  const [editArea, setEditArea] = useState({
    id: "",
    name: "",
    type: "fiber",
    status: "active",
    coordinates: "",
    radius: "",
    address: "",
    description: "",
    total_customers: "",
    installed_capacity: "",
    available_capacity: "",
  });

  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch coverage areas from API
  const fetchCoverageAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASEURL}/api/v1/coverage-areas`);
      console.log("API Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Data:", data);

      if (data.success) {
        setCoverageAreas(data.data || []);
        calculateStats(data.data || []);
      } else {
        throw new Error(data.message || "Failed to fetch coverage areas");
      }
    } catch (error) {
      console.error("Error fetching coverage areas:", error);
      console.log("Error loading coverage areas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from coverage areas data
  const calculateStats = (areas) => {
    const totalAreas = areas.length;
    const activeAreas = areas.filter((area) => area.status === "active").length;
    const totalCustomers = areas.reduce(
      (sum, area) => sum + (area.total_customers || 0),
      0
    );
    const totalCapacity = areas.reduce(
      (sum, area) => sum + (area.installed_capacity || 0),
      0
    );
    const utilizationRate =
      totalCapacity > 0
        ? Math.round((totalCustomers / totalCapacity) * 100)
        : 0;

    setStats({
      totalAreas,
      activeAreas,
      totalCustomers,
      utilizationRate,
    });
  };

  useEffect(() => {
    fetchCoverageAreas();
  }, []);

  const coverageTypes = [
    {
      value: "fiber",
      label: "Fiber Optic",
      color: "bg-blue-100 text-blue-800",
      icon: "🔵",
    },
    {
      value: "copper",
      label: "Copper",
      color: "bg-orange-100 text-orange-800",
      icon: "🟠",
    },
    {
      value: "wireless",
      label: "Wireless",
      color: "bg-green-100 text-green-800",
      icon: "🟢",
    },
    {
      value: "hybrid",
      label: "Hybrid",
      color: "bg-purple-100 text-purple-800",
      icon: "🟣",
    },
  ];

  const statusTypes = [
    {
      value: "active",
      label: "Active",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      value: "maintenance",
      label: "Maintenance",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: "planning",
      label: "Planning",
      color: "bg-blue-100 text-blue-800",
      icon: <Eye className="h-4 w-4" />,
    },
    {
      value: "inactive",
      label: "Inactive",
      color: "bg-red-100 text-red-800",
      icon: <XCircle className="h-4 w-4" />,
    },
  ];

  const getTypeColor = (type) => {
    const coverageType = coverageTypes.find((t) => t.value === type);
    return coverageType ? coverageType.color : "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const statusType = statusTypes.find((s) => s.value === status);
    return statusType ? statusType.color : "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const statusType = statusTypes.find((s) => s.value === status);
    return statusType ? statusType.icon : <Clock className="h-4 w-4" />;
  };

  // Open edit modal with area data
  const openEditModal = (area) => {
    setEditArea({
      id: area.id,
      name: area.name || "",
      type: area.type || "fiber",
      status: area.status || "active",
      coordinates: area.coordinates || "",
      radius: area.radius || "",
      address: area.address || "",
      description: area.description || "",
      total_customers: area.total_customers || "",
      installed_capacity: area.installed_capacity || "",
      available_capacity: area.available_capacity || "",
    });
    setShowEditModal(true);
  };

  // Create new coverage area
  const handleAddArea = async () => {
    try {
      setLoading(true);

      // Validation
      if (!newArea.name || !newArea.address || !newArea.radius) {
        toast.success(
          "Please fill all required fields (Name, Address, Radius)"
        );
        return;
      }

      const areaData = {
        name: newArea.name,
        type: newArea.type,
        status: newArea.status,
        coordinates: newArea.coordinates,
        radius: parseFloat(newArea.radius),
        address: newArea.address,
        description: newArea.description,
        total_customers: parseInt(newArea.total_customers) || 0,
        installed_capacity: parseInt(newArea.installed_capacity) || 0,
        available_capacity: parseInt(newArea.available_capacity) || 0,
      };

      const response = await fetch(`${BASEURL}/api/v1/coverage-areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(areaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Coverage area created successfully!");
        // Refresh the list
        await fetchCoverageAreas();

        // Reset form
        setNewArea({
          name: "",
          type: "fiber",
          status: "active",
          coordinates: "",
          radius: "",
          address: "",
          description: "",
          total_customers: "",
          installed_capacity: "",
          available_capacity: "",
        });
        setShowAddModal(false);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error creating coverage area:", error);
      toast.error("Error creating coverage area: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update coverage area
  const handleUpdateArea = async () => {
    try {
      setLoading(true);

      // Validation
      if (!editArea.name || !editArea.address || !editArea.radius) {
        toast.error("Please fill all required fields (Name, Address, Radius)");
        return;
      }

      const areaData = {
        name: editArea.name,
        type: editArea.type,
        status: editArea.status,
        coordinates: editArea.coordinates,
        radius: parseFloat(editArea.radius),
        address: editArea.address,
        description: editArea.description,
        total_customers: parseInt(editArea.total_customers) || 0,
        installed_capacity: parseInt(editArea.installed_capacity) || 0,
        available_capacity: parseInt(editArea.available_capacity) || 0,
      };

      const response = await fetch(
        `${BASEURL}/api/v1/coverage-areas/${editArea.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(areaData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Coverage area updated successfully!");
        // Refresh the list
        await fetchCoverageAreas();
        setShowEditModal(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error updating coverage area:", error);
      toast.error("Error updating coverage area: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete coverage area
  const handleDeleteArea = async (id) => {
    try {
      const response = await fetch(`${BASEURL}/api/v1/coverage-areas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Coverage area deleted successfully!");
        // Refresh the list
        await fetchCoverageAreas();
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting coverage area:", error);
      toast.error("Error deleting coverage area: " + error.message);
    }
  };

  const calculateUtilization = (customers, capacity) => {
    return capacity > 0 ? Math.round((customers / capacity) * 100) : 0;
  };

  const filteredAreas = coverageAreas
    .filter(
      (area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((area) => filterStatus === "all" || area.status === filterStatus);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Areas</h1>
          <p className="text-gray-600 mt-1">list Manage service areas </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center font-medium"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Area
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalAreas}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Areas</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeAreas}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Areas</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Customers</p>
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
                {stats.utilizationRate}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Utilization Rate</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Only List Tab */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search coverage areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statusTypes.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading areas...</p>
            </div>
          )}

          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Area Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Customers
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Capacity
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Utilization
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Last Updated
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAreas.map((area) => {
                    const utilization = calculateUtilization(
                      area.total_customers,
                      area.installed_capacity
                    );
                    return (
                      <tr key={area.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {area.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {area.address}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                              area.type
                            )}`}
                          >
                            {
                              coverageTypes.find((t) => t.value === area.type)
                                ?.icon
                            }{" "}
                            {
                              coverageTypes.find((t) => t.value === area.type)
                                ?.label
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              area.status
                            )}`}
                          >
                            {getStatusIcon(area.status)}
                            {
                              statusTypes.find((s) => s.value === area.status)
                                ?.label
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">
                            {area.total_customers}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span className="font-medium">
                              {area.available_capacity}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              / {area.installed_capacity}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  utilization < 60
                                    ? "bg-green-500"
                                    : utilization < 85
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${utilization}%` }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                utilization < 60
                                  ? "text-green-600"
                                  : utilization < 85
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {utilization}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {new Date(area.last_updated).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              onClick={() => openEditModal(area)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              onClick={() => handleDeleteArea(area.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredAreas.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No coverage areas found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Add Coverage Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Add New Area</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter area name"
                      value={newArea.name}
                      onChange={(e) =>
                        setNewArea({ ...newArea, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Network Type *
                    </label>
                    <select
                      value={newArea.type}
                      onChange={(e) =>
                        setNewArea({ ...newArea, type: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {coverageTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={newArea.status}
                      onChange={(e) =>
                        setNewArea({ ...newArea, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusTypes.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coverage Radius (km) *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter radius in km"
                      value={newArea.radius}
                      onChange={(e) =>
                        setNewArea({ ...newArea, radius: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinates (Lat, Long)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 24.9290,67.0990"
                    value={newArea.coordinates}
                    onChange={(e) =>
                      setNewArea({ ...newArea, coordinates: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter complete address"
                    value={newArea.address}
                    onChange={(e) =>
                      setNewArea({ ...newArea, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Customers
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newArea.total_customers}
                      onChange={(e) =>
                        setNewArea({
                          ...newArea,
                          total_customers: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Installed Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newArea.installed_capacity}
                      onChange={(e) =>
                        setNewArea({
                          ...newArea,
                          installed_capacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newArea.available_capacity}
                      onChange={(e) =>
                        setNewArea({
                          ...newArea,
                          available_capacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter area description, landmarks, or special notes..."
                    value={newArea.description}
                    onChange={(e) =>
                      setNewArea({ ...newArea, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                onClick={handleAddArea}
                disabled={
                  loading ||
                  !newArea.name ||
                  !newArea.address ||
                  !newArea.radius
                }
              >
                {loading ? (
                  "Adding..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Area
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coverage Area Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Edit Coverage Area</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter area name"
                      value={editArea.name}
                      onChange={(e) =>
                        setEditArea({ ...editArea, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Network Type *
                    </label>
                    <select
                      value={editArea.type}
                      onChange={(e) =>
                        setEditArea({ ...editArea, type: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {coverageTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={editArea.status}
                      onChange={(e) =>
                        setEditArea({ ...editArea, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusTypes.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coverage Radius (km) *
                    </label>
                    <input
                      type="number"
                      placeholder="Enter radius in km"
                      value={editArea.radius}
                      onChange={(e) =>
                        setEditArea({ ...editArea, radius: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinates (Lat, Long)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 24.9290,67.0990"
                    value={editArea.coordinates}
                    onChange={(e) =>
                      setEditArea({ ...editArea, coordinates: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter complete address"
                    value={editArea.address}
                    onChange={(e) =>
                      setEditArea({ ...editArea, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Customers
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editArea.total_customers}
                      onChange={(e) =>
                        setEditArea({
                          ...editArea,
                          total_customers: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Installed Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editArea.installed_capacity}
                      onChange={(e) =>
                        setEditArea({
                          ...editArea,
                          installed_capacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editArea.available_capacity}
                      onChange={(e) =>
                        setEditArea({
                          ...editArea,
                          available_capacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter area description, landmarks, or special notes..."
                    value={editArea.description}
                    onChange={(e) =>
                      setEditArea({ ...editArea, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                onClick={handleUpdateArea}
                disabled={
                  loading ||
                  !editArea.name ||
                  !editArea.address ||
                  !editArea.radius
                }
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Area
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverageAreas;
