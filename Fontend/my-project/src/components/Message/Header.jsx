import { useMemo } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { Link } from 'react-router-dom';
import {
  HiChevronLeft,
  HiEllipsisHorizontal,
  HiMiniListBullet,
  HiMiniVideoCamera
} from 'react-icons/hi2';
import Avatar from '../Avatar';
import { MdOutlineGroupAdd } from 'react-icons/md';

const Header = ({ conversation }) => {
  const otherUser = useOtherUser(conversation.data || []);

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation?.users?.length || 0} members`;
    }
    return `Active`;
  }, [conversation]);

  return (
    <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
      <div className='flex gap-3 items-center'>
        <Link
          className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'
          to='/conversations'
        >
          <HiChevronLeft size={25} />
        </Link>
        <Avatar user={otherUser} />
        <div className='flex flex-col'>
          <div>{conversation.name || otherUser.name}</div>
          <div
            className='text-sm
          font-light
          text-neutral-500
          '
          >
            {statusText}
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <HiEllipsisHorizontal
          size={40}
          onClick={() => {}}
          className='
      cursor-pointer
      rounded-md
      hover:bg-gray-300
      p-2
      '
        />
        <MdOutlineGroupAdd
          size={40}
          onClick={() => {}}
          className='
      cursor-pointer
      rounded-md
     hover:bg-gray-300
     p-2
      '
        />
        <HiMiniVideoCamera
          size={40}
          onClick={() => {}}
          className='
      cursor-pointer
      rounded-md
     hover:bg-gray-300
     p-2
      '
        />
        <HiMiniListBullet
          size={40}
          onClick={() => {}}
          className='
      cursor-pointer
      rounded-md
     hover:bg-gray-300
     p-2
      '
        />
      </div>
    </div>
  );
};

export default Header;
