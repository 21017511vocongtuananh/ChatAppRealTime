import React from 'react';
import FriendList from './FriendList';
import GroupList from './GroupList';
import FriendRequests from './FriendRequest';
import GroupInvitations from './GroupInvitations';

const BodyUser = ({ activeSection, friends, groups }) => {
  const content = {
    friends: <FriendList friends={friends} />,
    groups: <GroupList groups={groups} />,
    friendRequests: <FriendRequests />,
    groupInvitations: <GroupInvitations />
  };

  return content[activeSection] || <FriendList />;
};

export default BodyUser;
