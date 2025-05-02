import { useMemo, useState } from 'react';
import useOtherUser from '../../hooks/useOtherUser';
import { format } from 'date-fns';
import Avatar from '../Avartar/Avatar';
import AvatarGroup from '../Avartar/AvatarGroup';
import useActiveList from '../../hooks/useActiveList';
import CustomButton from '../Button/Button';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import ExitGroupModel from '../GroupModel/ExitGroupModel';
import usePhoneNumber from '../../hooks/usePhoneNumber';
import ApiService from '../../services/apis';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddUserGroupModal from '../GroupModel/AddUserGroupModel';

const ProfileDrawer = ({ isOpen, onClose, datas }) => {
  const otherUser = useOtherUser(datas || []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exitfirmOpen, setExitfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { members } = useActiveList();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = usePhoneNumber();

  const isActive = members.some(
    (member) => member.phoneNumber === otherUser.phoneNumber
  );

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return datas.name || otherUser.name;
  }, [datas.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (datas.isGroup) {
      return `${datas.users.length} thành viên`;
    }
    return isActive ? 'Online' : 'Offline';
  }, [datas, isActive]);

  const isAdmin = useMemo(() => {
    return datas.groupMembers?.some(
      (member) => member.userId === data?.id && member.role === 'ADMIN'
    );
  }, [datas.groupMembers, data?.id]);

  const handleLeaveGroup = async () => {
    if (isAdmin) {
      setExitfirmOpen(true);
    } else {
      try {
        setIsLoading(true);
        await ApiService.exitConversation(datas.id, null);
        message.success('Rời nhóm thành công');
        navigate('/conversations');
        onClose();
      } catch (error) {
        message.error('Lỗi khi rời nhóm: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
                {datas.isGroup ? (
                  <AvatarGroup users={datas.users} />
                ) : (
                  <Avatar user={otherUser} />
                )}
              </div>
              <div>{title}</div>
              <div className='text-sm text-gray-500'>{statusText}</div>
              <div className='flex gap-10 my-8'>
                <div
                  onClick={() => setConfirmOpen(true)}
                  className='flex flex-col p-2 bg-slate-400  rounded-[20px] gap-3 items-center cursor-pointer hover:opacity-75'
                >
                  <AiOutlineUsergroupAdd size={20} />
                </div>
              </div>
            </div>
            <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
              <dl className='space-y-8 sm:space-y-6'>
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
                    {datas.messages
                      .filter((message) => message.image)
                      .map((message) => {
                        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(
                          message.image
                        );
                        const isVideo = /\.(mp4|webm|mov|avi)$/i.test(
                          message.image
                        );
                        return (
                          <div key={message.id} className='relative group'>
                            {isImage && (
                              <img
                                src={message.image}
                                alt='Ảnh'
                                className='w-full h-24 object-cover rounded-md border'
                              />
                            )}
                            {isVideo && (
                              <video
                                src={message.image}
                                controls
                                className='w-full h-24 object-cover rounded-md border'
                              />
                            )}
                          </div>
                        );
                      })}
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
                  <div className='space-y-2'>
                    {datas.messages
                      .filter(
                        (message) =>
                          message.image &&
                          /\.(pdf|docx?|xlsx?)$/i.test(message.image)
                      )
                      .map((message) => (
                        <div
                          key={message.id}
                          className='flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 transition'
                        >
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-700'>
                              📄 File PDF
                            </span>
                            <a
                              href={message.image}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-sm text-blue-600 hover:underline'
                            >
                              {message.image.split('/').pop()}
                            </a>
                          </div>
                          <p className='text-xs text-gray-500'>
                            {new Date(message.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                        </div>
                      ))}
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
                    {datas.messages
                      .filter((message) =>
                        /https?:\/\/[^\s]+/.test(message.body)
                      )
                      .map((message) => (
                        <div
                          key={message.id}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center max-w-[80%]'>
                            <a
                              href={message.body}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-sm text-blue-600 hover:underline truncate'
                            >
                              {message.body}
                            </a>
                          </div>
                          <p className='text-xs text-gray-500'>
                            {new Date(message.createdAt).toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
                <div className='bg-white p-4 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-lg font-semibold text-gray-800'>
                      Thiết lập bảo mật
                    </h2>
                    <button className='text-gray-500'>▼</button>
                  </div>
                  <div className='space-y-4 '>
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
                  </div>
                  <div className='flex items-center mt-2'>
                    <CustomButton
                      type='submit'
                      isLoading={isLoading}
                      height={38}
                      className={'w-full '}
                      color='red'
                      onClick={() => setConfirmOpen(true)}
                    >
                      🗑️ Xóa lịch sử trò chuyện
                    </CustomButton>
                  </div>
                  <div className='flex items-center mt-2'>
                    {datas.isGroup && (
                      <CustomButton
                        type='button'
                        isLoading={isLoading}
                        height={38}
                        className='w-full'
                        color='gray'
                        onClick={handleLeaveGroup}
                      >
                        🚪 Rời khỏi nhóm
                      </CustomButton>
                    )}
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <AddUserGroupModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          data={datas}
        />
        <ExitGroupModel
          isOpen={exitfirmOpen}
          onClose={() => setExitfirmOpen(false)}
          data={datas}
        />
      </div>
    </>
  );
};

export default ProfileDrawer;
