import { useCallback, useState } from 'react';
import useConversation from '../../hooks/useConversation.js';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apis.js';
import { message } from 'antd';
import Modal from '../Modal.jsx';
import { FiAlertTriangle } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import CustomButton from '../Button/Button.jsx';

const ConfirmModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await ApiService.deleteHistoryMessageUser(conversationId);
      onClose();
      navigate('/conversations');
    } catch (error) {
      const errorMessage = error.response?.message;
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, onClose, navigate]);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='sm:flex sm:items-start'>
          <div
            className='
        mx-auto
        flex
        h-12
        w-12
        flex-shrink-0
        items-center
        justify-center
        rounded-full
        bg-red-100
        sm:mx-0
        sm:h-10
        sm:w-10
        '
          >
            <FiAlertTriangle className='h-6 w-6 text-red-600' />
          </div>
          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
            <Dialog.Title
              as='h3'
              className='text-base
           font-semibold
           leading-6
           text-gray-900
           '
            >
              Xác nhận
            </Dialog.Title>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                Toàn bộ nội dung trò chuyện sẽ bị xóa vĩnh viễn.
                <br />
                Bạn có chắc chắn muốn xóa?
              </p>
            </div>
          </div>
        </div>
        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
          <CustomButton
            isLoading={isLoading}
            onClick={onDelete}
            color='red'
            width={100}
            height={38}
          >
            Delete
          </CustomButton>
          <CustomButton
            isLoading={isLoading}
            onClick={onClose}
            color='gray'
            size='small'
            width={100}
            height={38}
          >
            Cancel
          </CustomButton>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
