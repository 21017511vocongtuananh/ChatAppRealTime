import CustomButton from '@components/Button/Button';
import Input from '@components/Input/Input';
import Modal from '@components/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Avatar from '../Avartar/Avatar';
import ApiService from '../../services/apis';

const GroupChatModal = ({ isOpen, onClose, users }) => {
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
      name: '',
      members: []
    }
  });

  const members = watch('members');

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
      console.log('Group chat created:', response.data);
      onClose();
      navigate('/conversations');
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
          <div className='space-y-12'>
            <div className='border-b border-gray-900/10 pb-12'>
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Tạo Nhóm
              </h2>
              <div className='mt-8 flex flex-col gap-y-8'>
                <Input
                  register={register}
                  label='Nhập tên nhóm'
                  id='name'
                  disabled={isLoading}
                  required
                  errors={errors}
                />
                <div className='border-t'>
                  <label className='block text-sm mt-2 font-medium mb-2 leading-6 text-gray-900'>
                    Trò chuyện gần đây
                  </label>
                  <div className='max-h-60 overflow-y-auto'>
                    {users.map((user) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <CustomButton
              disabled={isLoading}
              onClick={onClose}
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
