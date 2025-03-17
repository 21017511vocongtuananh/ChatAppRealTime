import { useParams } from 'react-router-dom';
import ApiService from '../../services/apis';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import EmptyState from '../EmptyState';
import Header from '../Message/Header';
import Body from '../Message/Body';
import Form from '../Message/Form';

const ConversationId = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationResponse = await ApiService.getConversationId(
          conversationId
        );
        setConversation(conversationResponse);
        const messageResponse = await ApiService.getMessages(conversationId);
        setMessages(messageResponse.data || []);
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu:', error);
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
    <div className='sm:pl-10 md:pl-20 lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <Header conversation={conversation} />
        <Body messages={messages} />
        <Form messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ConversationId;
