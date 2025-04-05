import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apis';
import Input from '../Input/Input';
import CustomButton from '../Button/Button';
import Avatar from '../Avatar';
import Modal from '../Modal';

const FriendModel = ({ isOpen, onClose, users }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      phoneNumber: '' // Thêm trường để tìm kiếm theo số điện thoại
    }
  });

  const phoneNumber = watch('phoneNumber');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Logic tìm kiếm bạn bè theo số điện thoại
      console.log('Tìm kiếm với số điện thoại:', data.phoneNumber);
      // Gọi API nếu cần
      // const response = await ApiService.searchUserByPhone(data.phoneNumber);
      onClose();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    setIsLoading(true);
    try {
      // Gọi API để gửi lời mời kết bạn
      const response = await ApiService.sendFriendRequest(userId);
      console.log('Đã gửi lời mời kết bạn:', response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6'>
            {/* Tiêu đề */}
            <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
              <h2 className='text-lg font-semibold text-gray-900'>Thêm bạn</h2>
            </div>
            <div>
              <div className='mt-2'>
                <Input
                  register={register}
                  label='Nhập số điện thoại'
                  id='name'
                  disabled={isLoading}
                  required
                  errors={errors}
                />
              </div>
            </div>

            {/* Danh sách người dùng */}
            <div className='border-t pt-4'>
              <label className='block text-sm font-medium leading-6 text-gray-900'>
                Có thể bạn quen
              </label>
              <div className='max-h-60 overflow-y-auto mt-2'>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className='flex items-center justify-between px-2 hover:bg-gray-100 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <Avatar user={user} />
                      <div className='pb-3'>
                        <span className='text-sm font-medium text-gray-900'>
                          {user.name}
                        </span>
                        <p className='text-xs text-gray-500'>
                          {user.phoneNumber}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Từ số điện thoại
                        </p>
                      </div>
                    </div>
                    <CustomButton
                      onClick={() => handleAddFriend(user.id)}
                      disabled={isLoading}
                      type='button'
                      width={100}
                      height={28}
                      className='text-sm'
                    >
                      Kết bạn
                    </CustomButton>
                  </div>
                ))}
              </div>
            </div>
            <div className='text-center'>
              <button
                type='button'
                className='text-blue-500 text-sm hover:underline'
              >
                Xem thêm
              </button>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-4'>
            <CustomButton
              disabled={isLoading}
              onClick={onClose}
              type='button'
              color='red'
              className=' text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200'
              width={200}
              height={38}
            >
              Hủy
            </CustomButton>
            <CustomButton
              disabled={isLoading}
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
              width={200}
              height={38}
            >
              Tìm kiếm
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FriendModel;
