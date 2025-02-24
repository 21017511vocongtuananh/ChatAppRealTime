import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apis';
import UserList from './UserList';

const UserLayout = ({ children }) => {
  const [users, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getAllUser();
        setUser(response.userList || []);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar>
      <div className='h-full'>
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
};

export default UserLayout;
