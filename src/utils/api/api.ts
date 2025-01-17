import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { baseURL } from "./env";

const useAxiosInterceptor = () => {
  const { token } = useAuth();

  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("Token en interceptor:", token);
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxiosInterceptor;
