import { useState } from 'react';
import { Input, Tabs, Checkbox, message, Image } from 'antd';
import CustomButton from '../Button/Button';
import Avatar from '../Avartar/Avatar';
import Modal from '../Modal';
import AvatarGroup from '../Avartar/AvatarGroup';
import ApiService from '../../services/apis';

const MessageShareModel = ({ isOpen, onClose, conversations, messageData }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [body, setBody] = useState('');

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      message.error('Vui lòng chọn ít nhất một người dùng để chia sẻ.');
      return;
    }
    try {
      const response = await ApiService.shareMessage({
        messageId: messageData.id,
        conversationIds: selectedUsers,
        body
      });
      message.success('Chia sẻ tin nhắn thành công');
      setSelectedUsers([]);
      setBody('');
      onClose();
    } catch (error) {
      message.error('Lỗi khi chia sẻ tin nhắn: ' + error.message);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Nhóm trò chuyện',
      children: (
        <div className='max-h-60 overflow-y-auto mt-2 space-y-2'>
          {conversations?.length > 0 &&
          conversations.some((conv) => conv.isGroup) ? (
            conversations
              .filter((conv) => conv.isGroup)
              .map((conv) => (
                <div
                  key={conv.id}
                  className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded'
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.includes(conv.id)
                        ? prev.filter((id) => id !== conv.id)
                        : [...prev, conv.id]
                    )
                  }
                >
                  <Checkbox checked={selectedUsers.includes(conv.id)} />
                  <AvatarGroup users={conv.users} />
                  <span className='text-gray-900'>
                    {conv.name || 'Nhóm không tên'}
                  </span>
                </div>
              ))
          ) : (
            <div className='text-sm text-gray-500'>
              Không có nhóm trò chuyện
            </div>
          )}
        </div>
      )
    },
    {
      key: '2',
      label: 'Bạn bè',
      children: (
        <div className='max-h-60 overflow-y-auto mt-2 space-y-2'>
          {conversations?.length > 0 &&
          conversations.some((conv) => !conv.isGroup) ? (
            conversations
              .filter((conv) => !conv.isGroup)
              .map((conv) => (
                <div
                  key={conv.id}
                  className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded'
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.includes(conv.id)
                        ? prev.filter((id) => id !== conv.id)
                        : [...prev, conv.id]
                    )
                  }
                >
                  <Checkbox checked={selectedUsers.includes(conv.id)} />
                  <Avatar user={conv.users?.[1]} />
                  <span className='text-gray-900'>
                    {conv.users?.[1]?.name || 'Không tên'}
                  </span>
                </div>
              ))
          ) : (
            <div className='text-sm text-gray-500'>Không có bạn bè</div>
          )}
        </div>
      )
    }
  ];

  const renderMessageContent = () => {
    if (messageData?.image) {
      const isVideo = messageData.image.endsWith('.mp4');
      const isFile = messageData.image.endsWith('.pdf');
      if (isVideo) {
        return (
          <video
            src={messageData.image}
            controls
            className='max-w-full rounded-md'
            style={{ maxHeight: '200px' }}
          />
        );
      } else if (isFile) {
        return (
          <a
            href={messageData.image}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 underline'
          >
            Xem file PDF
          </a>
        );
      } else {
        return (
          <Image
            src={messageData.image}
            alt='Shared image'
            className='max-w-full rounded-md'
            style={{ maxHeight: '200px' }}
          />
        );
      }
    }
    return (
      <p className='text-sm text-gray-700 flex-1'>
        {messageData?.body || 'Không có tin nhắn để chia sẻ'}
      </p>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-4'>
        <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
          <h2 className='text-lg font-semibold text-gray-900'>Chia sẻ</h2>
        </div>

        <div className='flex w-full'>
          <Input
            placeholder='Tìm kiếm...'
            className='w-full py-2 px-3 border border-gray-300 rounded-md'
            prefix={<span className='text-gray-400'>🔍</span>}
          />
        </div>
        <Tabs defaultActiveKey='1' items={tabItems} />
        <div className='border-t pt-4'>
          <label className='block text-sm font-medium leading-6 text-gray-900'>
            Chia sẻ tin nhắn
          </label>
          <div className='mt-2 p-3 bg-gray-100 rounded-lg flex items-start gap-2'>
            {renderMessageContent()}
          </div>
        </div>
        <div>
          <textarea
            placeholder='Nhập tin nhắn...'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-md text-sm text-gray-700 resize-none'
            rows={2}
          />
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-4'>
          <CustomButton
            onClick={onClose}
            type='button'
            className='text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100'
            width={100}
            height={38}
          >
            Hủy
          </CustomButton>
          <CustomButton
            onClick={handleShare}
            type='button'
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            width={100}
            height={38}
            disabled={selectedUsers.length === 0}
          >
            Chia sẻ
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default MessageShareModel;
