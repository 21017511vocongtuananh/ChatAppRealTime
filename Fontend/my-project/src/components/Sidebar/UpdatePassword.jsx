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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value, formData) => {
    const newErrors = {};
    if (!value) {
      newErrors[name] = 'Trường này không được để trống.';
    }
    if (name === 'newPassword' && value && value.length < 6) {
      newErrors[name] = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    }
    if (name === 'confirmPassword' && value && value !== formData.newPassword) {
      newErrors[name] = 'Mật khẩu xác nhận không khớp.';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    const fieldErrors = validateField(name, value, {
      ...formData,
      [name]: value
    });
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));
  };

  const handleSaveChanges = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    const validationErrors = {
      ...validateField('currentPassword', currentPassword, formData),
      ...validateField('newPassword', newPassword, formData),
      ...validateField('confirmPassword', confirmPassword, formData)
    };

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
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
      console.error('API Error:', error.response);
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
          {errors.currentPassword && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.currentPassword}
            </p>
          )}

          <label className='block mt-4 mb-2 font-medium'>Mật khẩu mới</label>
          <Input.Password
            name='newPassword'
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder='Nhập mật khẩu mới'
          />
          {errors.newPassword && (
            <p className='text-red-500 text-sm mt-1'>{errors.newPassword}</p>
          )}

          <label className='block mt-4 mb-2 font-medium'>
            Xác nhận mật khẩu mới
          </label>
          <Input.Password
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder='Nhập lại mật khẩu mới'
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.confirmPassword}
            </p>
          )}

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
