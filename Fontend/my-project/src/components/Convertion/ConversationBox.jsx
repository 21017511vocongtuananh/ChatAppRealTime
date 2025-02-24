import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Avatar from '@/components/Avatar';
import ApiService from '../../services/apis';
import useOtherUser from '../../hooks/useOtherUser';
import { format, parseISO } from 'date-fns';

const ConversationBox = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const [phone, setPhone] = useState();

  // Chuyển trang khi click vào ConversationBox
  const handleClick = useCallback(() => {
    navigate(`/conversations/${data.id}`);
  }, [data.id, navigate]);

  // Lấy tin nhắn cuối cùng
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  // Lấy số điện thoại của user đăng nhập
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await ApiService.getPhoneLogin();
        setPhone(response.user.phoneNumber || '');
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const userNumPhone = useMemo(() => {
    return phone;
  }, [phone]);

  const hasSeen = useMemo(() => {
    if (!lastMessage || !userNumPhone) {
      return false;
    }
    return (
      lastMessage.seenUsers?.some(
        (user) => user.phoneNumber === userNumPhone
      ) || false
    );
  }, [userNumPhone, lastMessage]);

  // Nội dung hiển thị của tin nhắn cuối
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return 'Start a conversations';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer',
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      <Avatar user={otherUser} />
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className='text-md font-medium text-gray-900'>
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-xs text-gray-400 font-light'>
                {format(parseISO(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              'truncate text-sm',
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
