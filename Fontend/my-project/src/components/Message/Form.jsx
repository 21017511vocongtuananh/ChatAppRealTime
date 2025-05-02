import { useEffect, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useWebSocket } from './WebSocketContext';
import EmojiPicker from 'emoji-picker-react';
import {
  HiPhoto,
  HiOutlineFaceSmile,
  HiPaperAirplane,
  HiPaperClip
} from 'react-icons/hi2';
import MessageInput from './MessageInput';
import ApiService from '../../services/apis';
import { message } from 'antd';

const Form = ({ messages, setMessages, block, setBlock }) => {
  const { conversationId } = useParams();
  const { sendMessage, subscribe } = useWebSocket();
  const messageSet = useRef(new Set());
  const userId = sessionStorage.getItem('userId');

  const [showEmojiPicker, toggleEmojiPicker] = useReducer(
    (state) => !state,
    false
  );

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: { message: '', image: '' }
  });

  const imageValue = watch('image');
  const messageValue = watch('message');

  useEffect(() => {
    messageSet.current.clear();
    const unsubscribe = subscribe(
      `/topic/conversation/${conversationId}`,
      (data) => {
        if (data && !data.deleted && (data.body || data.image)) {
          if (!messageSet.current.has(data.id)) {
            messageSet.current.add(data.id);
            setMessages((prev) => [...(prev || []), data]);
          }
        }
      }
    );
    return () => {
      messageSet.current.clear();
      unsubscribe();
    };
  }, [conversationId, subscribe, setMessages]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      !file.type.startsWith('image/') &&
      !file.type.startsWith('video/') &&
      file.type !== 'application/pdf'
    ) {
      message.error(
        'Unsupported file type. Please upload an image, video, or PDF.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (file.type === 'application/pdf') {
        setValue('image', {
          type: 'pdf',
          data: reader.result,
          name: file.name
        });
      } else if (file.type.startsWith('image/')) {
        setValue('image', reader.result);
      } else if (file.type.startsWith('video/')) {
        setValue('image', reader.result);
      }
    };
    reader.onerror = () => {
      message.error('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    if (!data.message.trim() && !data.image) return;

    const payload = {};
    if (data.message.trim()) payload.message = data.message;
    if (data.image) {
      payload.image =
        typeof data.image === 'object' ? data.image.data : data.image;
    }

    sendMessage(`/app/chat/${conversationId}`, payload);
    reset();
  };

  const handleUnblock = async () => {
    const blockedItem = block.find(
      (item) =>
        item.conversationId === conversationId && item.status === 'BLOCKED'
    );
    if (!blockedItem) return;

    const response = await ApiService.deleteBlock(blockedItem.friendId);
    if (response.code === 200) {
      message.success('Đã bỏ chặn thành công!');
    } else {
      message.error('Không thể bỏ chặn: ' + response.message);
    }
  };

  const isBlocked =
    Array.isArray(block) &&
    block.some(
      (item) =>
        item.conversationId === conversationId && item.status === 'BLOCKED'
    );

  return (
    <div className='py-1 bg-white border-t flex flex-col gap-2 w-full'>
      {isBlocked ? (
        <div className='text-red-500 text-center p-2'>
          Bỏ chặn để nhắn tin với người này{' '}
          <button
            onClick={handleUnblock}
            className='text-blue-500 hover:underline'
          >
            Bỏ chặn
          </button>
        </div>
      ) : (
        <>
          <div className='my-1 border-b-2 w-full flex items-center'>
            <label htmlFor='image-upload'>
              <HiPhoto
                className='my-1 ml-4 p-1 cursor-pointer rounded-md hover:bg-gray-300'
                size={35}
                aria-label='Upload image'
              />
            </label>
            <input
              id='image-upload'
              type='file'
              accept='image/*,video/*,application/pdf'
              onChange={handleFileChange}
              className='hidden'
              disabled={isBlocked}
            />
            <div className='relative'>
              <HiOutlineFaceSmile
                className='my-1 ml-1 p-1 cursor-pointer rounded-md hover:bg-gray-300'
                size={35}
                onClick={toggleEmojiPicker}
                aria-label='Open emoji picker'
              />
              {showEmojiPicker && (
                <div className='absolute bottom-12 left-0 z-50'>
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      setValue('message', messageValue + emojiData.emoji)
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {imageValue && (
            <div className='ml-4 mb-2 flex items-center gap-2'>
              {typeof imageValue === 'object' && imageValue.type === 'pdf' ? (
                <div className='flex items-center gap-2'>
                  <HiPaperClip size={24} />
                  <span>{imageValue.name}</span>
                </div>
              ) : imageValue.startsWith('data:video/') ? (
                <video
                  src={imageValue}
                  controls
                  className='w-40 h-24 object-cover rounded-md border'
                />
              ) : imageValue.startsWith('data:image/') ? (
                <img
                  src={imageValue}
                  alt='Selected file'
                  className='w-20 h-20 object-cover rounded-md border'
                />
              ) : null}
              <button
                type='button'
                onClick={() => setValue('image', '')}
                className='p-1 bg-red-500 text-white rounded-full'
                aria-label='Remove uploaded file'
              >
                X
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex items-center w-full gap-4 px-4'
          >
            <MessageInput
              id='message'
              register={register}
              placeholder='Type @, message to'
              className='flex-1'
              disabled={isBlocked}
            />
            <button
              type='submit'
              className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition disabled:bg-gray-300'
              disabled={isBlocked || (!imageValue && !messageValue)}
              aria-label='Send message'
              aria-disabled={isBlocked || (!imageValue && !messageValue)}
            >
              <HiPaperAirplane size={18} className='text-white' />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Form;
