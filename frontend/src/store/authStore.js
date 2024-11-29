import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  token:null,

  signup: async (name, email, password, phone, image, role = "user") => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("image", image);
      formData.append("role", role);

      const response = await axios.post(`${API_URL}api/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}api/user/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
        isCheckingAuth:false,
      });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false, isCheckingAuth:false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}api/user/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}api/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}api/check-auth`);
      console.log(response,"response");
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false, isAuthenticated: false ,});
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/reset-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}api/reset-password/${token}`, { newPassword });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  acceptAccess: async (userId, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}api/accept-access/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error accepting access",
      });
      throw error;
    }
  },

  denyAccess: async (userId, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}api/deny-access/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error denying access",
      });
      throw error;
    }
  },
}));