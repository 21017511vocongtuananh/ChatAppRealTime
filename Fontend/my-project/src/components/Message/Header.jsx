import { useMemo, useState, useEffect } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { Link } from 'react-router-dom';
import {
  HiChevronLeft,
  HiMiniListBullet,
  HiMiniVideoCamera
} from 'react-icons/hi2';
import Avatar from '../Avartar/Avatar';
import { MdOutlineGroupAdd } from 'react-icons/md';
import AvatarGroup from '../Avartar/AvatarGroup';
import useActiveList from '../../hooks/useActiveList';
import VideoCall from './VideoCall';
import useConversation from '../../hooks/useConversation';
import TitleGroupModel from '../GroupModel/TitleGroupModel';
import { useWebSocket } from './WebSocketContext';
import { Tooltip } from 'antd';

const Header = ({ conversation, setDrawerOpen, drawerOpen }) => {
  const otherUser = useOtherUser(conversation || []);
  const { conversationId } = useConversation();
  const { members } = useActiveList();
  const [titleModeGroup, setTitleModeGroup] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const {
    sendMessage,
    subscribe,
    isConnected: isWebSocketConnected
  } = useWebSocket();
  const user = sessionStorage.getItem('userId');

  const isActive = members.some(
    (member) => member.phoneNumber === otherUser.phoneNumber
  );

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation?.users?.length || 0} thành viên`;
    }
    return isActive ? 'Online' : 'Offline';
  }, [conversation, isActive]);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleOpenTitleGroupModel = () => {
    setTitleModeGroup(true);
  };

  const startVideoCall = () => {
    if (!conversationId || !user || !otherUser.id || !isWebSocketConnected) {
      console.error('Thiếu thông tin để bắt đầu cuộc gọi:', {
        conversationId,
        user,
        receiverId: otherUser.id,
        isWebSocketConnected
      });
      return;
    }

    const signalMessage = {
      type: 'CALL',
      conversationId,
      senderId: user,
      receiverId: otherUser.id,
      roomID: conversationId
    };

    sendMessage(`/app/call/${conversationId}`, signalMessage);
    setIsVideoCallOpen(true);
  };

  useEffect(() => {
    if (!conversationId || !user) return;

    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (signal) => {
        if (signal.type === 'CALL' && signal.receiverId === user) {
          setIsVideoCallOpen(true);
        } else if (
          signal.type === 'CANCEL_CALL' &&
          signal.receiverId === user
        ) {
          setIsVideoCallOpen(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, user, subscribe]);

  return (
    <>
      <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className='flex gap-3 items-center'>
          <Link
            className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'
            to='/conversations'
          >
            <HiChevronLeft size={25} />
          </Link>
          {conversation?.isGroup ? (
            <div onClick={handleOpenTitleGroupModel} className='cursor-pointer'>
              <AvatarGroup users={conversation?.users} />
            </div>
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>
            <div className='text-sm font-light text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <Tooltip title='Thêm thành viên nhóm'>
            <MdOutlineGroupAdd
              size={40}
              onClick={() => {}}
              className='cursor-pointer rounded-md hover:bg-gray-300 p-2'
            />
          </Tooltip>
          <Tooltip
            title={isWebSocketConnected ? 'Gọi video' : 'Kết nối đang ngắt'}
          >
            <HiMiniVideoCamera
              size={40}
              onClick={startVideoCall}
              className={`cursor-pointer rounded-md hover:bg-gray-300 p-2 ${
                !isWebSocketConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </Tooltip>
          <Tooltip title='Thông tin cuộc trò chuyện'>
            <HiMiniListBullet
              size={40}
              onClick={toggleDrawer}
              className='cursor-pointer rounded-md hover:bg-gray-300 p-2'
            />
          </Tooltip>
        </div>
      </div>
      {isVideoCallOpen && (
        <VideoCall
          conversationId={conversationId}
          userId={user}
          receiverId={otherUser.id}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}
      <TitleGroupModel
        isOpen={titleModeGroup}
        onClose={() => setTitleModeGroup(false)}
        data={conversation}
      />
    </>
  );
};

export default Header;
