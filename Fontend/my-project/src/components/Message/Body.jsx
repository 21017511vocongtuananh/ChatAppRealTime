import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from './WebSocketContext';
import useConversation from '../../hooks/useConversation.js';
import MessageBox from './MessageBox';
import ApiService from '../../services/apis';
import { Dropdown, message } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';

const Body = ({ messages: initialMessages, fetchMessages }) => {
  const { conversationId } = useConversation();
  const { subscribe } = useWebSocket();
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [messages, setMessages] = useState(initialMessages || []);
  const subscribed = useRef(false);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {pinnedMessage && (
        <div className='bg-yellow-100 border-l-4 border-yellow-500 p-3 m-4 rounded shadow'>
          <div className='font-semibold text-sm mb-1'>📌 Tin nhắn đã ghim:</div>
          <div className='flex justify-between'>
            <div className='text-sm break-words'>{pinnedMessage.body}</div>
            <Dropdown
              menu={{
                items: getMenuItems(),
                onClick: handleMenuClick
              }}
              trigger={['click']}
            >
              <button className='text-2xl font-bold text-gray-500'>
                <AiOutlineEllipsis />
              </button>
            </Dropdown>
          </div>
        </div>
      )}

      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={`${message?.id}-${i}`}
          data={message}
          onPinSuccess={() => setPinnedMessage(message)}
          onDeleteSuccess={() => handleDeleteMessage(message?.id)}
          onRestoreSuccess={() => handleRestoreMessage(message?.id)}
          onRecallSuccess={() => handleRecallMessage(message?.id)}
        />
      ))}
    </div>
  );
};

export default Body;
