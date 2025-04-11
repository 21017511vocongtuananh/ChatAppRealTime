import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, message } from 'antd';
import { EditOutlined, CameraOutlined } from '@ant-design/icons';
import Modal from '@components/Modal';
import ApiService from '../../services/apis';

const SettingsModal = ({ currentUser, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');

  const [editedData, setEditedData] = useState({
    name: '',
    gender: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    if (isOpen) {
      setNewAvatar(null);
      setPreviewAvatar('');
      setEditedData({
        name: currentUser?.name || '',
        gender: currentUser?.gender || '',
        dateOfBirth: currentUser?.dateOfBirth || ''
      });
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const dataToSend = {
        name: editedData.name,
        gender: editedData.gender,
        dateOfBirth: editedData.dateOfBirth,
        image: newAvatar
      };

      await ApiService.updateUser(currentUser.id, dataToSend);

      setIsEditing(false);
      message.success('Cập nhật thành công');
      onClose();
    } catch (error) {
      console.error('Cập nhật thất bại:', error);
      message.error('Cập nhật thất bại');
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen && !isEditing} onClose={onClose}>
        <div className='relative w-full h-40 bg-black'>
          <img
            src='https://res.cloudinary.com/doypwarq0/image/upload/v1732065025/samples/balloons.jpg'
            alt='cover'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='relative flex flex-col items-center -mt-10'>
          <Avatar
            size={80}
            src={
              previewAvatar ||
              currentUser?.image ||
              'https://via.placeholder.com/80'
            }
            className='border-4 border-white'
          />
          <h2 className='text-lg font-semibold mt-2 flex items-center'>
            {currentUser?.name || 'Tên không xác định'}
            <EditOutlined
              className='ml-2 text-gray-500 cursor-pointer'
              onClick={() => setIsEditing(true)}
            />
          </h2>
        </div>

        <div className='p-2'>
          <h3 className='text-lg font-semibold'>Thông tin cá nhân</h3>
          <div className='mt-4 space-y-2'>
            <p>
              <strong>Tên:</strong> {currentUser?.name || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>Giới tính:</strong>{' '}
              {currentUser?.gender || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>Ngày sinh:</strong>{' '}
              {currentUser?.dateOfBirth || 'Chưa cập nhật'}
            </p>
            <p>
              <strong>Điện thoại:</strong>{' '}
              {currentUser?.phoneNumber || 'Chưa cập nhật'}
            </p>
            <p className='text-sm text-gray-500'>
              Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
            </p>
          </div>
          <Button
            type='primary'
            block
            className='mt-4'
            onClick={() => setIsEditing(true)}
          >
            <EditOutlined className='mr-2' /> Cập nhật
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>
            Cập nhật thông tin cá nhân
          </h2>

          <div className='flex flex-col items-center mb-4'>
            <Avatar
              size={80}
              src={
                previewAvatar ||
                currentUser?.image ||
                'https://via.placeholder.com/80'
              }
              className='border-4 border-white mb-2'
            />
            <label htmlFor='avatar-upload' className='cursor-pointer'>
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <label className='block mb-2 font-medium'>Tên hiển thị</label>
          <input
            name='name'
            defaultValue={currentUser.name}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Nhập tên của bạn'
          />

          <label className='block mt-4 mb-2 font-medium'>Giới tính</label>
          <div className='flex space-x-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='gender'
                value='Nam'
                defaultChecked={currentUser.gender === 'Nam'}
                onChange={handleInputChange}
                className='mr-2'
              />
              Nam
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='gender'
                value='Nữ'
                defaultChecked={currentUser.gender === 'Nữ'}
                onChange={handleInputChange}
                className='mr-2'
              />
              Nữ
            </label>
          </div>

          <label className='block mt-4 mb-2 font-medium'>Ngày sinh</label>
          <input
            type='date'
            name='dateOfBirth'
            defaultValue={currentUser.dateOfBirth}
            onChange={handleInputChange}
            className='w-full border px-3 py-2 rounded-md'
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

export default SettingsModal;
