import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { orderService } from "../services/authService";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";

const CreateOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { deliveryTime: "10:00", quantity: 1 },
  });

  // Fetch order config
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = useQuery(
    "order-config",
    async () => {
      const response = await orderService.getOrderConfig();
      if (response.success) return response.data;
      throw new Error(response.message || "Failed to fetch configuration");
    },
    {
      retry: 2,
      onError: (error) =>
        toast.error(error.message || "Failed to fetch configuration"),
    }
  );

  // Mutation to create order
  const createOrderMutation = useMutation(
    async (orderData) => {
      const response = await orderService.createOrder(orderData);
      if (response.success) return response.data;
      throw new Error(response.message || "Failed to create order");
    },
    {
      onSuccess: () => {
        toast.success("Order created successfully!");
        queryClient.invalidateQueries("orders");
        navigate("/orders");
      },
      onError: (error) =>
        toast.error(error.message || "Failed to create order"),
    }
  );

  const onSubmit = (data) => {
    if (!selectedDate) {
      toast.error("Please select a delivery date");
      return;
    }

    const orderData = {
      purchaseDate: selectedDate.toISOString().split("T")[0],
      deliveryTime: data.deliveryTime,
      deliveryLocation: data.deliveryLocation,
      productName: data.productName,
      quantity: parseInt(data.quantity),
      message: data.message || "",
    };

    createOrderMutation.mutate(orderData);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0; // Disable past & Sundays
  };

  if (configLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 bg-amber-200 rounded w-1/3 mb-6"></div>
        <div className="bg-amber-50 rounded-lg shadow-sm p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-amber-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">
            Failed to load form configuration. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          Create New Order
        </h1>
        <p className="text-amber-700">
          Order premium furniture with secure delivery options
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" /> Delivery Date *
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              filterDate={(date) => !isDateDisabled(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholderText="Select delivery date"
              required
            />
            <p className="mt-1 text-xs text-amber-600">
              Delivery not available on Sundays
            </p>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              <Clock className="h-4 w-4 inline mr-1" /> Delivery Time *
            </label>
            <select
              {...register("deliveryTime", {
                required: "Delivery time is required",
              })}
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              {config?.deliveryTimes?.map((time) => (
                <option key={time} value={time}>
                  {time === "10:00"
                    ? "10:00 AM"
                    : time === "11:00"
                    ? "11:00 AM"
                    : "12:00 PM"}
                </option>
              )) || <option>Loading...</option>}
            </select>
            {errors.deliveryTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.deliveryTime.message}
              </p>
            )}
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" /> Delivery Location *
            </label>
            <select
              {...register("deliveryLocation", {
                required: "Delivery location is required",
              })}
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select District</option>
              {config?.districts?.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.deliveryLocation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.deliveryLocation.message}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              <Package className="h-4 w-4 inline mr-1" /> Product *
            </label>
            <select
              {...register("productName", {
                required: "Product selection is required",
              })}
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Product</option>
              {config?.products?.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.productName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              max="100"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum 1" },
                max: { value: 100, message: "Maximum 100" },
              })}
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Special Instructions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-amber-700 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" /> Special
              Instructions (Optional)
            </label>
            <textarea
              {...register("message", {
                maxLength: { value: 500, message: "Max 500 chars" },
              })}
              rows={4}
              placeholder="Any special delivery instructions..."
              className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="mt-1 text-xs text-amber-600">
              {watch("message")?.length || 0}/500 characters
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="px-4 py-2 border border-amber-300 rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createOrderMutation.isLoading}
            className="inline-flex items-center px-6 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {createOrderMutation.isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
