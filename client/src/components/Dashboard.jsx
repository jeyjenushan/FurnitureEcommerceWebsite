import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Package, Plus, User, ShoppingCart } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || user?.username}!
        </h1>
        <p className="text-gray-600">
          Manage your furniture orders and explore our premium collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/create-order"
          className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg p-6 hover:from-orange-600 hover:to-yellow-700 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center">
            <Plus className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Create New Order</h3>
              <p className="text-yellow-100">Order premium furniture</p>
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg p-6 hover:from-emerald-600 hover:to-green-800 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center">
            <Package className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">View All Orders</h3>
              <p className="text-green-100">Track your purchases</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-gradient-to-r from-brown-600 to-yellow-700 text-white rounded-lg p-6 hover:from-yellow-700 hover:to-brown-800 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center">
            <User className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">My Profile</h3>
              <p className="text-yellow-100">Update your information</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
