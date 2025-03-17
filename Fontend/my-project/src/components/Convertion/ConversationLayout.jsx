import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ConversationList from './ConversationList';
import ApiService from '../../services/apis';
import { useWebSocket } from '../Message/WebSocketContext';

const ConversationLayout = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getConversation();
        setConversation(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin conversation:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe('/topic/conversation/*', (newMsg) => {
      setConversation((prev) => {
        return prev.map((conv) => {
          if (conv.id === newMsg.conversationId) {
            // Cập nhật messages trong conversation
            const updatedMessages = (conv.messages || []).map((msg) =>
              msg.id === newMsg.id ? { ...msg, seen: newMsg.seen } : msg
            );
            // Nếu là tin nhắn mới, thêm vào danh sách
            if (!updatedMessages.some((msg) => msg.id === newMsg.id)) {
              updatedMessages.push(newMsg);
            }
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        });
      });
    });
    return unsubscribe;
  }, [subscribe]);

  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList initialItems={conversation} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationLayout;
