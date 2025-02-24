import React from 'react';

const CustomButton = ({ children, onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded w-full 
                  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:bg-blue-300`}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
};

export default CustomButton;
