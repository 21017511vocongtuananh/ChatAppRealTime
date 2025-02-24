import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ConversationList from './ConversationList';
import ApiService from '../../services/apis';

const ConversationLayout = ({ children }) => {
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await ApiService.getConversation();
        setConversation(response.conversationList || []);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin conversation:', error);
      }
    };

    fetchUser();
  }, []);

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
