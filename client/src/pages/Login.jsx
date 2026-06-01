import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock } from "lucide-react";
import "../App.css";
import { toast } from "react-toastify";

export default function Login() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Sending login request to:", `${url}/api/v1/admin/login`);
      
      const response = await fetch(`${url}/api/v1/admin/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      // Check for success in response
      if (result.success) {
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        throw new Error(result.message || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "Server error, try again later";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-200 shadow-xl bg-white">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <div className="relative">
              <Shield className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Portal
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Secure access to billing management
          </p>
        </CardHeader>

        <CardContent className="pb-6">
          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-3 w-3" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">Access Dashboard</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-500 text-xs">
          Secure Admin Portal • Billing Management System
        </p>
      </div>
    </div>
  );
}