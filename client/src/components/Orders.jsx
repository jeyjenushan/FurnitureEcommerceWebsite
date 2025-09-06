import React, { useState } from "react";
import { useQuery } from "react-query";
import { orderService } from "../services/authService";
import { toast } from "react-toastify";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Filter,
  AlertCircle,
  Trash2,
} from "lucide-react";

const Orders = () => {
  const [filter, setFilter] = useState("all");

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["orders", filter],
    async () => {
      let response;
      if (filter === "upcoming")
        response = await orderService.getUpcomingOrders();
      else if (filter === "past") response = await orderService.getPastOrders();
      else response = await orderService.getAllOrders();
      if (response.success) return response.data || [];
      else throw new Error(response.message || "Failed to fetch orders");
    },
    {
      retry: 2,
      onError: (error) =>
        toast.error(error.message || "Failed to fetch orders"),
    }
  );

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await orderService.deleteOrder(orderId);
      toast.success("Order deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 bg-amber-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-amber-50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">My Orders</h1>
        <p className="text-amber-700">Track and manage your furniture orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-4">
        {[
          { key: "all", label: "All Orders" },
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past Orders" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
              filter === tab.key
                ? "bg-orange-600 text-white"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error.message}</p>
              <button
                onClick={refetch}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-amber-50 rounded-xl shadow-md border border-amber-200 hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-amber-900 truncate">
                  {order.productName}
                </h3>
                <span className="text-sm text-amber-700">
                  Order #{order.id}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-amber-700 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                  <span>
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  <span>{order.deliveryTime}</span>
                </div>
                <div className="flex items-center col-span-1 sm:col-span-2">
                  <MapPin className="h-4 w-4 mr-2 text-red-600" />
                  <span>{order.deliveryLocation}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-amber-700">
                  Quantity:{" "}
                  <span className="text-orange-600">{order.quantity}</span>
                </span>
              </div>
              {order.message && (
                <div className="mt-2 p-3 bg-amber-100 rounded-md border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <strong>Instructions:</strong> {order.message}
                  </p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(order.id)}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-amber-400 mb-4" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">
            No orders found
          </h3>
          <p className="text-amber-700 mb-6">
            Start by creating your first furniture order
          </p>
          <button
            onClick={() => (window.location.href = "/create-order")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            <Package className="h-4 w-4 mr-2" /> Create Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
