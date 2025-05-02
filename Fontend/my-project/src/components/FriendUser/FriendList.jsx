import React from 'react';
import Avatar from '../Avartar/Avatar';
import useOtherUser from '../../hooks/useOtherUser';
import FriendItem from './FriendItem';

const FriendList = ({ friends }) => {
  return (
    <>
      <div className='flex-1 overflow-y-auto bg-gray-100 p-4'>
        <div className='flex-1 overflow-y-auto bg-white'>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-blue-900'>
                Bạn bè ({friends ? friends.length : 0})
              </h2>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='relative flex-1'>
                <input
                  type='text'
                  placeholder='Tìm bạn'
                  className='w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <span className='absolute left-2 top-2.5 text-gray-500'>
                  🔍
                </span>
              </div>
              <button className='p-2 border rounded-lg flex items-center space-x-1'>
                <span>↑↓ Tên (A-Z)</span>
              </button>
              <button className='p-2 border rounded-lg flex items-center space-x-1'>
                <span>🕒 Tất cả</span>
              </button>
            </div>
          </div>
          <div className='divide-y divide-gray-200 w-full'>
            {friends.map((friend) => {
              return <FriendItem key={friend.friendId} friend={friend} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendList;
