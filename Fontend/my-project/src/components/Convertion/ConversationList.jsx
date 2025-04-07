import React, { useEffect, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import useConversation from '../../hooks/useConversation.js';
import ConversationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';
import FriendModel from '../FriendUser/FriendModel';

const ConversationList = ({ initialItems, users }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFriendModel, setIsFriendModel] = useState(false);
  const { conversationId, isOpen } = useConversation();

  useEffect(() => {
    setItems([...initialItems]);
  }, [initialItems]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <FriendModel
        users={users}
        isOpen={isFriendModel}
        onClose={() => setIsFriendModel(false)}
      />
      <aside
        className={clsx(
          'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r  border-gray-200 hidden w-full left-0',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-2'>
          <div className='flex items-center justify-between mb-4 pt-4 space-x-4'>
            <div className='flex items-center flex-1 bg-gray-100 p-2 rounded-md'>
              <FaSearch className='text-gray-400 ml-2' />
              <input
                type='text'
                placeholder='Tìm kiếm'
                className='bg-gray-100 outline-none ml-2 w-full'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <div
                onClick={() => setIsFriendModel(true)}
                className='flex items-center justify-center p-2 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition'
              >
                <FaUserPlus size={18} />
              </div>
              <div
                onClick={() => setIsModalOpen(true)}
                className='flex items-center justify-center p-2 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 transition'
              >
                <MdOutlineGroupAdd size={18} />
              </div>
            </div>
          </div>
          <div className='border-b border-gray-300 mb-2'>
            <div className='flex space-x-3 text-gray-500 text-sm font-medium'>
              <div className='cursor-pointer text-blue-600 border-b-2 border-blue-600 pb-2'>
                Tất cả
              </div>
              <div className='cursor-pointer hover:text-blue-600 pb-2 pr-12'>
                Chưa đọc
              </div>
              <div className='cursor-pointer hover:text-blue-600 pb-2 flex items-center space-x-1'>
                <span>Phân loại</span>
                <span>▼</span>
              </div>
              <div className='cursor-pointer hover:text-blue-600 pb-2'>⋯</div>
            </div>
          </div>
        </div>
        <div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
