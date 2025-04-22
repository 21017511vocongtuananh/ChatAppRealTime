import React from 'react';

const HeaderUser = ({ activeSection }) => {
  const titles = {
    friends: 'Danh sách bạn bè',
    groups: 'Danh sách nhóm và cộng đồng',
    friendRequests: 'Lời mời kết bạn',
    groupInvitations: 'Lời mời vào nhóm và cộng đồng'
  };

  return (
    <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
      <div className='flex gap-3 items-center'>
        <div>{titles[activeSection]}</div>
      </div>
    </div>
  );
};

export default HeaderUser;
