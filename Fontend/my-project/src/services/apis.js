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

  static async verifyOtp(email, otp) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/otp/verifyOTP?Email=${email}&otp=${otp}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async loggout(token) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/loggout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
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

  static async getPhoneFriend(phoneNumber) {
    try {
      const reponse = await axios.get(
        `${this.BASE_URL}/users/getPhoneFriend?phoneNumber=${phoneNumber}`
      );
      return reponse.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phone friend:', error);
    }
  }
  static async updateUser(userId, data) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('gender', data.gender);
      formData.append('dateOfBirth', data.dateOfBirth);

      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await axios.post(
        `${this.BASE_URL}/users/update/${userId}`,
        formData,
        { headers: this.getHeader() }
      );

      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      throw error;
    }
  }
  static async updatePassword(userId, data) {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);
    formData.append('confirmNewPassword', data.confirmPassword);

    const response = await axios.post(
      `${this.BASE_URL}/users/updatePassword/${userId}`,
      formData,
      { headers: this.getHeader() }
    );
    return response.data;
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
      throw error.response?.data?.errors;
    }
  }

  static async pinMessage(conversationId, messageId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/conversation/${conversationId}/pin/${messageId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async getPinmessage(conversationId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/conversation/${conversationId}/pin`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.code;
      throw new Error(errorMessage);
    }
  }

  static async deletePinMessage(conversationId) {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/conversation/${conversationId}/delete/pin`
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }
  static async getConversationisGroupTrue() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/conversation/getConversationIsGroupTrue`,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }
  static async getConversationIsGroupFalse() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/conversation/getConversationIsGroupFalse`,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async addUserConversation(conversationId, data) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/conversation/addUserConversation/${conversationId}`,
        data,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async exitConversation(conversationId, newAdminId) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/conversation/exit/${conversationId}?newAdminId=${newAdminId}`,
        {},
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async getUserInConversation(conversationId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/conversation/getUser/${conversationId}`,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async changeLeaderConversation(conversationId, newAdminId) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/conversation/changeLeader/${conversationId}?newAdminId=${newAdminId}`,
        {},
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async removeMeber(conversationId, member) {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/conversation/removeMember/${conversationId}?memberId=${member}`,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.message;
      throw new Error(errorMessage);
    }
  }

  // MESSAGE
  static async getMessages(conversationId) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/messages/${conversationId}`,
        { headers: this.getHeader() }
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
  static async deleteMessage(messageId) {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/messages/${messageId}/xoa`,
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async recallMessage(messageId, conversationId) {
    try {
      const response = await axios.delete(
        `${this.BASE_URL}/messages/${messageId}/thu-hoi`,
        {
          params: { conversationId },
          headers: this.getHeader()
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async undoRecallMessage(messageId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/messages/${messageId}/undoRecall`,
        {},
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async shareMessage(data) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/messages/shareMessage`,
        data,
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async deleteHistoryMessageUser(conversationId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/messages/deleteHistoryMessageUser/${conversationId}`,
        {},
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  //FRIEND
  static async sendFriend(friendId) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/friend/sendFriend?friendId=${friendId}`,
        {},
        { headers: this.getHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi lời mời kết bạn:', error);
    }
  }

  static async acceptFriend(friendId) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/friend/acceptFriend?friendId=${friendId}`,
        {},
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      console.error('Lỗi khi chấp nhận lời mời kết bạn:', error);
    }
  }

  static async getPendingFriendRequestsSentByUser() {
    try {
      const reponse = await axios.get(
        `${this.BASE_URL}/friend/getPendingFriendRequestsSentByUser`,
        {
          headers: this.getHeader()
        }
      );
      return reponse.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gữi lời mời bạn bè:', error);
    }
  }

  static async getPendingFriendRequestsReceivedByUser(userId) {
    try {
      const reponse = await axios.get(
        `${this.BASE_URL}/friend/getFriend/RequestsReceivedByUser?userId=${userId}`,
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      console.error('Lỗi khi lấy lời mời kết bạn:', error);
    }
  }

  static async getFriendUserAccept() {
    try {
      const reponse = await axios.get(
        `${this.BASE_URL}/friend/getFriendUserAccept`,
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async unFriend(friendId) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/friend/unfriend?friendId=${friendId}`,
        {},
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async block(friendId) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/friend/block?friendId=${friendId}`,
        {},
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async getFriendBlock() {
    try {
      const reponse = await axios.get(
        `${this.BASE_URL}/friend/getFriendBlock`,
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static async deleteBlock(friendId) {
    try {
      const reponse = await axios.post(
        `${this.BASE_URL}/friend/delete/block?friendId=${friendId}`,
        {},
        { headers: this.getHeader() }
      );
      return reponse.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      throw new Error(errorMessage);
    }
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
