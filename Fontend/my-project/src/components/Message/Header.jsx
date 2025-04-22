import { useMemo, useState } from 'react';
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

const Header = ({ conversation, setDrawerOpen, drawerOpen }) => {
  const otherUser = useOtherUser(conversation.data || []);
  const { conversationId } = useConversation();
  const [user, setUser] = useState(() => sessionStorage.getItem('userId'));
  const { members } = useActiveList();
  const [titleModeGroup, setTitleModeGroup] = useState(false);
  const isActive = members.some(
    (member) => member.phoneNumber === otherUser.phoneNumber
  );

  const statusText = useMemo(() => {
    if (conversation?.data.isGroup) {
      return `${conversation?.data?.users?.length || 0} thành viên`;
    }
    return isActive ? `Online` : `Offline`;
  }, [conversation, isActive]);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const startVideoCall = () => {
    setIsVideoCallOpen(true);
  };

  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const handleOpenTitleGroupModel = () => {
    setTitleModeGroup(true);
  };

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
          {conversation?.data.isGroup ? (
            <div onClick={handleOpenTitleGroupModel} className='cursor-pointer'>
              <AvatarGroup users={conversation?.data?.users} />
            </div>
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation.data.name || otherUser.name}</div>
            <div className='text-sm font-light text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <MdOutlineGroupAdd
            size={40}
            onClick={() => {}}
            className='cursor-pointer rounded-md hover:bg-gray-300 p-2'
          />
          <HiMiniVideoCamera
            size={40}
            onClick={startVideoCall}
            className='cursor-pointer rounded-md hover:bg-gray-300 p-2'
          />
          <HiMiniListBullet
            size={40}
            onClick={toggleDrawer}
            className='cursor-pointer rounded-md hover:bg-gray-300 p-2'
          />
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
        data={conversation.data}
      />
    </>
  );
};

export default Header;
