import CustomButton from '../Button/Button';
import Avatar from '../Avartar/Avatar';
import React, { useEffect, useState, useCallback } from 'react';
import ApiService from '../../services/apis';
import { message } from 'antd';
import { useWebSocket } from '../Message/WebSocketContext';

const FriendRequests = () => {
  const { subscribe } = useWebSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [requestfriendPending, setRequestfriendPeding] = useState([]);
  const [sendFriendPeding, setFriendPeding] = useState([]);
  const userId = sessionStorage.getItem('userId');

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await ApiService.getPendingFriendRequestsReceivedByUser(
        userId
      );
      setRequestfriendPeding(response.data || []);
    } catch (error) {
      message.error('Lỗi khi lấy dữ liệu: ' + error.message);
    }
  }, []);

  const fetchPendingSendRequests = useCallback(async () => {
    try {
      const response = await ApiService.getPendingFriendRequestsSentByUser(
        userId
      );
      setFriendPeding(response.data || []);
    } catch (error) {
      message.error('Lỗi khi lấy dữ liệu: ' + error.message);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
    fetchPendingSendRequests();
  }, [fetchPendingRequests, fetchPendingSendRequests]);

  useEffect(() => {
    const unsubscribeReceived = subscribe(
      `/user/${userId}/topic/friend-requests/received`,
      (payload) => {
        if (payload.type === 'DELETE') {
          fetchPendingRequests();
          fetchPendingSendRequests();
        } else {
          setRequestfriendPeding(payload);
        }
      }
    );
    return () => unsubscribeReceived();
  }, [subscribe, userId, fetchPendingRequests, fetchPendingSendRequests]);

  useEffect(() => {
    const unsubscribeReceived = subscribe(
      `/user/${userId}/topic/friend-requests/sent`,
      (payload) => {
        setFriendPeding(payload);
      }
    );
    return () => unsubscribeReceived();
  }, [subscribe, userId, fetchPendingSendRequests]);

  const onAceept = useCallback(
    async (friendId) => {
      setIsLoading(true);
      try {
        await ApiService.acceptFriend(friendId);
        message.success('Đã chấp nhận lời mời kết bạn');
        fetchPendingRequests();
      } catch (error) {
        const errorMessage = error.response?.message || 'Có lỗi xảy ra';
        message.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPendingRequests]
  );

  const onReject = useCallback(
    async (friendId) => {
      setIsLoading(true);
      try {
        await ApiService.unFriend(friendId);
        message.success('Đã từ chối lời mời kết bạn');
        fetchPendingRequests();
      } catch (error) {
        message.error(error.response?.message || 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPendingRequests]
  );

  const onRecall = useCallback(
    async (friendId) => {
      setIsLoading(true);
      try {
        await ApiService.unFriend(friendId);
        message.success('Đã thu hồi lời mời kết bạn');
        fetchPendingSendRequests();
      } catch (error) {
        message.error(error.response?.message || 'Có lỗi xảy ra');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPendingSendRequests]
  );

  return (
    <div className='flex-1 overflow-y-auto bg-gray-100'>
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-blue-900'>
            Lời mời kết bạn ({requestfriendPending.length})
          </h2>
        </div>
      </div>
      <div className='p-4'>
        {requestfriendPending.length === 0 ? (
          <div className='text-center text-gray-500'>
            Không có lời mời kết bạn
          </div>
        ) : (
          requestfriendPending.map((requestfriendPendings) => (
            <div
              key={requestfriendPendings.friendId}
              className='bg-white p-4 rounded-lg shadow-sm mb-4'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar user={requestfriendPendings} />
                  <div className='flex flex-col'>
                    <div className='font-semibold'>
                      {requestfriendPendings.friendName}
                    </div>
                    <div className='text-sm text-gray-500'></div>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <CustomButton
                    type='submit'
                    className='bg-blue-500 px-4 py-2 rounded-lg'
                    onClick={() => onAceept(requestfriendPendings.friendId)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Chấp nhận'}
                  </CustomButton>
                  <CustomButton
                    type='submit'
                    color='red'
                    className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'
                    onClick={() => onReject(requestfriendPendings.friendId)}
                    disabled={isLoading}
                  >
                    Từ chối
                  </CustomButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-blue-900'>
            Lời mời đã gửi ({sendFriendPeding.length})
          </h2>
        </div>
        {sendFriendPeding.length === 0 ? (
          <div className='text-center text-gray-500'>
            Không có lời mời đã gửi
          </div>
        ) : (
          sendFriendPeding.map((friend) => (
            <div
              key={friend.friendId}
              className='bg-white p-4 rounded-lg shadow-sm mb-4'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar user={friend} />
                  <div className='flex flex-col'>
                    <div className='font-semibold'>{friend.friendName}</div>
                    <div className='text-sm text-gray-500'></div>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <CustomButton
                    type='submit'
                    className='bg-blue-500 px-4 py-2 rounded-lg'
                    onClick={() => onRecall(friend.friendId)}
                    disabled={isLoading}
                  >
                    Thu hồi lời mời
                  </CustomButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
