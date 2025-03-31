import axios from 'axios';
import { message } from 'antd';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res, // Trả về response nếu không có lỗi
  async (err) => {
    const originalRequest = err.config;

    // Kiểm tra lỗi 401 (Unauthorized) và đảm bảo chưa retry
    if (
      err.response &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!refreshToken) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return Promise.reject(err);
      }
      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken
        });
        if (response.status === 200) {
          const newToken = response.data.data.token;
          sessionStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
