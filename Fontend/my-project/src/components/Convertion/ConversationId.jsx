import { useParams } from 'react-router-dom';
import ApiService from '../../services/apis';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import EmptyState from '../EmptyState';
import Header from '../Message/Header';
import Body from '../Message/Body';
import Form from '../Message/Form';
import ProfileDrawer from '@components/Message/ProfileDrawer';
import { useWebSocket } from '../Message/WebSocketContext';

const ConversationId = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { subscribe } = useWebSocket();
  const [block, setBlock] = useState(null);
  const userId = sessionStorage.getItem('userId');

  const fetchMessages = async () => {
    try {
      const messageResponse = await ApiService.getMessages(conversationId);
      setMessages(messageResponse.data || []);
    } catch (error) {
      message.error('Lỗi khi tải tin nhắn: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationResponse = await ApiService.getConversationId(
          conversationId
        );
        setConversation(conversationResponse.data);
        await fetchMessages();
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };
    fetchData();
  }, [conversationId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getFriendBlock();
        setBlock(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin Block:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribe(
      `/user/${userId}/queue/conversations`,
      (newConversation) => {
        setConversation((prevConversation) => {
          if (!prevConversation) {
            return newConversation;
          }

          if (prevConversation.id === newConversation.id) {
            return {
              ...prevConversation,
              users: newConversation.users,
              groupMembers: newConversation.groupMembers,
              name: newConversation.name,
              isGroup: newConversation.isGroup,
              lastMessageAt: newConversation.lastMessageAt
            };
          }
          return prevConversation;
        });
      }
    );
    return unsubscribe;
  }, [subscribe, userId]);

  useEffect(() => {
    const unsubscribeReceived = subscribe(
      `/user/${userId}/topic/friend-requests/sent`,
      (payload) => {
        setBlock(payload);
      }
    );
    return () => unsubscribeReceived();
  }, [subscribe, userId]);

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className='sm:pl-10 md:pl-20 lg:pl-80 h-full flex'>
      <div
        className={`h-full flex flex-col transition-all duration-300 ${
          drawerOpen ? 'w-[70%]' : 'w-full'
        }`}
      >
        <Header
          conversation={conversation}
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
        />
        <Body messages={messages} fetchMessages={fetchMessages} />
        <Form messages={messages} setMessages={setMessages} block={block} />
      </div>
      {drawerOpen && (
        <div className='w-[30%] h-full'>
          <ProfileDrawer
            datas={conversation}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationId;
