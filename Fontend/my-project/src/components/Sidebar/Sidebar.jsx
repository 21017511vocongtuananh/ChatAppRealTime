import React, { useState, useEffect } from 'react';
import DesktopSidebar from './DesktopSidebar';
import usePhoneNumber from '../../hooks/usePhoneNumber.js';

const Sidebar = ({ children }) => {
  const { data } = usePhoneNumber();

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={data} />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  );
};

export default Sidebar;
