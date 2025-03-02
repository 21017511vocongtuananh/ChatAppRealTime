const MessageInput = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors
}) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className='text-black font-light py-2 px-4 w-full focus:outline-none'
      ></input>
    </div>
  );
};

export default MessageInput;
