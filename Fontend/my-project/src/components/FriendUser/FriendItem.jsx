import React from 'react';
import Avatar from '../Avartar/Avatar';
import useOtherUser from '../../hooks/useOtherUser';
import AvatarGroup from '../Avartar/AvatarGroup';

const FriendItem = ({ friend }) => {
  const otherUser = useOtherUser(friend);

  return (
    <div key={friend.id} className='flex items-center w-full hover:bg-gray-100'>
      <div className='flex justify-between items-center p-4 w-full'>
        <div className='flex items-center space-x-2'>
          {friend.isGroup ? (
            <AvatarGroup users={friend.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col pl-2'>
            <div> {friend.name || otherUser.name}</div>
          </div>
        </div>
        <div>...</div>
      </div>
    </div>
  );
};

export default FriendItem;
