import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ConversationList from './ConversationList';
import ApiService from '../../services/apis';
import { useWebSocket } from '../Message/WebSocketContext';
import { useNavigate, useParams } from 'react-router-dom';

const ConversationLayout = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const { subscribe } = useWebSocket();
  const [user, setUser] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getAllUser();
        setUser(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin conversation:', error);
      }
    };
    fetchUser();
  }, []);

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
    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (newMsg) => {
        setConversation((prev) =>
          prev.map((conv) => {
            if (conv.id !== newMsg.conversationId) return conv;

            const exists = conv.messages?.some((msg) => msg.id === newMsg.id);

            const updatedMessages = exists
              ? conv.messages.map((msg) =>
                  msg.id === newMsg.id ? { ...msg, seen: newMsg.seen } : msg
                )
              : [...(conv.messages || []), newMsg];

            return { ...conv, messages: updatedMessages };
          })
        );
      }
    );
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribe(
      `/user/${userId}/queue/conversations`,
      (data) => {
        if (data.type === 'DELETE') {
          const deletedId = data.conversationId;
          setConversation((prevConversations) =>
            prevConversations.filter((conv) => conv.id !== deletedId)
          );
          if (window.location.pathname.includes(deletedId)) {
            navigate('/conversations');
          }
        } else {
          const newConversation = data.conversation || data;
          setConversation((prevConversations) => {
            const exists = prevConversations.some(
              (conv) => conv.id === newConversation.id
            );
            if (exists) {
              return prevConversations.map((conv) =>
                conv.id === newConversation.id
                  ? {
                      ...conv,
                      ...(newConversation.users
                        ? { users: newConversation.users }
                        : {}),
                      ...(newConversation.groupMembers
                        ? { groupMembers: newConversation.groupMembers }
                        : {}),
                      name: newConversation.name,
                      isGroup: newConversation.isGroup,
                      lastMessageAt: newConversation.lastMessageAt
                    }
                  : conv
              );
            } else {
              return [...prevConversations, newConversation];
            }
          });
        }
      }
    );

    return unsubscribe;
  }, [subscribe, userId]);

  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList users={user} initialItems={conversation} />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConversationLayout;
