import axios from 'axios';
import { message } from 'antd';
import axiosInstance from './axiosConfig';

export default class ApiService {
  static BASE_URL = import.meta.env.VITE_API_BASE_URL;

  static getHeader() {
    const token = sessionStorage.getItem('token');
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  }

  //AUTH

  static async loginApi(loginDetails) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/login`,
        loginDetails
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Đăng nhập thất bại';
    }
  }

  static async resetPassword(resetPasswordDetails) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/resetPassword`,
        resetPasswordDetails
      );
      message.success('Đặt lại mật khẩu thành công!');
      return response.data;
    } catch (error) {
      console.error(
        'Đặt lại mật khẩu thất bại: ' +
          (error.response?.data?.message || 'Không xác định')
      );
    }
  }

  static async sendOTP(email, mode) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/otp/send?mode=${mode}`,
        {
          email
        }
      );
      return response.data;
    } catch (error) {
      const errorData = error.response.data;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((err) => {
          message.error(err);
        });
      } else {
        console.error(errorData.message);
      }
    }
  }

  // USER
  static async getAllUser() {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/get-all`, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin all user:', error);
    }
  }

  static async getPhoneLogin() {
    try {
      const response = await axiosInstance.get(
        `${this.BASE_URL}/users/get-phone`
      );
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phone user:', error);
    }
  }

  static async getOnlineUser() {
    try {
      const response = await axios.get(`${this.BASE_URL}/users/onlineUser`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin online user:', error);
    }
  }
  // CONVERSSTION
  static async getConversation() {
    try {
      const response = await axios.get(`${this.BASE_URL}/conversation`, {
        headers: this.getHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin conversation:', error);
    }
  }

  static async getConversationId(conversationId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/conversation/${conversationId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteConversation(conversationId) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/conversation/delete/${conversationId}`
      );
      return reponse;
    } catch (error) {
      console.log(error);
    }
  }

  static async createConversation(data) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/conversation/create/conversation`,
        data,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', error);
    }
  }

  // MESSAGE
  static async getMessages(conversationId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/messages/${conversationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error.response?.data);
    }
  }
  static async updateMessage(conversationId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/messages/${conversationId}/seen`,
        {},
        { headers: this.getHeader() }
      );
      return response.data || [];
    } catch (error) {
      console.error('API Error:', error.response);
    }
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
