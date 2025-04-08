import React, { useEffect, useState } from 'react';

import useActiveList from '../../hooks/useActiveList';

const Avatar = ({ user }) => {
  const { members, fetchOnlineUsers } = useActiveList();
  const isActive = members.some(
    (member) => member.phoneNumber === user?.phoneNumber
  );

  useEffect(() => {
    fetchOnlineUsers();
  }, [fetchOnlineUsers]);

  return (
    <div className='relative'>
      <div
        className='
          relative 
          inline-block
          rounded-full
          overflow-hidden
          h-9
          w-9
          md:h-11
          md:w-11
        '
      >
        <img
          alt='user'
          src={user?.image || '/images/user.svg'}
          className='object-cover w-full h-full'
        />
      </div>
      {isActive && (
        <span
          className='
            absolute
            block
            rounded-full
            bg-green-500
            ring-2
            ring-white
            top-0
            right-0
            h-2
            w-2
            md:h-3
            md:w-3
          '
        />
      )}
    </div>
  );
};

export default Avatar;
