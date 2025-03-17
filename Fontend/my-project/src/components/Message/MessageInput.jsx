const MessageInput = ({ id, register, required, placeholder }) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className={`text-black bg-gray-100 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500`}
      />
    </div>
  );
};

export default MessageInput;
