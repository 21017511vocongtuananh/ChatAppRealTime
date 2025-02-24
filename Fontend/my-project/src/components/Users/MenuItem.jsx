const MenuItem = ({ icon, text, active }) => {
  return (
    <div
      className={`flex items-center p-2 rounded-md cursor-pointer ${
        active ? 'bg-blue-100' : 'hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className='ml-2 text-gray-700'>{text}</span>
    </div>
  );
};

export default MenuItem;
