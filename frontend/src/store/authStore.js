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

      const response = await axios.post(`${API_URL}add`, formData, {
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
      const response = await axios.post(`${API_URL}/login`, { email, password });
  
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user',response.user);
  
      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token, 
        error: null,
        isLoading: false,
        isCheckingAuth: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
        isCheckingAuth: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}user/logout`);
  
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
  
      set({ user: null, isAuthenticated: false, token: null, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  }
  ,

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}verify-email`, { code });
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
      const response = await axios.get(`${API_URL}check-auth`);
      console.log(response,"response");
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false, isAuthenticated: false ,});
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}reset-password`, { email });
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
      const response = await axios.post(`${API_URL}reset-password/${token}`, { newPassword });
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
      const response = await axios.post(`${API_URL}accept-access/${userId}`, {}, {
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
      const response = await axios.post(`${API_URL}deny-access/${userId}`, {}, {
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
  checkAuthStatus: () => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          return true;
        }
        return false;
      }
}),
{
  name: "auth-storage",
  getStorage: () => localStorage,
}

);