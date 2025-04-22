import { useState } from 'react';
import { Input, message } from 'antd';
import { FiEdit2, FiCopy, FiShare2 } from 'react-icons/fi';
import Modal from '../Modal';
import Avatar from '../Avartar/Avatar';
import AvatarGroup from '../Avartar/AvatarGroup';
import CustomButton from '../Button/Button';
import ApiService from '../../services/apis';
import { IoChevronBack } from 'react-icons/io5';
import ChangeGroupLeaderModal from './ChangeGroupLeaderModal';

const TitleGroupModel = ({ isOpen, onClose, data }) => {
  const [groupName, setGroupName] = useState(data?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [changeGroupModel, setChangeGroupModel] = useState(false);
  const users = data?.users || [];
  const currentUserId = sessionStorage.getItem('userId'); // Lấy userId từ sessionStorage

  // Kiểm tra xem người dùng hiện tại có phải là ADMIN không
  const isAdmin = data?.groupMembers?.some(
    (member) => member.userId === currentUserId && member.role === 'ADMIN'
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between border-b-2 pb-6'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Thông tin nhóm
          </h2>
        </div>
        <div className='flex items-center space-x-4 border-b-2 pt-2 pb-6'>
          <div className='relative'>
            <AvatarGroup users={data?.users} size='large' />
            <div className='absolute bottom-0 right-0 bg-gray-200 rounded-full p-1'>
              <svg
                className='w-4 h-4 text-gray-600'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
          </div>
          <div className='flex-1'>
            {isEditingName ? (
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className='w-full py-1 px-2 border border-gray-300 rounded-md'
              />
            ) : (
              <h3 className='text-lg font-medium text-gray-900'>{groupName}</h3>
            )}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <h4 className='text-sm font-semibold text-gray-900'>
              Thành viên ({users.length})
            </h4>
            <button className='text-gray-500 hover:text-gray-700'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            </button>
          </div>
          <AvatarGroup users={users} />
        </div>
        <div className='space-y-2'>
          <h4 className='text-sm font-semibold text-gray-900'>Ảnh/Video</h4>
          <p className='text-sm text-gray-500'>
            Chưa có ảnh nào được chia sẻ trong nhóm này
          </p>
        </div>

        {isAdmin && (
          <>
            <CustomButton
              type='button'
              className='w-full py-2 rounded-md hover:bg-gray-200'
              color='gray'
              onClick={() => setChangeGroupModel(true)}
            >
              Chuyển quyền trưởng nhóm
            </CustomButton>

            <CustomButton
              type='button'
              className='w-full py-2 rounded-md hover:bg-gray-200'
              color='red'
            >
              <span className='flex items-center justify-center'>
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 12H3m0 0l4-4m-4 4l4 4m6-10h6a2 2 0 012 2v12a2 2 0 01-2 2h-6'
                  />
                </svg>
                Giải tán nhóm
              </span>
            </CustomButton>
          </>
        )}
      </div>
      <ChangeGroupLeaderModal
        isOpen={changeGroupModel}
        onClose={() => setChangeGroupModel(false)}
        data={data}
      />
    </Modal>
  );
};

export default TitleGroupModel;
