import React, { useCallback } from 'react';
import Avatar from '../Avartar/Avatar';
import { Dropdown, message } from 'antd';
import { IoEllipsisVertical } from 'react-icons/io5';
import ApiService from '../../services/apis';

const FriendItem = ({ friend }) => {
  const handleRemoveUser = useCallback(async (friendId) => {
    try {
      await ApiService.unFriend(friendId);
      message.success('Đã xoá bạn');
    } catch (error) {
      message.error(
        'Lỗi khi xoá bạn: ' + (error.response?.message || error.message)
      );
    }
  }, []);

  const handleBlockUser = useCallback(async (friendId) => {
    try {
      await ApiService.block(friendId);
      message.success('Đã block thành công ');
    } catch (error) {
      message.error(
        'Lỗi khi block: ' + (error.response?.message || error.message)
      );
    }
  }, []);

  const menu = {
    items: [
      {
        key: 'remove',
        label: 'Xoá bạn',
        onClick: () => handleRemoveUser(friend.friendId)
      },
      {
        key: 'block',
        label: 'Chặn người này',
        onClick: () => handleBlockUser(friend.friendId)
      }
    ]
  };

  return (
    <div
      key={friend.friendId}
      className='flex items-center w-full hover:bg-gray-100'
    >
      <div className='flex justify-between items-center p-4 w-full'>
        <div className='flex items-center space-x-2'>
          <Avatar user={friend} />
          <div className='flex flex-col pl-2'>
            <div>{friend.friendName}</div>
          </div>
        </div>
        <Dropdown menu={menu} trigger={['click']}>
          <button className='text-gray-500 hover:text-gray-700'>
            <IoEllipsisVertical className='w-5 h-5' />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default FriendItem;
