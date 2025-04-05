import { useMemo, useState } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { format } from 'date-fns';
import { IoTrash } from 'react-icons/io5';
import Avatar from '@components/Avatar';
import ConfirmModal from '@components/ConfirmModal';
import AvatarGroup from '@components/AvatarGroup';
import useActiveList from '../../hooks/useActiveList';

const ProfileDrawer = ({ isOpen, onClose, data }) => {
  const otherUser = useOtherUser(data.data || []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.some(
    (member) => member.phoneNumber === otherUser.phoneNumber
  );

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.data.name || otherUser.name;
  }, [data.data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.data.isGroup) {
      return `${data.data.users.length} thành viên`;
    }
    return isActive ? 'Online' : 'Offline';
  }, [data, isActive]);

  if (!isOpen) return null;

  return (
    <>
      <div className='h-full bg-white shadow-xl'>
        <div className='sticky top-0 z-10 bg-white px-4 sm:px-6 py-[23px] border-b'>
          <div className='flex items-center justify-center'>
            <h2 className='text-lg font-semibold text-gray-800'>
              Thông tin hội thoại
            </h2>
          </div>
        </div>
        <div className='overflow-y-scroll h-[calc(100%-80px)]'>
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
                  {/* <div className='w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center'>
              <IoTrash size={20} />
            </div>
            <div className='text-sm font-light text-neutral-600'>
              Delete
            </div> */}
                </div>
              </div>
            </div>
            <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
              <dl className='space-y-8 sm:space-y-6'>
                {data.data.isGroup && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                      Thành viên
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      {statusText}
                    </dd>
                  </div>
                )}
                <div className='bg-white p-4 rounded-lg shadow-md mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      Ảnh/Video
                    </h2>
                    <button className='text-blue-500 text-sm'>
                      Xem tất cả
                    </button>
                  </div>
                  <div className='grid grid-cols-3 gap-2'>
                    <div className='bg-gray-200 h-24 rounded-md flex items-center justify-center'>
                      <span className='text-gray-500'>Image</span>
                    </div>
                  </div>
                  <hr className='my-4' />
                  <div className='flex'>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                      Joined
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      <time dateTime={joinedDate}>{joinedDate}</time>
                    </dd>
                  </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-md mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      File
                    </h2>
                    <button className='text-blue-500 text-sm'>
                      Xem tất cả
                    </button>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b'>
                    <div className='flex items-center'>
                      <img
                        src='/word-icon.png'
                        alt='Word Icon'
                        className='w-6 h-6 mr-2'
                      />
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          HDTuan6.docx
                        </p>
                        <p className='text-xs text-gray-500'>187.09 kB</p>
                      </div>
                    </div>
                    <p className='text-xs text-gray-500'>19/03/2025</p>
                  </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-md mb-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      Link
                    </h2>
                    <button className='text-blue-500 text-sm'>
                      Xem tất cả
                    </button>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <img
                          src='/link-icon.png'
                          alt='Link Icon'
                          className='w-6 h-6 mr-2'
                        />
                        <p className='text-sm text-gray-900 truncate'>
                          GitHub - DinhVanKhanh/chatapp-mob...
                        </p>
                      </div>
                      <p className='text-xs text-gray-500'>18/03</p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <img
                          src='/link-icon.png'
                          alt='Link Icon'
                          className='w-6 h-6 mr-2'
                        />
                        <p className='text-sm text-gray-900 truncate'>
                          http://localhost:8080/ws
                        </p>
                      </div>
                      <p className='text-xs text-gray-500'>13/03</p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <img
                          src='/link-icon.png'
                          alt='Link Icon'
                          className='w-6 h-6 mr-2'
                        />
                        <p className='text-sm text-gray-900 truncate'>
                          http://localhost:8080/api/otp/send?E...
                        </p>
                      </div>
                      <p className='text-xs text-gray-500'>28/02</p>
                    </div>
                  </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      Thiết lập bảo mật
                    </h2>
                    <button className='text-gray-500'>▼</button>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-blue-500 mr-2'>⏳</span>
                        <p className='text-sm text-gray-900'>Tin nhắn tự xóa</p>
                      </div>
                      <p className='text-sm text-gray-500'>Không bao giờ</p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-blue-500 mr-2'>👁️</span>
                        <p className='text-sm text-gray-900'>Ẩn trò chuyện</p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input type='checkbox' className='sr-only peer' />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-red-500 mr-2'>⚠️</span>
                        <p className='text-sm text-red-500'>Báo xấu</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className='text-red-500 mr-2'>🗑️</span>
                        <p className='text-sm text-red-500'>
                          Xóa lịch sử trò chuyện
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <ConfirmModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
        />
      </div>
    </>
  );
};

export default ProfileDrawer;
