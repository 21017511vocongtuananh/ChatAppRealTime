import CustomButton from '@components/Button/Button';
import Input from '@components/Input/Input';
import Modal from '@components/Modal';
import { useState, useEffect } from 'react'; // Thêm useEffect
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Avatar from '../Avartar/Avatar';
import ApiService from '../../services/apis';
import { message } from 'antd';

const GroupChatModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [errors, setErrors] = useState({});

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      members: []
    }
  });
  const members = watch('members');

  useEffect(() => {
    if (!isOpen) {
      setAcceptedFriends([]);
      setValue('name', '');
      setValue('members', []);
      return;
    }
    const fetchAcceptedFriends = async () => {
      try {
        const response = await ApiService.getFriendUserAccept();
        const friends = response.data.map((friend) => ({
          id: friend.friendId,
          name: friend.friendName,
          image: friend.image
        }));
        setAcceptedFriends(friends);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bạn bè:', error);
        message.error('Không thể lấy danh sách bạn bè');
      }
    };
    fetchAcceptedFriends();
  }, [isOpen, setValue]);

  const handleMemberChange = (userId) => {
    const currentMembers = members || [];
    if (currentMembers.includes(userId)) {
      setValue(
        'members',
        currentMembers.filter((id) => id !== userId),
        { shouldValidate: true }
      );
    } else {
      setValue('members', [...currentMembers, userId], {
        shouldValidate: true
      });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const requestData = {
        name: data.name,
        users: data.members.map((id) => ({ id }))
      };
      const response = await ApiService.createConversation(requestData);
      message.success('Tạo nhóm thành công');
      onClose();
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
    setErrors({});
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-12'>
            <div className='border-b border-gray-900/10 pb-12'>
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Tạo Nhóm
              </h2>
              <div className='mt-8 flex flex-col gap-y-2'>
                <Input
                  register={register}
                  label='Nhập tên nhóm'
                  id='name'
                  disabled={isLoading}
                  errors={errors}
                />
                {errors.name && <p className='text-red-500'>{errors.name}</p>}
                <div className='border-t'>
                  <label className='block text-sm mt-2 font-medium mb-2 leading-6 text-gray-900'>
                    Trò chuyện gần đây
                  </label>
                  <div className='max-h-60 overflow-y-auto'>
                    {acceptedFriends.length > 0 ? (
                      acceptedFriends.map((user) => (
                        <div
                          key={user.id}
                          className='rounded-2xl pl-2 flex items-center space-x-3 py-1 hover:bg-gray-100 cursor-pointer'
                          onClick={() => handleMemberChange(user.id)}
                        >
                          <input
                            type='radio'
                            checked={members.includes(user.id)}
                            onChange={() => handleMemberChange(user.id)}
                            className='h-5 w-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                          <Avatar user={user} />
                          <span className='text-sm text-gray-900'>
                            {user.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-500'>
                        Không có bạn bè nào
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <CustomButton
              disabled={isLoading}
              onClick={handleCancel}
              type='button'
              color='red'
              width={200}
              height={38}
              secondary
            >
              Hủy
            </CustomButton>
            <CustomButton
              disabled={isLoading}
              type='submit'
              width={200}
              height={38}
            >
              Tạo Nhóm
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
