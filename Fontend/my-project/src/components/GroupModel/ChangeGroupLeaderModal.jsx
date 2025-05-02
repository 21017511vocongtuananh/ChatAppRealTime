import { useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import CustomButton from '../Button/Button';
import Modal from '../Modal';
import ApiService from '../../services/apis';
import useConversation from '../../hooks/useConversation';
import Avatar from '../Avartar/Avatar';

const ChangeGroupLeaderModal = ({ isOpen, onClose, data }) => {
  const [users, setUsers] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useConversation();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      message.destroy();
      setSelectedAdminId(null);
      hasFetched.current = false;
      setUsers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || hasFetched.current || !conversationId) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await ApiService.getUserInConversation(conversationId);
        setUsers(response.data || []);
        hasFetched.current = true;
      } catch (error) {
        console.error('Lỗi API getUserInConversation:', error);
        message.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };

    if (conversationId) {
      fetchData();
    } else {
      message.error('Không tìm thấy ID cuộc trò chuyện');
    }
  }, [isOpen, conversationId]);

  const handleSelectAdmin = (userId) => {
    setSelectedAdminId(userId);
  };

  const handleConfirm = async () => {
    if (!selectedAdminId) {
      message.error('Vui lòng chọn trưởng nhóm mới');
      return;
    }

    try {
      setIsLoading(true);
      await ApiService.changeLeaderConversation(
        conversationId,
        selectedAdminId
      );
      message.success('Chuyển quyền trưởng nhóm thành công');
      onClose();
    } catch (error) {
      console.error('Lỗi API changeLeaderConversation:', error);
      message.error('Lỗi khi chuyển quyền: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-6'>
        <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Chọn trưởng nhóm mới
          </h2>
        </div>

        <div className='mt-2 flex w-full'>
          <Input
            placeholder='Nhập số điện thoại hoặc tên'
            className='w-full py-2 px-3 border border-gray-300 rounded-md'
          />
        </div>
        <div className='border-t pt-4'>
          <div className='max-h-60 overflow-y-auto mt-2 space-y-2'>
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md'
                  onClick={() => handleSelectAdmin(user.id)}
                >
                  <input
                    type='radio'
                    checked={selectedAdminId === user.id}
                    onChange={() => handleSelectAdmin(user.id)}
                    className='h-4 w-4 text-blue-500'
                  />
                  <Avatar user={user} />
                  <div>
                    <span className='text-sm font-medium text-gray-900'>
                      {user.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500'>Không tìm thấy thành viên</p>
            )}
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-4'>
          <CustomButton
            type='button'
            color='red'
            onClick={onClose}
            className='text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200'
            width={200}
            height={38}
          >
            Hủy
          </CustomButton>

          <CustomButton
            type='button'
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            width={200}
            height={38}
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading || !selectedAdminId}
          >
            Xác nhận
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeGroupLeaderModal;
