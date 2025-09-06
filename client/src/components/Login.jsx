import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart } from "lucide-react";

const Login = () => {
  const { user, loading, login } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    login(); // OAuth2 login redirect
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-600 p-4 rounded-full shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Furniture Store
          </h1>
          <p className="text-amber-700">
            Secure shopping experience with premium furniture
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-amber-600">
              Sign in to access your furniture shopping experience
            </p>
          </div>

          {/* OAuth2 Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-amber-600 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center shadow-md"
          >
            Sign in with Asgardeo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
