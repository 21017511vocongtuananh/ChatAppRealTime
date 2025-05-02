import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import ApiService from '../../services/apis';

const SendOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    localStorage.setItem('email', email);
    setIsLoading(true);
    try {
      const response = await ApiService.sendOTP(email, mode);
      if (response?.code === 200) {
        message.success(response.data.message);
        setTimer(60);
        setConfirmation(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.trim() === '') {
      message.error('Vui lòng nhập mã OTP!');
      return;
    }

    try {
      const response = await ApiService.verifyOtp(email, otp);
      if (response?.code === 200 && response.data.status === 'OK') {
        message.success('Xác thực OTP thành công');
        if (mode === 'register') {
          navigate('/set-password');
        } else if (mode === 'reset') {
          navigate('/reset-password');
        }
      }
    } catch (err) {
      message.error(err?.message || 'Xác thực OTP thất bại!');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-b from-sky-300 to-blue-400'>
      <div className='bg-white p-8 rounded-xl shadow-lg text-center w-96'>
        <h2 className='text-2xl font-bold text-blue-600'>ZaLo</h2>
        <p className='text-gray-500 text-sm mt-1'>Đăng ký tài khoản Zalo</p>

        {/* Input Email */}
        <div className='mt-6'>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Nhập email'
            className='border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex items-center justify-between mt-2'>
          <label className='block text-sm font-medium text-gray-700 mt-1'>
            Mã xác thực
          </label>
          <span
            className={`text-blue-500 cursor-pointer hover:underline ${
              isLoading || timer > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={!isLoading && timer === 0 ? handleSendOTP : undefined}
          >
            {isLoading
              ? 'Đang gửi...'
              : timer > 0
              ? `Gửi lại OTP (${timer}s)`
              : 'Gửi OTP'}
          </span>
        </div>

        {/* Nhập mã OTP */}
        {confirmation && (
          <>
            <div className='mt-2 text-left'>
              <Input
                type='text'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder='Nhập mã OTP'
                className='w-full p-2 border justify-center border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
            <Button
              onClick={handleVerifyOTP}
              className='mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition'
            >
              Xác thực mã OTP
            </Button>
          </>
        )}
        <Button
          onClick={() => navigate('/')}
          className='mt-4 w-full text-blue-600 font-medium hover:underline'
        >
          Quay về
        </Button>
      </div>
    </div>
  );
};

export default SendOTP;
