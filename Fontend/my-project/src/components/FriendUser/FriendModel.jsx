import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ReactCountryFlag from 'react-country-flag';
import ApiService from '../../services/apis';
import { Input, message } from 'antd';
import CustomButton from '../Button/Button';
import Avatar from '../Avartar/Avatar';
import Modal from '../Modal';

const FriendModel = ({ isOpen, onClose, users }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [friendIds, setFriendIds] = useState([]);
  const [acceptedFriendIds, setAcceptedFriendIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber('');
      setFoundUser(null);
      setIsSearching(false);
      setIsAdding(false);
      setFriendIds([]);
      setAcceptedFriendIds([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!phoneNumber.trim()) {
      setFoundUser(null);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchFriendData = async () => {
      try {
        const pendingResponse =
          await ApiService.getPendingFriendRequestsSentByUser();
        const pendingFriendIdsList = pendingResponse.data.map(
          (friend) => friend.friendId
        );
        setFriendIds(pendingFriendIdsList);
        const acceptedResponse = await ApiService.getFriendUserAccept();
        const acceptedFriendIdsList = acceptedResponse.data.map(
          (friend) => friend.friendId
        );
        setAcceptedFriendIds(acceptedFriendIdsList);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bạn bè:', error);
        message.error('Không thể lấy dữ liệu bạn bè');
      }
    };
    fetchFriendData();
  }, [isOpen]);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
    setPhoneNumber(value);
  };

  const searchPhoneFriend = async (phoneNumber) => {
    setIsSearching(true);
    try {
      const response = await ApiService.getPhoneFriend(phoneNumber);
      const user = response.data;
      if (
        user &&
        !friendIds.includes(user.id) &&
        !acceptedFriendIds.includes(user.id)
      ) {
        setFoundUser(user);
      } else {
        setFoundUser(null);
        message.info('Người dùng đã là bạn bè hoặc đã có lời mời kết bạn');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
      message.error('Không tìm thấy người dùng');
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      message.error('Vui lòng nhập số điện thoại');
      return;
    }
    if (!/^[0-9]{8,9}$/.test(phoneNumber)) {
      message.error('Số điện thoại phải có 9-10 số (không tính +84)');
      return;
    }
    const searchPhoneNumber = '0' + phoneNumber;
    searchPhoneFriend(searchPhoneNumber);
  };

  const handleAddFriend = async (userId) => {
    setIsAdding(true);
    try {
      await ApiService.sendFriend(userId);
      message.success('Đã gửi lời mời kết bạn');
      const response = await ApiService.getPendingFriendRequestsSentByUser();
      const friendIdsList = response.data.map((friend) => friend.friendId);
      setFriendIds(friendIdsList);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || 'Gửi lời mời thất bại');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onClose();
  };

  const filteredUsers =
    users?.filter(
      (user) =>
        !friendIds.includes(user.id) && !acceptedFriendIds.includes(user.id)
    ) || [];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <div className='space-y-6'>
          <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
            <h2 className='text-lg font-semibold text-gray-900'>Thêm bạn</h2>
          </div>

          <div className='mt-2 flex w-full'>
            <div className='flex items-center bg-white border border-gray-300 rounded-l-md py-2 px-4'>
              <ReactCountryFlag countryCode='VN' svg />
              <span className='ml-2 text-gray-700'>+84</span>
              <div className='ml-2 flex items-center'>
                <svg
                  className='w-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>

            <Input
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={isSearching}
              placeholder='Nhập số điện thoại'
              className='ml-2 w-full py-2 px-3 border border-gray-300 rounded-md'
            />
          </div>

          <div className='border-t pt-4'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Có thể bạn quen
            </label>
            <div className='max-h-60 overflow-y-auto mt-2 space-y-2'>
              {foundUser ? (
                <div
                  key={foundUser.id}
                  className='flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <Avatar user={foundUser} />
                    <div className='pb-3'>
                      <span className='text-sm font-medium text-gray-900'>
                        {foundUser.name}
                      </span>
                      <p className='text-xs text-gray-500'>
                        {foundUser.phoneNumber}
                      </p>
                      <p className='text-xs text-gray-500'>Từ số điện thoại</p>
                    </div>
                  </div>
                  <CustomButton
                    onClick={() => handleAddFriend(foundUser.id)}
                    disabled={isAdding}
                    type='button'
                    width={100}
                    height={28}
                    className='text-sm'
                  >
                    {isAdding ? '...' : 'Kết bạn'}
                  </CustomButton>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id || user.phoneNumber}
                    className='flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <Avatar user={user} />
                      <div className='pb-3'>
                        <span className='text-sm font-medium text-gray-900'>
                          {user.name}
                        </span>
                        <p className='text-xs text-gray-500'>
                          {user.phoneNumber}
                        </p>
                        <p className='text-xs text-gray-500'>
                          Từ danh sách gợi ý
                        </p>
                      </div>
                    </div>
                    <CustomButton
                      onClick={() => handleAddFriend(user.id)}
                      disabled={isAdding}
                      type='button'
                      width={100}
                      height={28}
                      className='text-sm'
                    >
                      {isAdding ? '...' : 'Kết bạn'}
                    </CustomButton>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>Không có gợi ý nào</p>
              )}
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-4'>
          <CustomButton
            disabled={isSearching || isAdding}
            onClick={handleCancel}
            type='button'
            color='red'
            className='text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200'
            width={200}
            height={38}
          >
            Hủy
          </CustomButton>
          <CustomButton
            disabled={isSearching}
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            width={200}
            height={38}
          >
            {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default FriendModel;
