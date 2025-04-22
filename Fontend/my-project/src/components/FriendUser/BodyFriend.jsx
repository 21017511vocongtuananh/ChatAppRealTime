import React from 'react';
import FriendList from './FriendList';
import GroupList from './GroupList';
import FriendRequests from './FriendRequest';
import GroupInvitations from './GroupInvitations';

const BodyUser = ({ activeSection, friends, groups, sendFriendPeding }) => {
  const content = {
    friends: <FriendList friends={friends} />,
    groups: <GroupList groups={groups} />,
    friendRequests: <FriendRequests sendFriendPeding={sendFriendPeding} />,
    groupInvitations: <GroupInvitations />
  };

  return content[activeSection] || <FriendList />;
};

export default BodyUser;
