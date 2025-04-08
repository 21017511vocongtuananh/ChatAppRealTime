import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ApiService from '../../services/apis';
import UserList from './UserList';

const UserLayout = ({ children }) => {
  return (
    <Sidebar>
      <div className='h-full'>
        <UserList />
        {children}
      </div>
    </Sidebar>
  );
};

export default UserLayout;
