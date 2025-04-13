import { useParams } from 'react-router-dom';
import ApiService from '../../services/apis';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import EmptyState from '../EmptyState';
import Header from '../Message/Header';
import Body from '../Message/Body';
import Form from '../Message/Form';
import ProfileDrawer from '@components/Message/ProfileDrawer';

const ConversationId = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hàm tải danh sách tin nhắn từ server
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
        setConversation(conversationResponse);
        await fetchMessages();
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };
    fetchData();
  }, [conversationId]);

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
        <Form messages={messages} setMessages={setMessages} />
      </div>
      {drawerOpen && (
        <div className='w-[30%] h-full'>
          <ProfileDrawer
            data={conversation}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationId;
