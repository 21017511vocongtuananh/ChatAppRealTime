import React, { useEffect, useState, useCallback } from 'react';
import UserList from './UserList';
import HeaderUser from '../FriendUser/HeaderFriend';
import BodyUser from '../FriendUser/BodyFriend';
import ApiService from '../../services/apis';
import { message } from 'antd';
import { useWebSocket } from '../Message/WebSocketContext';

const ListFriendAndGroup = () => {
  const { subscribe } = useWebSocket();
  const [activeSection, setActiveSection] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [sendFriendPeding, setFriendPeding] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [friendsResponse, groupsResponse, sendfriendPendingResponse] =
        await Promise.all([
          ApiService.getConversationIsGroupFalse(),
          ApiService.getConversationisGroupTrue(),
          ApiService.getPendingFriendRequestsSentByUser()
        ]);

      setFriends(friendsResponse.data || []);
      setGroups(groupsResponse.data || []);
      setFriendPeding(sendfriendPendingResponse.data || []);
    } catch (error) {
      message.error('Lỗi khi lấy dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const unsubscribeSent = subscribe(
      `/user/${userId}/topic/friend-requests/sent`,
      (requests) => {
        console.log('Received sent friend requests:', requests);
        setFriendPeding(requests);
      }
    );
    return () => unsubscribeSent();
  }, [subscribe]);

  if (loading) {
    return (
      <div className='h-full flex justify-center items-center'>
        <div className='text-gray-500'>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className='h-full flex'>
      <UserList setActiveSection={setActiveSection} />
      <div className='flex-1 flex flex-col h-full'>
        <HeaderUser activeSection={activeSection} />
        <BodyUser
          friends={friends}
          groups={groups}
          sendFriendPeding={sendFriendPeding}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};

export default ListFriendAndGroup;
