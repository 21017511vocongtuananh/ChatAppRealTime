import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  HiFaceSmile,
  HiOutlineFaceSmile,
  HiOutlineIdentification,
  HiOutlinePaperClip,
  HiPaperAirplane,
  HiPhoto
} from 'react-icons/hi2';
import MessageInput from './MessageInput';

const Form = () => {
  const { conversationId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/messages', {
        ...data,
        conversationId
      });
      setValue('message', '', { shouldValidate: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div
      className='
    py-1
    bg-white
    border-t
    items-center
    gap-2
    lg:gap-4
    w-full
    '
    >
      <div className='my-1 border-b-2 w-full flex'>
        <HiPhoto
          className='my-1 ml-4 p-1  cursor-pointer rounded-md hover:bg-gray-300 '
          size={35}
        />
        <HiOutlineFaceSmile
          className='my-1 ml-1 p-1  cursor-pointer rounded-md hover:bg-gray-300 '
          size={35}
        />
        <HiOutlinePaperClip
          className='my-1 ml-1 p-1  cursor-pointer rounded-md hover:bg-gray-300 '
          size={35}
        />
        <HiOutlineIdentification
          className='my-1 ml-1 p-1  cursor-pointer rounded-md hover:bg-gray-300 '
          size={35}
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center w-full lg:gap-4'
      >
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='Nhập @, tin nhắn tới '
        />
        <button
          type='submit'
          className='mr-4 rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  );
};

export default Form;
