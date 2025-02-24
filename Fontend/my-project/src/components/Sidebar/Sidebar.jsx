import React, { useState, useEffect } from 'react';
import DesktopSidebar from './DesktopSidebar';
import ApiService from '../../services/apis';

const Sidebar = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await ApiService.getPhoneLogin();
        setCurrentUser(userData.user);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={currentUser} />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  );
};

export default Sidebar;
