import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // Backend base URL
  withCredentials: true,           // Ensures cookies are sent with requests
});

export default axiosInstance;