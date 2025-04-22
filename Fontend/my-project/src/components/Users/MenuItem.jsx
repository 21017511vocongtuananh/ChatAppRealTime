import React from 'react';

const MenuItem = ({ icon, text, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-2 rounded-md cursor-pointer ${
      active ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
    }`}
  >
    <div className='mr-3'>{icon}</div>
    <span>{text}</span>
  </div>
);

export default MenuItem;
