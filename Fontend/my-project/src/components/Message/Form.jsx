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

const Form = ({ messages, setMessages }) => {
  const { conversationId } = useParams();
  const { sendMessage, subscribe } = useWebSocket();
  const messageSet = useRef(new Set());
  const subscribed = useRef(false); // Ngăn trùng lặp subscription

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
    if (subscribed.current) return; // Ngăn subscribe lại

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

    subscribed.current = true;
    return () => {
      subscribed.current = false;
      unsubscribe();
    };
  }, [conversationId, subscribe, setMessages]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    if (!data.message.trim() && !data.image) return;

    const payload = {
      message: data.message || '',
      image:
        data.image && typeof data.image === 'object'
          ? data.image.data
          : data.image || ''
    };

    sendMessage(`/app/chat/${conversationId}`, payload);
    reset();
  };

  return (
    <div className='py-1 bg-white border-t flex flex-col gap-2 w-full'>
      <div className='my-1 border-b-2 w-full flex items-center'>
        <label htmlFor='image-upload'>
          <HiPhoto
            className='my-1 ml-4 p-1 cursor-pointer rounded-md hover:bg-gray-300'
            size={35}
          />
        </label>
        <input
          id='image-upload'
          type='file'
          accept='image/*,video/*,application/pdf'
          onChange={handleFileChange}
          className='hidden'
        />
        <div className='relative'>
          <HiOutlineFaceSmile
            className='my-1 ml-1 p-1 cursor-pointer rounded-md hover:bg-gray-300'
            size={35}
            onClick={toggleEmojiPicker}
          />
          {showEmojiPicker && (
            <div className='absolute bottom-12 left-0 z-40'>
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
        />
        <button
          type='submit'
          className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition disabled:bg-gray-300'
          disabled={!imageValue && !messageValue}
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  );
};

export default Form;
