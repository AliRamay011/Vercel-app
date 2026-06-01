import React, { useState, useEffect } from "react";
import { Save, Shield, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const SettingsContent = () => {
  const [adminSettings, setAdminSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("1"); // Hardcode admin ID for testing
  const BASEURL = import.meta.env.VITE_BACKEND_URL;

  const handleSaveAdminSettings = async () => {
    // Validation
    if (!adminSettings.email) {
      toast.error("Email is required!");
      return;
    }

    if (adminSettings.newPassword) {
      if (!adminSettings.currentPassword) {
        toast.error("Current password is required to set new password!");
        return;
      }

      if (adminSettings.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long!");
        return;
      }

      if (adminSettings.newPassword !== adminSettings.confirmPassword) {
        toast.error("New password and confirm password do not match!");
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare data for API
      const updateData = {
        email: adminSettings.email,
      };

      // Agar new password diya gaya hai toh bhejo
      if (adminSettings.newPassword) {
        updateData.password = adminSettings.newPassword;
      }

      console.log("Sending data:", updateData);

      // Use the correct API endpoint from Postman
      const response = await fetch(
        `${BASEURL}/api/v1/update/admin/${adminId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        toast.success("Admin settings updated successfully!");

        // Form reset karo
        setAdminSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // Password fields hide karo
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!adminSettings.email) return false;

    if (adminSettings.newPassword) {
      if (!adminSettings.currentPassword) return false;
      if (adminSettings.newPassword !== adminSettings.confirmPassword)
        return false;
      if (adminSettings.newPassword.length < 6) return false;
    }

    return true;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your admin account credentials
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Admin Account Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Admin Account
              </h3>
              <p className="text-sm text-gray-600">
                Update your email and password
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminSettings.email}
                onChange={(e) =>
                  setAdminSettings({ ...adminSettings, email: e.target.value })
                }
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Change Section */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Leave password fields blank if you don't want to change the
                password
              </p>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      value={adminSettings.currentPassword}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      value={adminSettings.newPassword}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      value={adminSettings.confirmPassword}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveAdminSettings}
              disabled={!isFormValid() || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
