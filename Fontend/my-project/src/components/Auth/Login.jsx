import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apis.js';
import CustomButton from '../Button/Button.jsx';
import { Input, Button } from 'antd';
import { useWebSocket } from '../Message/WebSocketContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { connect } = useWebSocket();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { phoneNumber, password } = formData;

    if (!/^\d{9,11}$/.test(phoneNumber)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.');
      return;
    }

    if (password.length < 5) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setIsLoading(true);
    try {
      const data = await ApiService.loginApi(formData);
      sessionStorage.setItem('token', data.data.token);
      sessionStorage.setItem('refreshToken', data.data.refreshToken);
      sessionStorage.setItem('userId', data.data.user.id);
      connect(data.data.token);
      navigate('/conversations');
    } catch (errorMessage) {
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-300'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold text-blue-600'>Zalo</h1>
          <p className='text-gray-600'>Đăng nhập với mật khẩu</p>
        </div>
        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='phoneNumber'
            >
              Số điện thoại
            </label>
            <div className='flex'>
              <select className='border border-gray-300 rounded-l px-3 py-2 bg-gray-100'>
                <option>+84</option>
              </select>
              <Input
                type='text'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='Số điện thoại'
                className='border border-gray-300 rounded-r px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
          </div>
          <div className='mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='password'
            >
              Mật khẩu
            </label>
            <Input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Mật khẩu'
              className='border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div className='mb-2 mt-2'>
            <span
              className='text-blue-500 cursor-pointer hover:underline'
              onClick={() => navigate('auth/sendOTP?mode=reset')}
            >
              Quên mật khẩu?
            </span>
          </div>
          <CustomButton
            type='submit'
            isLoading={isLoading}
            height={38}
            className={'w-full '}
          >
            Đăng nhập
          </CustomButton>
        </form>
        <div className='text-center mt-4'>
          <p className='text-gray-500'>
            Chưa có tài khoản?{' '}
            <span
              className='text-blue-500 cursor-pointer hover:underline'
              onClick={() => navigate('auth/sendOTP?mode=register')}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
