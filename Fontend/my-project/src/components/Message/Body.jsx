import useConversation from '../../hooks/useConversation';
import MessageBox from './MessageBox';
import { useEffect, useRef } from 'react';
import ApiService from '../../services/apis';

const Body = ({ messages }) => {
  const { conversationId } = useConversation();

  useEffect(() => {
    ApiService.updateMessage(conversationId);
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={`${message.id}-${i}`}
          data={message}
        />
      ))}
    </div>
  );
};

export default Body;
