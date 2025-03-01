import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
    py-4
    px-4
    bg-white
    border-t
    flex
    items-center
    gap-2
    lg:gap-4
    w-full
    '
    >
      Form!
    </div>
  );
};

export default Form;
