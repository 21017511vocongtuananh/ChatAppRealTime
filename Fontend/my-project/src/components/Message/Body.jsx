import useConversation from '../../hooks/useConversation.js';
import MessageBox from './MessageBox';
import { useEffect, useRef, useState } from 'react';
import ApiService from '../../services/apis';
import { Dropdown, message } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';

const Body = ({ messages }) => {
  const { conversationId } = useConversation();
  const [pinnedMessage, setPinnedMessage] = useState(null);

  useEffect(() => {
    ApiService.updateMessage(conversationId) || [];
  }, [conversationId]);

  useEffect(() => {
    const fetchPinnedMessage = async () => {
      try {
        const res = await ApiService.getPinmessage(conversationId);
        setPinnedMessage(res.data);
      } catch (error) {
        if (error.message === '404') {
          setPinnedMessage(null);
        } else {
          message.error(error.message);
        }
      }
    };

    fetchPinnedMessage();
  }, [conversationId]);

  const handleMenuClick = async ({ key }) => {
    try {
      if (key === 'pin') {
        await ApiService.deletePinMessage(conversationId);
        setPinnedMessage(null);
        message.success('Đã xoá ghim');
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getMenuItems = () => {
    return [
      {
        key: 'pin',
        label: 'Xoá ghim'
      },
      {
        key: 'copy',
        label: 'Copy tin nhắn'
      }
    ];
  };

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
          key={`${message.id}-${i}`}
          data={message}
          onPinSuccess={() => setPinnedMessage(message)}
        />
      ))}
    </div>
  );
};

export default Body;
