// Fix 3: Update authService.js - Add better error handling
import axios from "axios";

const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://localhost:8443",
};

// Create axios instance with better configuration
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // ⚠️ Do NOT redirect here, just reject
    return Promise.reject(error);
  }
);

export const authService = {
  // Initiate OAuth2 login
  initiateLogin() {
    window.location.href = `${CONFIG.API_BASE_URL}/oauth2/authorization/asgardeo`;
  },

  // Get current user info with better error handling
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/api/auth/user");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in
        return null;
      }
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Logout
  async logout() {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/login";
    }
  },

  getApiClient() {
    return apiClient;
  },
};

// Fix 4: Create orderService.js for better organization
export const orderService = {
  // Get order configuration
  async getOrderConfig() {
    const response = await apiClient.get("/api/orders/config");
    return response.data;
  },

  // Get all orders
  async getAllOrders() {
    const response = await apiClient.get("/api/orders");
    return response.data;
  },

  // Get upcoming orders
  async getUpcomingOrders() {
    const response = await apiClient.get("/api/orders/upcoming");
    return response.data;
  },

  // Get past orders
  async getPastOrders() {
    const response = await apiClient.get("/api/orders/past");
    return response.data;
  },

  // Create new order
  async createOrder(orderData) {
    const response = await apiClient.post("/api/orders", orderData);
    return response.data;
  },
  async deleteOrder(orderId) {
    try {
      const response = await apiClient.delete(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Delete order error:", error);
      throw error;
    }
  },
};
