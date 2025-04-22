import React from 'react';

const GroupInvitations = () => (
  <div className='flex-1 overflow-y-auto bg-gray-100'>
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold text-blue-900'>
          Lời mời vào nhóm (23)
        </h2>
      </div>
    </div>
    <div className='p-4'>
      <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className='w-10 h-10 rounded-full mr-3'
            />
            <div>
              <p className='font-semibold'>Trâm Hồ</p>
              <p className='text-sm text-gray-500'>31:03</p>
            </div>
          </div>
          <div className='flex space-x-2'>
            <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
              Thư hồi mời
            </button>
          </div>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className='w-10 h-10 rounded-full mr-3'
            />
            <div>
              <p className='font-semibold'>Anna Nguyen</p>
              <p className='text-sm text-gray-500'>Bạn đã gửi lời mời</p>
            </div>
          </div>
          <div className='flex space-x-2'>
            <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
              Thư hồi mời
            </button>
          </div>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <img
              src='https://via.placeholder.com/40'
              alt='User'
              className='w-10 h-10 rounded-full mr-3'
            />
            <div>
              <p className='font-semibold'>Ngô Trường Đức Tin</p>
              <p className='text-sm text-gray-500'>Bạn đã gửi lời mời</p>
            </div>
          </div>
          <div className='flex space-x-2'>
            <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg'>
              Thư hồi mời
            </button>
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <button className='text-blue-500'>Xem thêm</button>
      </div>
    </div>
  </div>
);

export default GroupInvitations;
