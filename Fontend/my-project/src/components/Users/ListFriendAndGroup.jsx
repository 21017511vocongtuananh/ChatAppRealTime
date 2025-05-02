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
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem('userId');

  const fetchData = useCallback(async () => {
    try {
      const [friendsResponse, groupsResponse] = await Promise.all([
        ApiService.getFriendUserAccept(),
        ApiService.getConversationisGroupTrue()
      ]);

      setFriends(friendsResponse.data || []);
      setGroups(groupsResponse.data || []);
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
    const unsubscribeReceived = subscribe(
      `/user/${userId}/topic/friend-requests/received`,
      async (payload) => {
        if (payload.type === 'DELETE') {
          const friendsResponse = await ApiService.getFriendUserAccept();
          setFriends(friendsResponse.data);
        }
      }
    );
    return () => unsubscribeReceived();
  }, [subscribe, userId]);

  useEffect(() => {
    const unsubscribeReceived = subscribe(
      `/user/${userId}/topic/friend-requests/sent`,
      async (payload) => {
        const friendsResponse = await ApiService.getFriendUserAccept();
        setFriends(friendsResponse.data);
      }
    );
    return () => unsubscribeReceived();
  }, [subscribe, userId]);

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
          activeSection={activeSection}
        />
      </div>
    </div>
  );
};

export default ListFriendAndGroup;
