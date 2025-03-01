import { useMemo } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import Avatar from '../Avatar';

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
          to='/conversation'
        >
          <HiChevronLeft size={32} />
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
      <HiEllipsisHorizontal
        size={32}
        onClick={() => {}}
        className='
      text-sky-500
      cursor-pointer
      hover:text-sky-600
      transition
      '
      />
    </div>
  );
};

export default Header;
