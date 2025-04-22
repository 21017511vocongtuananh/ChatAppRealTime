import React, { memo } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Avatar from '../Avartar/Avatar';
import useOtherUser from '../../hooks/useOtherUser';
import { format, parseISO } from 'date-fns';
import usePhoneNumber from '../../hooks/usePhoneNumber.js';
import AvatarGroup from '../Avartar/AvatarGroup';

const ConversationBox = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const { phone } = usePhoneNumber();

  const handleClick = useCallback(() => {
    navigate(`/conversations/${data.id}`);
  }, [data.id, navigate]);

  // Lấy tin nhắn cuối cùng
  const lastMessage = useMemo(() => {
    return (data.messages || [])[data.messages.length - 1];
  }, [data.messages]);

  const userNumPhone = useMemo(() => {
    return phone;
  }, [phone]);

  const hasSeen = useMemo(() => {
    if (!lastMessage?.seen || !userNumPhone) return false;
    return lastMessage.seen.some((user) => user.phoneNumber === userNumPhone);
  }, [userNumPhone, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (!lastMessage) return 'Bắt đầu cuộc trò chuyện';

    const isOwnMessage = lastMessage.sender?.phoneNumber === userNumPhone;
    const senderName = isOwnMessage ? 'Bạn' : lastMessage.sender?.name || '';
    if (lastMessage.deleted) {
      return `${senderName} : tin nhắn này đã được thu hồi`;
    }
    if (lastMessage.image) {
      return `${senderName} : đã gữi ảnh`;
    }
    if (lastMessage.body) {
      return `${senderName} : ${lastMessage.body}`;
    }

    return 'Bắt đầu cuộc trò chuyện';
  }, [lastMessage, userNumPhone]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'w-full relative flex items-center space-x-3 hover:bg-neutral-100 transition cursor-pointer p-2',
        selected ? 'bg-[#DBEBFF]' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

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
              hasSeen ? 'text-black' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ConversationBox);
