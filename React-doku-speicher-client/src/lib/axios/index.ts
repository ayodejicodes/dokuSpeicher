import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_FALLBACK_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

export default axiosInstance;
