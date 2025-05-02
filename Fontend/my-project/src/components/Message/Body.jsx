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

  useEffect(() => {
    if (subscribed.current) return;

    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      async (data) => {
        if (data?.pinnedMessageId) {
          try {
            const res = await ApiService.getPinmessage(conversationId);
            setPinnedMessage(res.data);
          } catch {
            setPinnedMessage(null);
          }
        } else {
          setPinnedMessage(null);
        }

        if (data?.id && data.deleted) {
          setMessages((prev) =>
            (prev || []).map((msg) =>
              msg?.id === data.id ? { ...msg, ...data } : msg
            )
          );
        }
      }
    );
    subscribed.current = true;
    return () => {
      subscribed.current = false;
      unsubscribe();
    };
  }, [conversationId, subscribe]);

  const handleDeleteMessage = (id) => {
    setMessages((prev) => (prev || []).filter((msg) => msg?.id !== id));
  };

  const handleRecallMessage = (id) => {
    setMessages((prev) =>
      (prev || []).map((msg) =>
        msg?.id === id ? { ...msg, deleted: true } : msg
      )
    );
  };

  const handleRestoreMessage = async (id) => {
    try {
      await ApiService.undoRecallMessage(id);
      await fetchMessages();
    } catch (error) {
      message.error(error.message || 'Khôi phục thất bại');
    }
  };

  useEffect(() => {
    ApiService.updateMessage(conversationId).catch((error) => {
      console.error('Error updating messages:', error);
    });
  }, [conversationId]);

  const handleMenuClick = async ({ key }) => {
    try {
      if (key === 'pin') {
        await ApiService.deletePinMessage(conversationId);
        setPinnedMessage(null);
        message.success('Đã xoá ghim');
      }
    } catch (error) {
      message.error(error.message || 'Lỗi xóa ghim');
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

  if (!messages) {
    return <div>Loading...</div>;
  }

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
