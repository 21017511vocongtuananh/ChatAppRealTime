import { useMemo, useState } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { format } from 'date-fns';
import { IoTrash } from 'react-icons/io5';
import Avatar from '@components/Avatar';
import ConfirmModal from '@components/ConfirmModal';
import AvatarGroup from '@components/AvatarGroup';

const ProfileDrawer = ({ isOpen, onClose, data }) => {
  const otherUser = useOtherUser(data.data || []);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.data.isGroup) {
      return `${data.data.users.length} thành viên`;
    }
    return 'Active';
  }, [data]);

  if (!isOpen) return null;

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <div className='h-full bg-white shadow-xl overflow-y-scroll'>
        <div className='px-4 sm:px-6 py-[23px] border-b'>
          <div className='flex items-center justify-center'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Thông tin hội thoại
            </h2>
            <button
              onClick={onClose}
              type='button'
              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
            ></button>
          </div>
        </div>
        <div className='relative mt-6 flex-1 px-4 sm:px-6'>
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              {data.data.isGroup ? (
                <AvatarGroup users={data.data.users} />
              ) : (
                <Avatar user={otherUser} />
              )}
            </div>
            <div>{title}</div>
            <div className='text-sm text-gray-500'>{statusText}</div>
            <div className='flex gap-10 my-8'>
              <div
                onClick={() => setConfirmOpen(true)}
                className='flex flex-col gap-3 items-center cursor-pointer hover:opacity-75'
              >
                <div className='w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center'>
                  <IoTrash size={20} />
                </div>
                <div className='text-sm font-light text-neutral-600'>
                  Delete
                </div>
              </div>
            </div>
          </div>
          <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
            <dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
              {!data.data.isGroup && (
                <div>
                  <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                    PhoneNumber
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                    {otherUser.phoneNumber}
                  </dd>
                </div>
              )}
              {!data.data.isGroup && (
                <>
                  <hr />
                  <div>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                      Joined
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      <time dateTime={joinedDate}>{joinedDate}</time>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
