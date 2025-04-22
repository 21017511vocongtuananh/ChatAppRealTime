import React, { useState } from 'react';
import {
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUsersCog,
  FaEnvelope
} from 'react-icons/fa';
import { MdOutlineGroupAdd } from 'react-icons/md';
import MenuItem from './MenuItem';

const UserList = ({ setActiveSection }) => {
  const [activeMenu, setActiveMenu] = useState('friends');

  const handleMenuClick = (section) => {
    setActiveMenu(section);
    setActiveSection(section);
  };

  return (
    <aside
      className='
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        hidden
        w-full
        left-0'
    >
      <div className='px-1'>
        <div className='max-w-md mx-auto'>
          <div className='flex items-center justify-between mb-4 pt-4 space-x-4'>
            <div className='flex items-center flex-1 bg-gray-100 p-2 rounded-md'>
              <FaSearch className='text-gray-400 ml-2' />
              <input
                type='text'
                placeholder='Tìm kiếm'
                className='bg-gray-100 outline-none ml-2 w-full'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center justify-center p-2 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition'>
                <FaUserPlus size={18} />
              </div>
              <div className='flex items-center justify-center p-2 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition'>
                <MdOutlineGroupAdd size={18} />
              </div>
            </div>
          </div>
          <div className='space-y-2'>
            <MenuItem
              icon={<FaUsers />}
              text='Danh sách bạn bè'
              active={activeMenu === 'friends'}
              onClick={() => handleMenuClick('friends')}
            />
            <MenuItem
              icon={<FaUsersCog />}
              text='Danh sách nhóm và cộng đồng'
              active={activeMenu === 'groups'}
              onClick={() => handleMenuClick('groups')}
            />
            <MenuItem
              icon={<FaUserPlus />}
              text='Lời mời kết bạn'
              active={activeMenu === 'friendRequests'}
              onClick={() => handleMenuClick('friendRequests')}
            />
            <MenuItem
              icon={<FaEnvelope />}
              text='Lời mời vào nhóm và cộng đồng'
              active={activeMenu === 'groupInvitations'}
              onClick={() => handleMenuClick('groupInvitations')}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserList;
