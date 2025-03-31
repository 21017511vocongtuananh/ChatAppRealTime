import Modal from '@components/Modal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar } from 'antd';
import { EditOutlined, CameraOutlined } from '@ant-design/icons';
import React from 'react';

const SettingsModal = ({ currentUser, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image');

  return (
    <div>
      {/* Modal hiển thị thông tin */}
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
            src={currentUser.image}
            className='border-4 border-white'
          />
          <div className='absolute bottom-2 right-2 bg-white p-1 rounded-full shadow'>
            <CameraOutlined className='text-gray-600' />
          </div>
          <h2 className='text-lg font-semibold mt-2 flex items-center'>
            {currentUser.name}{' '}
            <EditOutlined className='ml-2 text-gray-500 cursor-pointer' />
          </h2>
        </div>

        <div className='p-2'>
          <h3 className='text-lg font-semibold'>Thông tin cá nhân</h3>
          <div className='mt-4 space-y-2'>
            <p>
              <strong>Ngày sinh:</strong> {currentUser.dateOfBirth}
            </p>
            <p>
              <strong>Điện thoại:</strong> {currentUser.phoneNumber}
            </p>
            <p className='text-sm text-gray-500'>
              Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
            </p>
          </div>
          <Button
            type='primary'
            block
            className='mt-4 flex items-center justify-center'
            onClick={() => setIsEditing(true)}
          >
            <EditOutlined className='mr-2' /> Cập nhật
          </Button>
        </div>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <div className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>Chỉnh sửa thông tin</h2>
          <form>
            <label className='block mb-2'>Tên:</label>
            <input
              {...register('name')}
              className='w-full border px-2 py-1 rounded'
            />
            <label className='block mt-4 mb-2'>Ảnh:</label>
            <input
              type='file'
              {...register('image')}
              className='w-full border px-2 py-1 rounded'
            />
            <Button
              type='primary'
              block
              className='mt-4'
              onClick={() => setIsEditing(false)}
            >
              Lưu
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsModal;
