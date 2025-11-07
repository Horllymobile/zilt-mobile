import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Alert } from "react-native";
import { refreshAccessToken } from "../api/refresh";
import { useAuthStore } from "../store/authStore";
import { formatErrorMessage } from "../utils/lib";

interface IAxiosParam {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

export const axiosInstance = axios.create({
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  async (request) => {
    const { session, logout } = useAuthStore.getState();
    let token = session?.token;

    if (!token) {
      token = (await refreshAccessToken()) as string;
    }

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    request.headers["User-Agent"] = "ZiltChat/1.0";

    // console.log(request.headers);

    return request;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { logout } = useAuthStore.getState();

    console.log(error.response.status);

    // Handle expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } else {
        logout?.();
      }
    }

    return Promise.reject(error);
  }
);

export const axiosBaseQuery = async (axiosParams: IAxiosParam) => {
  try {
    const result = await axiosInstance(axiosParams);
    return result.data;
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    Alert.alert(formatErrorMessage(err.response?.data));
    return Promise.reject({
      status: err.response?.status,
      data: err.response?.data || err.message,
    });
  }
};
