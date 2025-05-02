import { useState, useEffect } from 'react';
import ApiService from '../../services/apis';
import { Input, message } from 'antd';
import CustomButton from '../Button/Button';
import Avatar from '../Avartar/Avatar';
import Modal from '../Modal';

const AddUserGroupModal = ({ isOpen, onClose, data }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupUserIds, setGroupUserIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getFriendUserAccept();
        setUsers(response.data);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.users) {
      const idsFromData = data.users.map((u) => u.id);
      setGroupUserIds(idsFromData);
      setSelectedUsers(idsFromData);
    }
  }, [data]);

  const handleCheckboxChange = (userId) => {
    if (!groupUserIds.includes(userId)) {
      setSelectedUsers((prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId)
          : [...prevSelected, userId]
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRequestData = selectedUsers.map((userId) => ({ id: userId }));
    try {
      await ApiService.addUserConversation(data.id, userRequestData);
      message.success('Thêm người dùng thành công!');
      onClose();
    } catch (error) {
      message.error('Lỗi khi thêm người dùng: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className='space-y-6'>
          <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
            <h2 className='text-lg font-semibold text-gray-900'>Thêm bạn</h2>
          </div>

          <div className='mt-2 flex w-full'>
            <Input
              placeholder='Nhập số điện thoại hoặc tên'
              className='ml-2 w-full py-2 px-3 border border-gray-300 rounded-md'
            />
          </div>

          <div className='border-t pt-4'>
            <div className='max-h-60 overflow-y-auto mt-2 space-y-2'>
              {users.length > 0 ? (
                users.map((user) => {
                  const isInGroup = groupUserIds.includes(user.friendId);
                  return (
                    <div
                      key={user.friendId}
                      className='flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded-lg'
                    >
                      <div className='flex items-center space-x-3'>
                        <input
                          type='checkbox'
                          checked={selectedUsers.includes(user.friendId)}
                          onChange={() => handleCheckboxChange(user.friendId)}
                          disabled={isInGroup}
                          className={isInGroup ? 'cursor-not-allowed' : ''}
                        />
                        <Avatar user={user} />
                        <div>
                          <span className='text-sm font-medium text-gray-900'>
                            {user.friendName}
                          </span>
                          {isInGroup && (
                            <span className='text-xs text-green-500 ml-2'>
                              Đã tham gia
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className='text-gray-500 text-sm px-2'>
                  Không tìm thấy người dùng nào.
                </p>
              )}
            </div>
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
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            width={200}
            height={38}
          >
            Xác nhận
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserGroupModal;
