import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCart, User, Package, Plus, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: ShoppingCart },
    { name: "Orders", href: "/orders", icon: Package },
    { name: "New Order", href: "/create-order", icon: Plus },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-amber-50 shadow-sm border-b border-amber-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
                <span className="ml-2 text-xl font-bold text-amber-900">
                  Furniture Store
                </span>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? "border-orange-600 text-amber-900"
                        : "border-transparent text-amber-700 hover:text-amber-900 hover:border-amber-400"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-amber-900">
              Welcome, {user?.name || user?.username}
            </span>
            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
