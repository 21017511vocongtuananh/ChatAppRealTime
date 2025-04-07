import React from 'react';

const CustomButton = ({
  children,
  onClick,
  isLoading,
  disabled,
  color = 'blue',
  size = 'medium',
  width,
  height,
  fontSize,
  className
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 disabled:bg-blue-300',
    red: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
    gray: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-300 text-black'
  };

  const style = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    fontSize: fontSize ? `${fontSize}px` : undefined
  };

  const sizeClasses = {
    small: 'mr-4',
    medium: ''
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-white font-bold rounded 
                  focus:outline-none focus:ring-2 ${colorClasses[color]} ${
        sizeClasses[size]
      } ${className || ''}`}
      style={style}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
};

export default CustomButton;
