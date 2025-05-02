import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import Modal from '@components/Modal';
import ApiService from '../../services/apis';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = ({ currentUser, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return message.warning('Vui lòng nhập đầy đủ thông tin.');
    }

    try {
      await ApiService.updatePassword(currentUser.id, {
        currentPassword,
        newPassword,
        confirmPassword
      });
      message.success('Cập nhật mật khẩu thành công!');
      navigate('/');
      onClose();
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || 'Cập nhật mật khẩu thất bại!'
      );
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>Cập nhật mật khẩu</h2>

          <label className='block mb-2 font-medium'>Mật khẩu hiện tại</label>
          <Input.Password
            name='currentPassword'
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder='Nhập mật khẩu cũ'
          />

          <label className='block mt-4 mb-2 font-medium'>Mật khẩu mới</label>
          <Input.Password
            name='newPassword'
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder='Nhập mật khẩu mới'
          />

          <label className='block mt-4 mb-2 font-medium'>
            Xác nhận mật khẩu mới
          </label>
          <Input.Password
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder='Nhập lại mật khẩu mới'
          />

          <Button
            type='primary'
            className='mt-6 w-full'
            onClick={handleSaveChanges}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UpdatePassword;
