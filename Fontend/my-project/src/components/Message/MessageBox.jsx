import clsx from 'clsx';
import usePhoneNumber from '../../hooks/usePhoneNumber.js';
import Avatar from '../Avartar/Avatar';
import { format } from 'date-fns';
import { Button, Image, Dropdown, message } from 'antd';

import { AiOutlineEllipsis } from 'react-icons/ai';
import {
  CopyOutlined,
  PushpinOutlined,
  StarOutlined,
  CheckSquareOutlined,
  InfoCircleOutlined,
  UndoOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import ApiService from '../../services/apis.js';
import useConversation from '../../hooks/useConversation.js';
import MessageShareModel from './MessageShareModel.jsx';
import { useEffect, useState } from 'react';

const MessageBox = ({
  data,
  isLast,
  onPinSuccess,
  onDeleteSuccess,
  onRestoreSuccess
}) => {
  const { phone } = usePhoneNumber();
  const { conversationId } = useConversation();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await ApiService.getConversation();
        if (response && response.data) {
          setConversations(response.data);
        } else {
          console.warn('Dữ liệu không hợp lệ từ API:', response);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin conversation:', error);
      }
    })();
  }, []);

  if (!phone) return null;

  const isSystemMessage =
    data.type === 'SYSTEM' || data.messageType === 'SYSTEM';
  const isOwn = isSystemMessage ? false : phone === data.sender?.phoneNumber;
  const isVideo = data.image?.endsWith('.mp4');
  const isFile = data.image?.endsWith('.pdf');

  const handleMenuClick = async ({ key }) => {
    try {
      if (key === 'delete') {
        await ApiService.deleteMessage(data.id);
        onDeleteSuccess && onDeleteSuccess();

        message.open({
          type: 'info',
          content: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>1 tin nhắn đã xóa</span>
              <Button
                type='link'
                size='small'
                onClick={() => onRestoreSuccess && onRestoreSuccess(data.id)}
              >
                Khôi phục
              </Button>
            </div>
          ),
          duration: 3,
          icon: <UndoOutlined />
        });
      } else if (key === 'recall') {
        await ApiService.recallMessage(data.id, conversationId);
        message.success('Đã thu hồi tin nhắn');
      } else if (key === 'pin') {
        await ApiService.pinMessage(conversationId, data.id);
        message.success('Đã ghim tin nhắn');
        onPinSuccess && onPinSuccess();
      } else if (key === 'select') {
        setIsOpen(true);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'copy',
        label: 'Copy tin nhắn',
        icon: <CopyOutlined />
      },
      {
        key: 'pin',
        label: 'Ghim tin nhắn',
        icon: <PushpinOutlined />
      },
      {
        key: 'star',
        label: 'Đánh dấu tin nhắn',
        icon: <StarOutlined />
      },
      {
        key: 'select',
        label: 'Chia sẻ tin nhắn',
        icon: <CheckSquareOutlined />
      },
      {
        key: 'details',
        label: 'Xem chi tiết',
        icon: <InfoCircleOutlined />
      }
    ];

    const ownItems = [
      {
        key: 'recall',
        label: 'Thu hồi',
        icon: <UndoOutlined />,
        style: { color: 'red' }
      },
      {
        key: 'delete',
        label: 'Xóa chỉ ở phía tôi',
        icon: <DeleteOutlined />,
        style: { color: 'red' }
      }
    ];

    const otherItems = [
      {
        key: 'delete',
        label: 'Xóa chỉ ở phía tôi',
        icon: <DeleteOutlined />,
        style: { color: 'red' }
      }
    ];

    if (isSystemMessage) {
      return [];
    }

    return [...commonItems, ...(isOwn ? ownItems : otherItems)];
  };

  const container = clsx(
    'flex gap-3 p-4',
    isSystemMessage ? 'justify-center' : isOwn ? 'justify-end' : 'justify-start'
  );
  const avatar = clsx(isOwn && 'order-2');

  const body = clsx(
    'flex flex-col gap-1 rounded-lg p-2 w-fit min-w-[100px] max-w-[75%] break-words',
    !isSystemMessage && isOwn && 'items-end',
    !isSystemMessage && data.image && 'bg-white !shadow-none',
    isSystemMessage ? 'bg-transparent text-center' : 'bg-gray-100 shadow-sm'
  );
  const messageCls = clsx(
    'text-sm w-fit overflow-hidden break-all',
    isSystemMessage
      ? 'text-gray-500 italic'
      : isOwn
      ? 'text-black'
      : 'bg-gray-100',
    !isSystemMessage && data.image ? 'rounded-md p-0' : 'py-2'
  );
  const time = clsx(
    'text-sm flex items-center justify-between text-gray-400 w-full',
    isSystemMessage ? 'justify-center' : isOwn ? 'flex-row' : 'flex-row-reverse'
  );

  const renderMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 underline break-all'
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <MessageShareModel
        conversations={conversations}
        messageData={data}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className={container}>
        {!isSystemMessage && !isOwn && (
          <div className={avatar}>
            <Avatar user={data.sender} />
          </div>
        )}
        <div className={body}>
          {!isSystemMessage && (
            <div className='flex items-center gap-1'>
              <div className='text-sm text-gray-500'>
                {data.sender?.name || 'Unknown'}
              </div>
            </div>
          )}
          <div className={messageCls}>
            {data.deleted ? (
              <i className='text-gray-500 italic'>
                Tin nhắn này đã được thu hồi
              </i>
            ) : data.image ? (
              isVideo ? (
                <video
                  controls
                  width={285}
                  height={300}
                  className='object-cover cursor-pointer hover:scale-110 transition transform border rounded-2xl'
                >
                  <source src={data.image} type='video/mp4' />
                </video>
              ) : isFile ? (
                <div
                  className='p-2 border rounded-lg bg-gray-200 flex flex-col items-center'
                  style={{ height: '100px', width: '300px' }}
                >
                  <span className='text-sm text-gray-700 mb-2'>
                    📄 File PDF
                  </span>
                  <Button type='primary' style={{ width: '200px' }}>
                    <a
                      href={data.image}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Xem file
                    </a>
                  </Button>
                </div>
              ) : (
                <Image
                  alt='Image'
                  src={data.image}
                  width={285}
                  height={300}
                  className='object-cover cursor-pointer hover:scale-110 transition transform border rounded-2xl'
                />
              )
            ) : (
              <div>{renderMessage(data.body)}</div>
            )}
          </div>
          <div className={time}>
            {!isSystemMessage && (
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
            )}
            {isSystemMessage ? (
              <span className='text-[12px] w-full text-center block'>
                {format(new Date(data.createdAt), 'h:mm a')}
              </span>
            ) : (
              <span className='text-[12px] self-end'>
                {format(new Date(data.createdAt), 'h:mm a')}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBox;
